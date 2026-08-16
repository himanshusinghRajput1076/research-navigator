import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search.service';

export const useSearch = (query: string, entityTypes?: string[]) => {
  return useQuery({
    queryKey: ['search', query, entityTypes],
    queryFn: () => searchService.search(query, entityTypes),
    enabled: !!query,
  });
};
