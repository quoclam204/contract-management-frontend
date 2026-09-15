import { apiClient } from '@/api/client';
import type {
  WorkflowDefinitionDto,
  CreateWorkflowDefinitionRequest,
  CreateWorkflowVersionRequest,
  UpdateWorkflowDefinitionRequest,
  PendingApprovalItemDto,
  ProcessApprovalDecisionRequest,
  ContractApprovalProgressDto,
  EvaluateConditionResponse,
  CreateSignatureRequest,
  SignatureDto,
  ContractSignatureStatusDto,
} from '../types/workflow.types';

// ==================== WORKFLOWS ====================

/**
 * Lấy danh sách cấu hình quy trình duyệt
 */
export async function getWorkflows(isActive?: boolean, search?: string): Promise<WorkflowDefinitionDto[]> {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('isActive', String(isActive));
  if (search) params.append('search', search);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get<WorkflowDefinitionDto[]>(`/api/workflows${query}`);
}

/**
 * Lấy chi tiết một quy trình duyệt
 */
export async function getWorkflowById(id: string): Promise<WorkflowDefinitionDto> {
  return apiClient.get<WorkflowDefinitionDto>(`/api/workflows/${id}`);
}

/**
 * Tạo mới quy trình duyệt
 */
export async function createWorkflow(data: CreateWorkflowDefinitionRequest): Promise<WorkflowDefinitionDto> {
  return apiClient.post<WorkflowDefinitionDto>('/api/workflows', data);
}

/**
 * Tạo phiên bản mới (v2, v3...) cho quy trình duyệt
 */
export async function createNewWorkflowVersion(
  id: string,
  data: CreateWorkflowVersionRequest
): Promise<WorkflowDefinitionDto> {
  return apiClient.post<WorkflowDefinitionDto>(`/api/workflows/${id}/versions`, data);
}

/**
 * Cập nhật quy trình duyệt
 */
export async function updateWorkflow(
  id: string,
  data: UpdateWorkflowDefinitionRequest
): Promise<WorkflowDefinitionDto> {
  return apiClient.put<WorkflowDefinitionDto>(`/api/workflows/${id}`, data);
}

/**
 * Bật/tắt trạng thái kích hoạt quy trình
 */
export async function toggleWorkflowStatus(id: string, isActive: boolean): Promise<void> {
  await apiClient.patch(`/api/workflows/${id}/status?isActive=${isActive}`, {});
}

/**
 * Xóa quy trình duyệt
 */
export async function deleteWorkflow(id: string): Promise<void> {
  await apiClient.delete(`/api/workflows/${id}`);
}

/**
 * Kiểm tra thử biểu thức điều kiện (Condition expression)
 */
export async function evaluateCondition(
  expression: string,
  contractValue: number
): Promise<EvaluateConditionResponse> {
  return apiClient.post<EvaluateConditionResponse>('/api/workflows/evaluate-condition', {
    expression,
    contractValue,
  });
}

// ==================== APPROVALS ====================

/**
 * Lấy danh sách hợp đồng đang chờ xét duyệt
 */
export async function getPendingApprovals(approverId?: string): Promise<PendingApprovalItemDto[]> {
  const query = approverId ? `?approverId=${approverId}` : '';
  return apiClient.get<PendingApprovalItemDto[]>(`/api/approvals/pending${query}`);
}

/**
 * Đệ trình hợp đồng vào luồng duyệt (Submit)
 */
export async function submitForApproval(
  contractId: string,
  workflowDefinitionId?: string
): Promise<ContractApprovalProgressDto> {
  return apiClient.post<ContractApprovalProgressDto>('/api/approvals/submit', {
    contractId,
    workflowDefinitionId,
  });
}

/**
 * Ra quyết định phê duyệt (Approve = 1, Reject = 2)
 */
export async function processApprovalDecision(
  request: ProcessApprovalDecisionRequest
): Promise<ContractApprovalProgressDto> {
  return apiClient.post<ContractApprovalProgressDto>('/api/approvals/decision', request);
}

/**
 * Lấy tiến trình phê duyệt của một hợp đồng
 */
export async function getApprovalProgress(contractId: string): Promise<ContractApprovalProgressDto> {
  return apiClient.get<ContractApprovalProgressDto>(`/api/approvals/contract/${contractId}`);
}

// ==================== SIGNATURES ====================

/**
 * Thực hiện ký kết điện tử hợp đồng
 */
export async function signContract(request: CreateSignatureRequest): Promise<SignatureDto> {
  return apiClient.post<SignatureDto>('/api/signatures', request);
}

/**
 * Lấy danh sách chữ ký của hợp đồng
 */
export async function getSignaturesByContractId(contractId: string): Promise<SignatureDto[]> {
  return apiClient.get<SignatureDto[]>(`/api/signatures/contract/${contractId}`);
}

/**
 * Lấy tổng quan trạng thái ký của hợp đồng
 */
export async function getSignatureStatus(contractId: string): Promise<ContractSignatureStatusDto> {
  return apiClient.get<ContractSignatureStatusDto>(`/api/signatures/status/${contractId}`);
}
