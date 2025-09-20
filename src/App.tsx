import React from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <div className="App">
      <h2 style={{ color: 'red', padding: '40px' }}>

      This site is on strike until Kurt stops ignoring racism in the chat and bans MillenniumJaded for calling someone 'mexican bin dipper'.
      </h2>
      <div className="app-container">
       <Leaderboard />
      </div>
    </div>
  );
}

export default App;
