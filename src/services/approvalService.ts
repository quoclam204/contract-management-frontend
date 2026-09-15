import { apiClient } from '@/api/client';

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
  static async startApprovalProcess(contractId: string): Promise<void> {
    return apiClient.post(`/api/v1/approvals/start`, { contractId });
  }

  /**
   * Process an approval step (approve or reject)
   */
  static async processApprovalStep(data: ProcessApprovalStepCommand): Promise<void> {
    return apiClient.post(`/api/v1/approvals/process`, data);
  }
}