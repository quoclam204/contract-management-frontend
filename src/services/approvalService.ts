import { apiClient } from '@/api/client';
import type {
  ContractApprovalProgressDto,
  PendingApprovalItemDto,
} from '@/features/workflows/types/workflow.types';

export interface ProcessApprovalStepCommand {
  approvalStepId: string;
  approverId: string;
  decision: 'Approved' | 'Rejected' | number;
  comment?: string;
}

export class ApprovalService {
  /**
   * Start approval process for a contract
   */
  static async startApprovalProcess(contractId: string): Promise<ContractApprovalProgressDto> {
    return apiClient.post<ContractApprovalProgressDto>('/api/approvals/start', { contractId });
  }

  /**
   * Process an approval step (approve or reject)
   */
  static async processApprovalStep(
    data: ProcessApprovalStepCommand
  ): Promise<ContractApprovalProgressDto> {
    const decision =
      data.decision === 'Approved' ? 1 : data.decision === 'Rejected' ? 2 : data.decision;

    return apiClient.post<ContractApprovalProgressDto>('/api/approvals/process', {
      ...data,
      decision,
    });
  }

  static async getContractApprovalProgress(
    contractId: string
  ): Promise<ContractApprovalProgressDto> {
    return apiClient.get<ContractApprovalProgressDto>(`/api/approvals/contract/${contractId}`);
  }

  static async getPendingApprovals(approverId?: string): Promise<PendingApprovalItemDto[]> {
    const query = approverId ? `?approverId=${encodeURIComponent(approverId)}` : '';
    return apiClient.get<PendingApprovalItemDto[]>(`/api/approvals/pending${query}`);
  }
}
