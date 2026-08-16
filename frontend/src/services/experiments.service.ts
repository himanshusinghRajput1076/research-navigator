import api from './api';
import { Experiment } from '../types';
import { PaginatedResponse, QueryParams } from '../types/api';

export const experimentsService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Experiment>> => {
    const { data } = await api.get('/experiments', { params });
    return data;
  },
  getById: async (id: string): Promise<Experiment> => {
    const { data } = await api.get(`/experiments/${id}`);
    return data;
  },
  create: async (payload: Partial<Experiment>): Promise<Experiment> => {
    const { data } = await api.post('/experiments', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Experiment>): Promise<Experiment> => {
    const { data } = await api.patch(`/experiments/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/experiments/${id}`);
  }
};
