export type ContractStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Approved'
  | 'Signed'
  | 'Active'
  | 'Expiring'
  | 'Terminated'
  | 'Renewed';

export type ContractType = 'Mua bán hàng hóa' | 'Cung cấp dịch vụ' | 'Thuê văn phòng' | 'Hợp tác kinh doanh' | 'Bảo mật thông tin (NDA)';

export interface Partner {
  id: string;
  name: string;
  taxCode: string;
  representative: string;
  email: string;
  phone: string;
  address: string;
  activeContractsCount?: number;
}

export interface PaymentMilestone {
  id: string;
  contractId: string;
  stepNumber: number;
  title: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
}

export interface ContractAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx';
  uploadedAt: string;
  uploadedBy: string;
  version: string;
  downloadUrl?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  partnerId: string;
  partnerName: string;
  contractType: ContractType;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  description: string;
  createdBy: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  signedDate?: string;
  approvalProgress?: {
    currentStep: number;
    totalSteps: number;
  };
  payments?: PaymentMilestone[];
  attachments?: ContractAttachment[];
}
