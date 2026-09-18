import { apiClient } from '@/api/client';
import { Attachment, AttachmentVersion } from '../types/attachment.types';

export interface BackendAttachmentDto {
  id: string;
  contractId: string;
  fileName: string;
  version: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize?: number;
  size?: number;
  fileSizeBytes?: number;
  sizeInBytes?: number;
  contentLength?: number;
}

/**
 * Chuyển đổi một AttachmentDto từ Backend sang đối tượng Attachment của Frontend
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
    uploadedBy: String(dto.uploadedBy || 'Người dùng'),
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
    uploadedBy: String(dto.uploadedBy || 'Người dùng'),
    createdAt: dto.uploadedAt || new Date().toISOString(),
    updatedAt: dto.uploadedAt || new Date().toISOString(),
    storagePath: dto.fileUrl,
    downloadUrl: `/api/v1/attachments/${dto.id}/download`,
    versions: [versionItem],
  };
}

/**
 * Gom nhóm danh sách AttachmentDto theo tên tệp (fileName) trong một hợp đồng
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
    // Sắp xếp các phiên bản giảm dần: mới nhất lên đầu
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
        uploadedBy: String(item.uploadedBy || 'Người dùng'),
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
      uploadedBy: String(latest.uploadedBy || 'Người dùng'),
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
 * 1. Lấy danh sách tệp đính kèm theo hợp đồng
 * Route Backend: GET /api/v1/contracts/{contractId}/attachments
 */
export async function getAttachments(params?: {
  contractId?: string;
  search?: string;
  contractInfo?: { contractNumber?: string; contractTitle?: string };
}): Promise<Attachment[]> {
  // Nếu không có contractId hoặc contractId === 'all', trả về mảng rỗng
  // Tuyệt đối không chạy vòng lặp bắn request hàng loạt làm nghẽn connection pool Backend
  if (!params?.contractId || params.contractId === 'all') {
    return [];
  }

  try {
    const dtos = await apiClient.get<BackendAttachmentDto[]>(
      `/api/v1/contracts/${params.contractId}/attachments`
    );
    let items = groupAttachmentDtos(dtos, params.contractInfo);

    // Lọc từ khóa tìm kiếm nếu có
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
    console.error(`[getAttachments] Lỗi khi tải tệp cho hợp đồng ${params.contractId}:`, err);
    throw err;
  }
}

/**
 * 2. Tải lên tệp đính kèm mới cho hợp đồng
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
 * 3. Tải lên phiên bản mới cho tệp trong hợp đồng
 * Route Backend: POST /api/v1/contracts/{contractId}/attachments (Backend tự động tăng Max(Version) + 1)
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
    uploadedBy: String(res.uploadedBy || 'Người dùng'),
    uploadedAt: res.uploadedAt || new Date().toISOString(),
    notes: (formData.get('notes') as string) || undefined,
    downloadUrl: `/api/v1/attachments/${res.id}/download`,
  };
}

/**
 * 4. Tải tệp về máy (xử lý blob thật từ backend)
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
 * Helper kích hoạt download blob trên trình duyệt
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
 * 5. Xóa tệp đính kèm
 * Route Backend: Hỗ trợ DELETE /api/v1/contracts/{contractId}/attachments/{id} và DELETE /api/v1/attachments/{id}
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
