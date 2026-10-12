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
  static async startApprovalProcess(
    contractId: string,
    workflowDefinitionId?: string
  ): Promise<ContractApprovalProgressDto> {
    return apiClient.post<ContractApprovalProgressDto>('/api/approvals/submit', {
      contractId,
      workflowDefinitionId,
    });
  }

  /**
   * Process an approval step (approve or reject)
   */
  static async processApprovalStep(
    data: ProcessApprovalStepCommand
  ): Promise<ContractApprovalProgressDto> {
    const decision =
      data.decision === 'Approved' || data.decision === 1
        ? 1
        : data.decision === 'Rejected' || data.decision === 2
        ? 2
        : data.decision;

    return apiClient.post<ContractApprovalProgressDto>('/api/approvals/process', {
      approvalStepId: data.approvalStepId,
      approverId: data.approverId,
      decision,
      comment: data.comment,
    });
  }

  /**
   * Get approval progress for a contract
   */
  static async getContractApprovalProgress(
    contractId: string
  ): Promise<ContractApprovalProgressDto> {
    return apiClient.get<ContractApprovalProgressDto>(`/api/approvals/contract/${contractId}`);
  }

  /**
   * Get approval progress for a contract (returns null if not found)
   */
  static async getProgressByContractId(
    contractId: string
  ): Promise<ContractApprovalProgressDto | null> {
    try {
      return await apiClient.get<ContractApprovalProgressDto>(`/api/approvals/contract/${contractId}`);
    } catch {
      return null;
    }
  }

  /**
   * Get pending approval steps
   */
  static async getPendingApprovals(approverId?: string): Promise<PendingApprovalItemDto[]> {
    const query = approverId ? `?approverId=${encodeURIComponent(approverId)}` : '';
    return apiClient.get<PendingApprovalItemDto[]>(`/api/approvals/pending${query}`);
  }
}
