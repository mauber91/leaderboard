import React from 'react';
import { Player } from '../../types/leaderboard';

interface LeaderboardStatsProps {
  players: Player[];
  totalFiltered: number;
}

const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({ players, totalFiltered }) => {
  const topScore = players.length > 0 ? Math.max(...players.map(p => p.points)) : 0;
  const averagePoints = players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.points, 0) / players.length) : 0;

  return (
    <div className="leaderboard-stats">
      <div className="stat-card">
        <h3>Total Players</h3>
        <p>{players.length}</p>
      </div>
      <div className="stat-card">
        <h3>Top Score</h3>
        <p>{topScore}</p>
      </div>
      <div className="stat-card">
        <h3>Average Points</h3>
        <p>{averagePoints}</p>
      </div>
      <div className="stat-card">
        <h3>Filtered Results</h3>
        <p>{totalFiltered}</p>
      </div>
    </div>
  );
};

export default LeaderboardStats;
