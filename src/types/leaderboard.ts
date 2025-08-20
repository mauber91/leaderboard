export interface Player {
  id: string;
  name: string;
  points: number;
  correctPredictions: number;
  totalPredictions: number;
  rank: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  status: 'scheduled' | 'in-progress' | 'finished';
}

export interface Prediction {
  id: string;
  playerId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  points: number;
  isCorrect: boolean;
}
