import { apiClient } from '@/api/client';

export interface AiAnalysisResultDto {
  id: string;
  contractId: string;
  summary: string | null;
  extractedValue: number | null;
  extractedExpiryDate: string | null;
  riskFlags: string | null;
  analyzedAt: string;
}

export function triggerAiAnalysis(contractId: string): Promise<void> {
  return apiClient.post<void>(`/api/aicontractassistant/contracts/${contractId}/analyze`);
}

export function fetchAiAnalysis(contractId: string): Promise<AiAnalysisResultDto> {
  return apiClient.get<AiAnalysisResultDto>(
    `/api/aicontractassistant/contracts/${contractId}/analysis`
  );
}
