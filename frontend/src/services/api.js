import axios from 'axios';

// API URL: Use environment variable in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

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

