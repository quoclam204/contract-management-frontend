import { apiClient } from '@/api/client';
import { Attachment, AttachmentVersion } from '../types/attachment.types';

export interface BackendAttachmentDto {
  id: string;
  contractId: string;
  fileName: string;
  version: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedByName?: string;
  createdByFullName?: string;
  uploadedAt: string;
  fileSize?: number;
  size?: number;
  fileSizeBytes?: number;
  sizeInBytes?: number;
  contentLength?: number;
}

/**
 * Chuyá»ƒn Ä‘á»•i má»™t AttachmentDto tá»« Backend sang Ä‘á»‘i tÆ°á»£ng Attachment cá»§a Frontend
 */
export function transformAttachmentDto(
  dto: BackendAttachmentDto,
  contractInfo?: { contractNumber?: string; contractTitle?: string }
): Attachment {
  const extension = dto.fileName.split('.').pop()?.toLowerCase() || '';
  const versionNumber = dto.version || 1;
  const versionString = `v${versionNumber}`;
  const size = dto.fileSize ?? dto.size ?? dto.fileSizeBytes ?? dto.sizeInBytes ?? dto.contentLength ?? 0;

  const versionItem: AttachmentVersion = {
    id: dto.id,
    attachmentId: dto.id,
    versionNumber,
    versionString,
    fileName: dto.fileName,
    fileSize: size,
    fileType: extension,
    uploadedBy: String(dto.uploadedByName || dto.uploadedBy || 'NgÆ°á»i dĂ¹ng'),
    uploadedAt: dto.uploadedAt || new Date().toISOString(),
    downloadUrl: `/api/v1/attachments/${dto.id}/download`,
  };

  return {
    id: dto.id,
    contractId: dto.contractId,
    contractNumber: contractInfo?.contractNumber,
    contractTitle: contractInfo?.contractTitle,
    fileName: dto.fileName,
    originalFileName: dto.fileName,
    fileSize: size,
    fileType: extension,
    contentType: extension === 'pdf' ? 'application/pdf' : undefined,
    currentVersion: versionNumber,
    versionString,
    uploadedBy: String(dto.uploadedByName || dto.uploadedBy || 'NgÆ°á»i dĂ¹ng'),
    createdAt: dto.uploadedAt || new Date().toISOString(),
    updatedAt: dto.uploadedAt || new Date().toISOString(),
    storagePath: dto.fileUrl,
    downloadUrl: `/api/v1/attachments/${dto.id}/download`,
    versions: [versionItem],
  };
}

/**
 * Gom nhĂ³m danh sĂ¡ch AttachmentDto theo tĂªn tá»‡p (fileName) trong má»™t há»£p Ä‘á»“ng
 */
export function groupAttachmentDtos(
  dtos: BackendAttachmentDto[],
  contractInfo?: { contractNumber?: string; contractTitle?: string }
): Attachment[] {
  if (!Array.isArray(dtos) || dtos.length === 0) return [];

  const groups = new Map<string, BackendAttachmentDto[]>();
  for (const dto of dtos) {
    const key = dto.fileName.toLowerCase();
    const existing = groups.get(key) || [];
    existing.push(dto);
    groups.set(key, existing);
  }

  const result: Attachment[] = [];

  for (const [, items] of groups) {
    // Sáº¯p xáº¿p cĂ¡c phiĂªn báº£n giáº£m dáº§n: má»›i nháº¥t lĂªn Ä‘áº§u
    items.sort((a, b) => (b.version || 0) - (a.version || 0));
    const latest = items[0];
    const oldest = items[items.length - 1];
    const extension = latest.fileName.split('.').pop()?.toLowerCase() || '';
    const currentVersion = latest.version || 1;

    const versions: AttachmentVersion[] = items.map((item) => {
      const size = item.fileSize ?? item.size ?? item.fileSizeBytes ?? item.sizeInBytes ?? item.contentLength ?? 0;
      return {
        id: item.id,
        attachmentId: latest.id,
        versionNumber: item.version || 1,
        versionString: `v${item.version || 1}`,
        fileName: item.fileName,
        fileSize: size,
        fileType: item.fileName.split('.').pop()?.toLowerCase() || extension,
        uploadedBy: String(item.uploadedByName || item.uploadedBy || 'NgÆ°á»i dĂ¹ng'),
        uploadedAt: item.uploadedAt,
        downloadUrl: `/api/v1/attachments/${item.id}/download`,
      };
    });

    const latestSize = latest.fileSize ?? latest.size ?? latest.fileSizeBytes ?? latest.sizeInBytes ?? latest.contentLength ?? 0;

    result.push({
      id: latest.id,
      contractId: latest.contractId,
      contractNumber: contractInfo?.contractNumber,
      contractTitle: contractInfo?.contractTitle,
      fileName: latest.fileName,
      originalFileName: latest.fileName,
      fileSize: latestSize,
      fileType: extension,
      contentType: extension === 'pdf' ? 'application/pdf' : undefined,
      currentVersion,
      versionString: `v${currentVersion}`,
      uploadedBy: String(latest.uploadedByName || latest.uploadedBy || 'NgÆ°á»i dĂ¹ng'),
      createdAt: oldest.uploadedAt || latest.uploadedAt,
      updatedAt: latest.uploadedAt,
      storagePath: latest.fileUrl,
      downloadUrl: `/api/v1/attachments/${latest.id}/download`,
      versions,
    });
  }

  return result;
}

/**
 * 1. Láº¥y danh sĂ¡ch tá»‡p Ä‘Ă­nh kĂ¨m theo há»£p Ä‘á»“ng
 * Route Backend: GET /api/v1/contracts/{contractId}/attachments
 */
export async function getAttachments(params?: {
  contractId?: string;
  search?: string;
  contractInfo?: { contractNumber?: string; contractTitle?: string };
}): Promise<Attachment[]> {
  // Náº¿u khĂ´ng cĂ³ contractId hoáº·c contractId === 'all', tráº£ vá» máº£ng rá»—ng
  // Tuyá»‡t Ä‘á»‘i khĂ´ng cháº¡y vĂ²ng láº·p báº¯n request hĂ ng loáº¡t lĂ m ngháº½n connection pool Backend
  if (!params?.contractId || params.contractId === 'all') {
    return [];
  }

  try {
    const dtos = await apiClient.get<BackendAttachmentDto[]>(
      `/api/v1/contracts/${params.contractId}/attachments`
    );
    let items = groupAttachmentDtos(dtos, params.contractInfo);

    // Lá»c tá»« khĂ³a tĂ¬m kiáº¿m náº¿u cĂ³
    if (params.search?.trim()) {
      const q = params.search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.fileName.toLowerCase().includes(q) ||
          item.contractNumber?.toLowerCase().includes(q) ||
          item.contractTitle?.toLowerCase().includes(q) ||
          item.uploadedBy.toLowerCase().includes(q)
      );
    }

    return items;
  } catch (err) {
    console.error(`[getAttachments] Lá»—i khi táº£i tá»‡p cho há»£p Ä‘á»“ng ${params.contractId}:`, err);
    throw err;
  }
}

/**
 * 2. Táº£i lĂªn tá»‡p Ä‘Ă­nh kĂ¨m má»›i cho há»£p Ä‘á»“ng
 * Route Backend: POST /api/v1/contracts/{contractId}/attachments
 */
export async function uploadAttachment(
  contractId: string,
  formData: FormData
): Promise<Attachment> {
  const res = await apiClient.post<BackendAttachmentDto>(
    `/api/v1/contracts/${contractId}/attachments`,
    formData
  );

  return transformAttachmentDto(res);
}

/**
 * 3. Táº£i lĂªn phiĂªn báº£n má»›i cho tá»‡p trong há»£p Ä‘á»“ng
 * Route Backend: POST /api/v1/contracts/{contractId}/attachments (Backend tá»± Ä‘á»™ng tÄƒng Max(Version) + 1)
 */
export async function uploadNewVersion(
  contractId: string,
  formData: FormData
): Promise<AttachmentVersion> {
  const res = await apiClient.post<BackendAttachmentDto>(
    `/api/v1/contracts/${contractId}/attachments`,
    formData
  );

  const extension = res.fileName.split('.').pop()?.toLowerCase() || '';
  const versionNumber = res.version || 1;
  const size = res.fileSize ?? res.size ?? res.fileSizeBytes ?? res.sizeInBytes ?? res.contentLength ?? 0;

  return {
    id: res.id,
    attachmentId: res.id,
    versionNumber,
    versionString: `v${versionNumber}`,
    fileName: res.fileName,
    fileSize: size,
    fileType: extension,
    uploadedBy: String(res.uploadedByName || res.uploadedBy || 'NgÆ°á»i dĂ¹ng'),
    uploadedAt: res.uploadedAt || new Date().toISOString(),
    notes: (formData.get('notes') as string) || undefined,
    downloadUrl: `/api/v1/attachments/${res.id}/download`,
  };
}

/**
 * 4. Táº£i tá»‡p vá» mĂ¡y (xá»­ lĂ½ blob tháº­t tá»« backend)
 * Route Backend: GET /api/v1/attachments/{id}/download
 */
export async function downloadAttachment(id: string, preferredFileName?: string): Promise<void> {
  const { blob, fileName: headerName } = await apiClient.getBlob(
    `/api/v1/attachments/${id}/download`
  );

  const fileName = headerName || preferredFileName || `attachment-${id}`;
  triggerBlobDownload(blob, fileName);
}

/**
 * Helper kĂ­ch hoáº¡t download blob trĂªn trĂ¬nh duyá»‡t
 */
function triggerBlobDownload(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 5. XĂ³a tá»‡p Ä‘Ă­nh kĂ¨m
 * Route Backend: Há»— trá»£ DELETE /api/v1/contracts/{contractId}/attachments/{id} vĂ  DELETE /api/v1/attachments/{id}
 */
export async function deleteAttachment(id: string, contractId?: string): Promise<void> {
  const endpoint = contractId
    ? `/api/v1/contracts/${contractId}/attachments/${id}`
    : `/api/v1/attachments/${id}`;

  try {
    await apiClient.delete(endpoint);
  } catch (error) {
    if (contractId) {
      await apiClient.delete(`/api/v1/attachments/${id}`);
    } else {
      throw error;
    }
  }
}

