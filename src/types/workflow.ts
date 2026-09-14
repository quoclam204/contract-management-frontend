export type StepStatus = 'Pending' | 'Approved' | 'Rejected' | 'NotStarted';

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  roleName: string;
  approverName: string;
  approverEmail: string;
  status: StepStatus;
  reviewedAt?: string;
  comment?: string;
}

export interface ContractSignature {
  id: string;
  signerName: string;
  roleTitle: string;
  organization: string;
  signedAt: string;
  method: 'OTP_SMS' | 'USB_TOKEN' | 'CLOUD_CA';
  certificateSerial?: string;
  status: 'Valid' | 'Revoked';
}
