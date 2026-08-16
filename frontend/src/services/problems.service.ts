import api from './api';
import { Problem } from '../types';
import { PaginatedResponse, QueryParams } from '../types/api';

export const problemsService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Problem>> => {
    const { data } = await api.get('/problems', { params });
    return data;
  },
  getById: async (id: string): Promise<Problem> => {
    const { data } = await api.get(`/problems/${id}`);
    return data;
  },
  create: async (payload: Partial<Problem>): Promise<Problem> => {
    const { data } = await api.post('/problems', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Problem>): Promise<Problem> => {
    const { data } = await api.patch(`/problems/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/problems/${id}`);
  }
};
