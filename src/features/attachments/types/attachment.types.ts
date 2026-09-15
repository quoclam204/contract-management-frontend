export type SupportedFileType = 'pdf' | 'docx' | 'xlsx' | 'png';

export interface AttachmentVersion {
  id: string;
  attachmentId: string;
  versionNumber: number;
  versionString: string; // e.g. "v1", "v2"
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
  downloadUrl?: string;
}

export interface Attachment {
  id: string;
  contractId: string;
  contractNumber?: string;
  contractTitle?: string;
  fileName: string;
  originalFileName?: string;
  fileSize: number; // in bytes
  fileType: SupportedFileType | string;
  contentType?: string;
  currentVersion: number;
  versionString: string; // e.g. "v1", "v2"
  uploadedBy: string;
  createdAt: string;
  updatedAt?: string;
  storagePath?: string;
  downloadUrl?: string;
  versions: AttachmentVersion[];
}

export interface UploadAttachmentDto {
  file: File;
  contractId: string;
  notes?: string;
}

export interface UploadNewVersionDto {
  attachmentId: string;
  file: File;
  notes?: string;
}

export interface AttachmentQueryParams {
  contractId?: string;
  search?: string;
}
