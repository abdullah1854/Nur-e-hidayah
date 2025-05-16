import axios from 'axios';

const API_BASE_URL = 'https://your-domain.com/api'; // Replace with your actual domain

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Login with Google
  googleLogin: async (googleToken: string) => {
    const response = await api.post('/auth/google-login.php', { token: googleToken });
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.post('/auth/verify.php');
    return response.data;
  },

  // Update user settings
  updateSettings: async (settings: any) => {
    const response = await api.put('/user/settings.php', settings);
    return response.data;
  },

  // Get user settings
  getSettings: async () => {
    const response = await api.get('/user/settings.php');
    return response.data;
  },

  // Add bookmark
  addBookmark: async (surah: number, ayah: number) => {
    const response = await api.post('/user/bookmarks.php', { surah, ayah });
    return response.data;
  },

  // Remove bookmark
  removeBookmark: async (surah: number, ayah: number) => {
    const response = await api.delete('/user/bookmarks.php', {
      data: { surah, ayah }
    });
    return response.data;
  },

  // Get bookmarks
  getBookmarks: async () => {
    const response = await api.get('/user/bookmarks.php');
    return response.data;
  },

  // Update reading position
  updatePosition: async (surah: number, ayah: number) => {
    const response = await api.put('/user/position.php', { surah, ayah });
    return response.data;
  },

  // Get reading position
  getPosition: async () => {
    const response = await api.get('/user/position.php');
    return response.data;
  },
};