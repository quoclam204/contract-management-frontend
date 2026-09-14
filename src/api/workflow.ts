import { apiClient } from './client';

export interface WorkflowDefinitionDto {
  id: string;
  name: string;
  conditionExpression: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  steps: WorkflowStepDto[];
}

export interface WorkflowStepDto {
  id: string;
  approverRole: string;
  stepOrder: number;
  minimumAmount: number;
  isRequired: boolean;
}

export interface CreateWorkflowDefinitionRequest {
  name: string;
  conditionExpression: string;
  steps: CreateWorkflowStepRequest[];
}

export interface CreateWorkflowStepRequest {
  approverRole: string;
  stepOrder: number;
  minimumAmount?: number;
  isRequired?: boolean;
}

export interface CreateWorkflowVersionRequest {
  name: string;
  conditionExpression: string;
  steps: CreateWorkflowStepRequest[];
}

export interface UpdateWorkflowDefinitionRequest {
  name?: string;
  conditionExpression?: string;
}

export interface ResolveWorkflowRequest {
  contractValue: number;
}

export interface ResolveWorkflowResponse {
  workflowDefinitionId: string | null;
  workflowDefinitionName: string | null;
  applicableSteps: WorkflowStepDto[];
}

export interface EvaluateConditionRequest {
  expression: string;
  contractValue: number;
}

export interface EvaluateConditionResponse {
  result: boolean;
}

export class WorkflowApiService {
  /**
   * Get list of workflow definitions
   */
  static async getWorkflows(isActive?: boolean, search?: string): Promise<WorkflowDefinitionDto[]> {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params}` : '';
    return apiClient.get<WorkflowDefinitionDto[]>(`/api/workflows${query}`);
  }

  /**
   * Get workflow definition by ID
   */
  static async getWorkflowById(id: string): Promise<WorkflowDefinitionDto> {
    return apiClient.get<WorkflowDefinitionDto>(`/api/workflows/${id}`);
  }

  /**
   * Create a new workflow definition
   */
  static async createWorkflow(request: CreateWorkflowDefinitionRequest): Promise<WorkflowDefinitionDto> {
    return apiClient.post<WorkflowDefinitionDto>(`/api/workflows`, request);
  }

  /**
   * Create a new version of a workflow
   */
  static async createNewVersion(id: string, request: CreateWorkflowVersionRequest): Promise<WorkflowDefinitionDto> {
    return apiClient.post<WorkflowDefinitionDto>(`/api/workflows/${id}/versions`, request);
  }

  /**
   * Update a workflow definition
   */
  static async updateWorkflow(id: string, request: UpdateWorkflowDefinitionRequest): Promise<WorkflowDefinitionDto> {
    return apiClient.put<WorkflowDefinitionDto>(`/api/workflows/${id}`, request);
  }

  /**
   * Toggle workflow active status
   */
  static async toggleStatus(id: string, isActive: boolean): Promise<void> {
    await apiClient.patch(`/api/workflows/${id}/status?isActive=${isActive}`, null);
  }

  /**
   * Delete a workflow definition
   */
  static async deleteWorkflow(id: string): Promise<void> {
    await apiClient.delete(`/api/workflows/${id}`);
  }

  /**
   * Resolve workflow for a contract value
   */
  static async resolveWorkflow(contractValue: number): Promise<ResolveWorkflowResponse> {
    return apiClient.post<ResolveWorkflowResponse>(`/api/workflows/resolve`, { contractValue });
  }

  /**
   * Evaluate condition expression
   */
  static async evaluateCondition(expression: string, contractValue: number): Promise<EvaluateConditionResponse> {
    return apiClient.post<EvaluateConditionResponse>(`/api/workflows/evaluate-condition`, { expression, contractValue });
  }

  /**
   * Add a step to an existing workflow
   */
  static async addStep(workflowId: string, request: CreateWorkflowStepRequest): Promise<WorkflowStepDto> {
    return apiClient.post<WorkflowStepDto>(`/api/workflows/${workflowId}/steps`, request);
  }
}