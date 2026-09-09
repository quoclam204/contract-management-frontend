export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskFlag {
  id: string;
  category: 'Phạt vi phạm' | 'Bồi thường thiệt hại' | 'Thanh toán trễ' | 'Quyền sở hữu trí tuệ' | 'Bảo mật';
  severity: RiskLevel;
  clauseReference: string;
  description: string;
  recommendation: string;
}

export interface ClauseExtraction {
  id: string;
  title: string;
  extractedValue: string;
  confidenceScore: number;
}

export interface AIAnalysisResult {
  contractId: string;
  analyzedAt: string;
  overallRiskScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  summaryBulletPoints: string[];
  keyClauses: ClauseExtraction[];
  riskFlags: RiskFlag[];
}
