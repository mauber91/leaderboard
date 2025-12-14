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
      
      // Handle audio loading errors
      const handleError = (e: Event) => {
        console.error('Audio loading error:', e);
        const target = e.target as HTMLAudioElement;
        if (target.error) {
          console.error('Error code:', target.error.code);
          console.error('Error message:', target.error.message);
        }
      };
      
      // Wait for audio to be ready before playing
      const handleCanPlay = () => {
        audio.play().catch((error) => {
          // Autoplay may be blocked by browser policy
          console.log('Autoplay prevented:', error);
        });
      };
      
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplaythrough', handleCanPlay);
      
      // Also try to play immediately (in case it's already loaded)
      if (audio.readyState >= 3) { // HAVE_FUTURE_DATA or higher
        audio.play().catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      }
      
      return () => {
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, []);

  // Handle click to start audio if autoplay was blocked
  const handleClick = () => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error);
      });
    }
  };

  return (
    <div className="App" onClick={handleClick}>
       <audio ref={audioRef} src={mp3Url} preload="auto" />
       <Snow />
       <Leaderboard />
    </div>
  );
}

export default App;
