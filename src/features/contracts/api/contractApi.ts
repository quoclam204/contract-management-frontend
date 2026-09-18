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

export interface ContractDto {
  id: string;
  contractNumber: string;
  contractTypeId: string;
  contractTypeName?: string | null;
  templateVersionUsedId?: string | null;
  partnerId: string;
  partnerName?: string | null;
  ownerId?: string | null;
  title: string;
  value: number;
  signedDate?: string | null;
  effectiveDate: string;
  expiryDate: string;
  status: number | string;
  fileUrl?: string | null;
  parentContractId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateContractPayload {
  contractNumber: string;
  contractTypeId: string;
  templateVersionUsedId?: string | null;
  partnerId: string;
  ownerId?: string | null;
  title: string;
  value: number;
  signedDate?: string | null;
  effectiveDate: string;
  expiryDate: string;
  fileUrl?: string | null;
  parentContractId?: string | null;
}

export interface UpdateContractPayload extends CreateContractPayload {}

export interface ContractTypeDto {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface PartnerDto {
  id: string;
  name: string;
  taxCode?: string;
  email?: string;
  phone?: string;
}

export const contractApi = {
  // Contracts
  getContracts: async (): Promise<ContractDto[]> => {
    const res = await apiClient.get<ContractDto[] | { items: ContractDto[] }>('/api/contracts');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { items?: ContractDto[] }).items)) {
      return (res as { items: ContractDto[] }).items;
    }
    return [];
  },

  getContractById: (id: string): Promise<ContractDto> => {
    return apiClient.get<ContractDto>(`/api/contracts/${id}`);
  },

  createContract: (data: CreateContractPayload): Promise<ContractDto> => {
    return apiClient.post<ContractDto>('/api/contracts', data);
  },

  updateContract: (id: string, data: UpdateContractPayload): Promise<ContractDto> => {
    return apiClient.put<ContractDto>(`/api/contracts/${id}`, data);
  },

  deleteContract: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/contracts/${id}`);
  },

  // State Machine Actions
  submitContract: (id: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/api/contracts/${id}/submit`);
  },

  activateContract: (id: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/api/contracts/${id}/activate`);
  },

  renewContract: (id: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/api/contracts/${id}/renew`);
  },

  terminateContract: (id: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/api/contracts/${id}/terminate`);
  },

  // Contract Types
  getContractTypes: async (): Promise<ContractTypeDto[]> => {
    const res = await apiClient.get<ContractTypeDto[] | { items: ContractTypeDto[] }>('/api/contract-types');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { items?: ContractTypeDto[] }).items)) {
      return (res as { items: ContractTypeDto[] }).items;
    }
    return [];
  },

  createContractType: (data: { name: string; description?: string }): Promise<ContractTypeDto> => {
    return apiClient.post<ContractTypeDto>('/api/contract-types', data);
  },

  deleteContractType: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/contract-types/${id}`);
  },

  // Partners for dropdown
  getPartners: async (): Promise<PartnerDto[]> => {
    try {
      const res = await apiClient.get<{ items: PartnerDto[] } | PartnerDto[]>('/api/v1/partners?pageSize=100');
      if (Array.isArray(res)) return res;
      if (res && Array.isArray((res as { items?: PartnerDto[] }).items)) {
        return (res as { items: PartnerDto[] }).items;
      }
      return [];
    } catch {
      return [];
    }
  },
};
