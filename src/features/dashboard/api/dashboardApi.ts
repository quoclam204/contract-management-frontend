import { apiClient } from '@/api/client';
import type {
  DashboardSummaryDto,
  ContractStatusSummaryDto,
  DepartmentContractSummaryDto,
  PartnerContractSummaryDto,
  MonthlyContractSummaryDto,
} from '../types/dashboard.types';

export function getDashboardSummary(): Promise<DashboardSummaryDto> {
  return apiClient.get<DashboardSummaryDto>('/api/dashboard/summary');
}

export function getDashboardByStatus(): Promise<ContractStatusSummaryDto[]> {
  return apiClient.get<ContractStatusSummaryDto[]>('/api/dashboard/by-status');
}

export function getDashboardByDepartment(): Promise<DepartmentContractSummaryDto[]> {
  return apiClient.get<DepartmentContractSummaryDto[]>('/api/dashboard/by-department');
}

export function getDashboardByPartner(top = 10): Promise<PartnerContractSummaryDto[]> {
  return apiClient.get<PartnerContractSummaryDto[]>(`/api/dashboard/by-partner?top=${top}`);
}

export function getDashboardByTime(): Promise<MonthlyContractSummaryDto[]> {
  return apiClient.get<MonthlyContractSummaryDto[]>('/api/dashboard/by-time');
}
