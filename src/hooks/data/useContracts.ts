import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Contract } from '@/types/contract';

export interface ContractListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
}

export function useContracts(params?: ContractListParams) {
  return useQuery({
    queryKey: ['contracts', params],
    queryFn: () => apiClient.get<Contract[]>('/api/v1/contracts'),
    staleTime: 5 * 60 * 1000,
  });
}
