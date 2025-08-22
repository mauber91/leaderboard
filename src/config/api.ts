export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://binging.fly.dev',
  ENDPOINTS: {
    LEADERBOARD: '/points'
  },
  HEADERS: {
    'Content-Type': 'application/json'
  }
};


// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};