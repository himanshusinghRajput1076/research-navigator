import api from './api';
import { User } from '../types';

export interface AuthLoginResult {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthLoginResult> => {
    const { data } = await api.post('/auth/login', { email, password });
    // Backend returns { status: 'success', data: { user: {...}, token: '...' } }
    const result = data.data;
    localStorage.setItem('token', result.token);
    return result;
  },
  register: async (userData: any): Promise<AuthLoginResult> => {
    const { data } = await api.post('/auth/register', userData);
    const result = data.data;
    localStorage.setItem('token', result.token);
    return result;
  },
  logout: () => localStorage.removeItem('token'),
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
};
