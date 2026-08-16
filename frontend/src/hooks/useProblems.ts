import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { problemsService } from '../services/problems.service';
import { QueryParams } from '../types/api';
import { Problem } from '../types';

export const useProblems = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['problems', params],
    queryFn: () => problemsService.getAll(params),
  });
};

export const useProblem = (id: string) => {
  return useQuery({
    queryKey: ['problems', id],
    queryFn: () => problemsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Problem>) => problemsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['problems'] }),
  });
};

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Problem> }) => 
      problemsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['problems', id] });
    },
  });
};

export const useDeleteProblem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => problemsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['problems'] }),
  });
};
