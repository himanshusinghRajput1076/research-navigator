import api from './api';
import { Gap } from '../types';
import { PaginatedResponse, QueryParams } from '../types/api';

export const gapsService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Gap>> => {
    const { data } = await api.get('/gaps', { params });
    return data;
  },
  getById: async (id: string): Promise<Gap> => {
    const { data } = await api.get(`/gaps/${id}`);
    return data;
  },
  create: async (payload: Partial<Gap>): Promise<Gap> => {
    const { data } = await api.post('/gaps', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Gap>): Promise<Gap> => {
    const { data } = await api.patch(`/gaps/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/gaps/${id}`);
  }
};
