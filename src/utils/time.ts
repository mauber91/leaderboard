export const formatTimeAgo = (input: string | number | Date): string => {
  const date = new Date(input);
  const now = Date.now();
  const then = date.getTime();
  if (isNaN(then)) return '';

  let seconds = Math.max(0, Math.floor((now - then) / 1000));

  // Do not show seconds or minutes; summarize anything under 1 hour
  if (seconds < 60 * 60) return 'less than 1 hour ago';

  const units: { name: string; secs: number }[] = [
    { name: 'year', secs: 365 * 24 * 60 * 60 },
    { name: 'month', secs: 30 * 24 * 60 * 60 },
    { name: 'day', secs: 24 * 60 * 60 },
    { name: 'hour', secs: 60 * 60 },
  ];

  const parts: string[] = [];
  for (const { name, secs } of units) {
    if (parts.length >= 2) break; // only two largest units
    if (seconds >= secs) {
      const qty = Math.floor(seconds / secs);
      parts.push(`${qty} ${name}${qty === 1 ? '' : 's'}`);
      seconds -= qty * secs;
    }
  }

  return `${parts.join(' ')} ago`;
};
