import React, { useEffect, useRef } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import Snow from './components/Snow';

function App() {
  const mp3Url = 'https://cdn.pixabay.com/audio/2025/11/29/audio_d1c955f418.mp3';
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.2; // Set volume to 20%
      audio.loop = true; // Loop the music
      // Attempt to play, but handle autoplay restrictions
      audio.play().catch((error) => {
        // Autoplay may be blocked by browser policy
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <div className="App">
       <audio ref={audioRef} src={mp3Url} />
       <Snow />
       <Leaderboard />
    </div>
  );
}

export default App;
