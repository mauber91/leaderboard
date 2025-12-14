import React, { useEffect, useRef } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import Snow from './components/Snow';
import jingleBells from './jingle-bells.mp3';

function App() {
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
       <audio ref={audioRef} src={jingleBells} />
       <Snow />
       <Leaderboard />
    </div>
  );
}

export default App;
