import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experimentsService } from '../services/experiments.service';
import { QueryParams } from '../types/api';
import { Experiment } from '../types';

export const useExperiments = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['experiments', params],
    queryFn: () => experimentsService.getAll(params),
  });
};

export const useExperiment = (id: string) => {
  return useQuery({
    queryKey: ['experiments', id],
    queryFn: () => experimentsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateExperiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Experiment>) => experimentsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiments'] }),
  });
};

export const useUpdateExperiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experiment> }) => 
      experimentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
    },
  });
};

export const useDeleteExperiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experimentsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiments'] }),
  });
};
