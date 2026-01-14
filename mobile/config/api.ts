import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure your backend URL via .env file
// Create a .env file with: EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api
// For local development:
// - Android emulator: use 10.0.2.2
// - iOS simulator: use localhost
// - Physical device: use your computer's IP address (found via ipconfig)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
