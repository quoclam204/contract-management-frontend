import { apiClient } from '@/api/client';
import { Contract } from '@/types/contract';

export const contractApi = {
  async getContracts(): Promise<Contract[]> {
    try {
      return await apiClient.get<Contract[]>('/api/v1/contracts');
    } catch {
      return await apiClient.get<Contract[]>('/api/contracts');
    }
  },

  async getContractById(id: string): Promise<Contract> {
    try {
      return await apiClient.get<Contract>(`/api/v1/contracts/${id}`);
    } catch {
      return await apiClient.get<Contract>(`/api/contracts/${id}`);
    }
  },
};
