import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gapsService } from '../services/gaps.service';
import { QueryParams } from '../types/api';
import { Gap } from '../types';

export const useGaps = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['gaps', params],
    queryFn: () => gapsService.getAll(params),
  });
};

export const useGap = (id: string) => {
  return useQuery({
    queryKey: ['gaps', id],
    queryFn: () => gapsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateGap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Gap>) => gapsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gaps'] }),
  });
};

export const useUpdateGap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Gap> }) => 
      gapsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['gaps'] });
      queryClient.invalidateQueries({ queryKey: ['gaps', id] });
    },
  });
};

export const useDeleteGap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gapsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gaps'] }),
  });
};
