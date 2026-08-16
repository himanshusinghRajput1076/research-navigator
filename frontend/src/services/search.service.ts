import api from './api';

export const searchService = {
  search: async (query: string, entityTypes?: string[]) => {
    const params = new URLSearchParams({ q: query });
    if (entityTypes && entityTypes.length > 0) {
      params.append('entity_types', entityTypes.join(','));
    }
    const res = await api.get(`/search?${params.toString()}`);
    return res.data?.data || res.data;
  },
};
