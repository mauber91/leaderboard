// call your Worker endpoint (e.g., https://llm-proxy.<your-subdomain>.workers.dev/api/chat)
// if you bound a route, just use that URL.

// const LLM_API_URL = process.env.REACT_APP_LLM_API_URL || 'http://localhost:8787';


export async function streamResponse(url: string, input: string, onToken: (t: string) => void) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) throw new Error(await res.text());

  // Parse SSE
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    for (const line of buf.split("\n")) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          // Responses API uses "output_text" convenience or incremental "delta"
          const token = json.output_text ?? json.delta ?? "";
          if (token) onToken(token);
        } catch {}
      }
    }
  }
}
