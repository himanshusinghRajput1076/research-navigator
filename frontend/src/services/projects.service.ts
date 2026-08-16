import api from './api';
import { Project } from '../types';
import { PaginatedResponse, QueryParams } from '../types/api';

export const projectsService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Project>> => {
    const { data } = await api.get('/projects', { params });
    return data;
  },
  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
  create: async (payload: Partial<Project>): Promise<Project> => {
    const { data } = await api.post('/projects', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Project>): Promise<Project> => {
    const { data } = await api.patch(`/projects/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  }
};
