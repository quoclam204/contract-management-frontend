import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';
import { fetchAiAnalysis, triggerAiAnalysis } from '../api/aiAnalysisApi';

export function useAiAnalysis(contractId: string | undefined) {
  return useQuery({
    queryKey: ['aiAnalysis', contractId],
    queryFn: () => fetchAiAnalysis(contractId!),
    enabled: !!contractId,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 1;
    },
    staleTime: 30_000,
  });
}

export function useTriggerAiAnalysis(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => triggerAiAnalysis(contractId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aiAnalysis', contractId] });
    },
  });
}
