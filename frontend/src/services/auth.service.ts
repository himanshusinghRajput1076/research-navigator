import api from './api';
import { LoginResponse } from '../types/api';
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  },
  register: async (userData: any): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data;
  },
  logout: () => localStorage.removeItem('token'),
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};
