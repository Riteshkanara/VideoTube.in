import { GoogleLogin } from '@react-oauth/google';
import api from './axios.config';

export const authAPI = {
  register: async (data) => {
    return await api.post('/users/register', data);
  },

  login: async (data) => {
    return await api.post('/users/login', data);
  },

  logout: async () => {
    return await api.post('/users/logout');
  },
  // Get watch history
  getWatchHistory: async () => {
    const response = await api.get('/users/history');
    return response.data;
  },

  getCurrentUser: async () => {
    return await api.get('/users/current-user');
  },
  GoogleLogin: async (token) => {
      return await api.post('/users/google',  { token });
      
      
  }
};
