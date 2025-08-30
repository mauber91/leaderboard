import { useState, useEffect } from 'react';
import axios from 'axios';
import { Player } from '../types/leaderboard';
import { getApiUrl, API_CONFIG } from '../config/api';

export const useLeaderboardData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.LEADERBOARD);
      
      const response = await axios.get(apiUrl);
      // Prefer API-provided update timestamp if available; fallback to now (store ISO for reliable parsing)
      const updatedAt = response?.data?.updated;
      const isoUpdate = updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString();
      setLastUpdate(isoUpdate);

      // Transform the API response to match our Player interface
      const transformedPlayers: Player[] = response.data.rows.map((player: any, index: number) => ({
        id: player.id || `player-${index}`,
        name: player.name || player.username || `Player ${index + 1}`,
        points: player.points || player.score || 0,
        correctPredictions: player.correctPredictions || player.correct || 0,
        totalPredictions: player.totalPredictions || player.total || 0,
        rank: index + 1
      }));

      // Sort by points (highest first) and update ranks
      const sortedPlayers = transformedPlayers
        .sort((a, b) => b.points - a.points)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));

      setPlayers(sortedPlayers);
    } catch (err: any) {
      console.error('Error fetching leaderboard data:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      // Provide more specific error messages based on the error
      if (err.response?.status === 401) {
        setError('Authentication failed. Please check your bearer token.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load leaderboard data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return {
    players,
    lastUpdate,
    loading,
    error,
    fetchLeaderboardData
  };
};
