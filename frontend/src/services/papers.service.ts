import api from './api';
import { Paper } from '../types';
import { PaginatedResponse, QueryParams } from '../types/api';

export const papersService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Paper>> => {
    const { data } = await api.get('/papers', { params });
    return data;
  },
  getById: async (id: string): Promise<Paper> => {
    const { data } = await api.get(`/papers/${id}`);
    return data;
  },
  create: async (payload: Partial<Paper>): Promise<Paper> => {
    const { data } = await api.post('/papers', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Paper>): Promise<Paper> => {
    const { data } = await api.patch(`/papers/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/papers/${id}`);
  }
};
