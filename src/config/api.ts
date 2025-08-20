export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://binging.fly.dev',
  ENDPOINTS: {
    LEADERBOARD: '/lb/points'
  },
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

// Get bearer token from environment variable or use placeholder
export const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN || '5RFsH0eVPdDfvY2xVFoEwJ9wV5t7wx9qZF1bxq4XCfwm';

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => ({
  ...API_CONFIG.HEADERS,
  'Authorization': `Bearer ${BEARER_TOKEN}`
});

// Check if token is configured
export const isTokenConfigured = () => {
  return BEARER_TOKEN !== '5RFsH0eVPdDfvY2xVFoEwJ9wV5t7wx9qZF1bxq4XCfwm' && BEARER_TOKEN !== '';
};
