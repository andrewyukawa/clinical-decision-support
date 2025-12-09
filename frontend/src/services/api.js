import axios from 'axios';

// API URL: Use environment variable in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGuidelineMetadata = async () => {
  const response = await api.get('/api/guidelines/metadata');
  return response.data;
};

export const getPathway = async (request) => {
  const response = await api.post('/api/pathway', request);
  return response.data;
};

export const getTrials = async () => {
  const response = await api.get('/api/trials');
  return response.data;
};

export default api;

