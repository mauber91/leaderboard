import React from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';
import Snow from './components/Snow';

function App() {
  return (
    <div className="App">
       <Snow />
       <Leaderboard />
    </div>
  );
}

export default App;
