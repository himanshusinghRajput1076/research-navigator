import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { papersService } from '../services/papers.service';
import { QueryParams } from '../types/api';
import { Paper } from '../types';

export const usePapers = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['papers', params],
    queryFn: () => papersService.getAll(params),
  });
};

export const usePaper = (id: string) => {
  return useQuery({
    queryKey: ['papers', id],
    queryFn: () => papersService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Paper>) => papersService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['papers'] }),
  });
};

export const useUpdatePaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Paper> }) => 
      papersService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['papers', id] });
    },
  });
};

export const useDeletePaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => papersService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['papers'] }),
  });
};
