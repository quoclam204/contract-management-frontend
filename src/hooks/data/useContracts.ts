import { useQuery } from '@tanstack/react-query';
import { contractApi } from '@/features/contracts/api/contractApi';

export interface ContractListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
}

export function useContracts(params?: ContractListParams) {
  return useQuery({
    queryKey: ['contracts', params],
    queryFn: () => contractApi.getContracts(),
    queryFn: () => apiClient.get<Contract[]>('/api/contracts'),
    staleTime: 5 * 60 * 1000,
  });
}

