import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
  }) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/profile/password', { currentPassword, newPassword });
    return response.data;
  },
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: async () => {
    const response = await api.get('/watchlist');
    return response.data;
  },
  addToWatchlist: async (symbol: string, companyName: string) => {
    const response = await api.post('/watchlist', { symbol, companyName });
    return response.data;
  },
  removeFromWatchlist: async (symbol: string) => {
    const response = await api.delete(`/watchlist/${symbol}`);
    return response.data;
  },
};

export default api; 