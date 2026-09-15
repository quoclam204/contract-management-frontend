import { apiClient, ApiError } from '@/api/client';
import { Attachment, AttachmentVersion } from '../types/attachment.types';

const STORAGE_KEY = 'clm_mock_attachments_v1';

// Initial sample data for testing and offline fallback
const INITIAL_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-001',
    contractId: 'contract-1',
    contractNumber: 'HD-2025-001',
    contractTitle: 'Hợp đồng Mua bán Thiết bị Tin học',
    fileName: 'HD-2025-001_HopDongChinhThuc.pdf',
    originalFileName: 'HD-2025-001_HopDongChinhThuc.pdf',
    fileSize: 2458120, // ~2.34 MB
    fileType: 'pdf',
    contentType: 'application/pdf',
    currentVersion: 2,
    versionString: 'v2',
    uploadedBy: 'Nguyễn Văn An (Admin)',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    versions: [
      {
        id: 'ver-001-1',
        attachmentId: 'att-001',
        versionNumber: 1,
        versionString: 'v1',
        fileName: 'HD-2025-001_HopDongChinhThuc_v1.pdf',
        fileSize: 2310500,
        fileType: 'pdf',
        uploadedBy: 'Nguyễn Văn An (Admin)',
        uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        notes: 'Bản thảo ban đầu trình phê duyệt',
      },
      {
        id: 'ver-001-2',
        attachmentId: 'att-001',
        versionNumber: 2,
        versionString: 'v2',
        fileName: 'HD-2025-001_HopDongChinhThuc.pdf',
        fileSize: 2458120,
        fileType: 'pdf',
        uploadedBy: 'Nguyễn Văn An (Admin)',
        uploadedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        notes: 'Cập nhật điều khoản bảo hành 24 tháng theo yêu cầu đối tác',
      },
    ],
  },
  {
    id: 'att-002',
    contractId: 'contract-1',
    contractNumber: 'HD-2025-001',
    contractTitle: 'Hợp đồng Mua bán Thiết bị Tin học',
    fileName: 'PhuLuc01_DieuKhoanThanhToan.docx',
    originalFileName: 'PhuLuc01_DieuKhoanThanhToan.docx',
    fileSize: 542100, // ~529 KB
    fileType: 'docx',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    currentVersion: 1,
    versionString: 'v1',
    uploadedBy: 'Trần Thị Bích (Manager)',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    versions: [
      {
        id: 'ver-002-1',
        attachmentId: 'att-002',
        versionNumber: 1,
        versionString: 'v1',
        fileName: 'PhuLuc01_DieuKhoanThanhToan.docx',
        fileSize: 542100,
        fileType: 'docx',
        uploadedBy: 'Trần Thị Bích (Manager)',
        uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        notes: 'Phụ lục phân kỳ thanh toán 3 giai đoạn',
      },
    ],
  },
  {
    id: 'att-003',
    contractId: 'contract-2',
    contractNumber: 'HD-2025-002',
    contractTitle: 'Hợp đồng Cung cấp Dịch vụ Phần mềm',
    fileName: 'BangKeChiTiet_GiaCaVaChiPhi.xlsx',
    originalFileName: 'BangKeChiTiet_GiaCaVaChiPhi.xlsx',
    fileSize: 1124500, // ~1.07 MB
    fileType: 'xlsx',
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    currentVersion: 3,
    versionString: 'v3',
    uploadedBy: 'Lê Quốc Lâm (Staff)',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    versions: [
      {
        id: 'ver-003-1',
        attachmentId: 'att-003',
        versionNumber: 1,
        versionString: 'v1',
        fileName: 'BangKeChiTiet_v1.xlsx',
        fileSize: 980000,
        fileType: 'xlsx',
        uploadedBy: 'Lê Quốc Lâm (Staff)',
        uploadedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        notes: 'Báo giá dự thảo ban đầu',
      },
      {
        id: 'ver-003-2',
        attachmentId: 'att-003',
        versionNumber: 2,
        versionString: 'v2',
        fileName: 'BangKeChiTiet_v2.xlsx',
        fileSize: 1050000,
        fileType: 'xlsx',
        uploadedBy: 'Lê Quốc Lâm (Staff)',
        uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        notes: 'Bổ sung hạng mục chi phí license máy chủ',
      },
      {
        id: 'ver-003-3',
        attachmentId: 'att-003',
        versionNumber: 3,
        versionString: 'v3',
        fileName: 'BangKeChiTiet_GiaCaVaChiPhi.xlsx',
        fileSize: 1124500,
        fileType: 'xlsx',
        uploadedBy: 'Lê Quốc Lâm (Staff)',
        uploadedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        notes: 'Chốt bảng giá sau khi đàm phán giảm 5% chiết khấu',
      },
    ],
  },
  {
    id: 'att-004',
    contractId: 'contract-3',
    contractNumber: 'HD-2025-003',
    contractTitle: 'Hợp đồng Thuê Văn phòng Keangnam',
    fileName: 'GiayChungNhan_DangKyKinhDoanh.png',
    originalFileName: 'GiayChungNhan_DangKyKinhDoanh.png',
    fileSize: 3890200, // ~3.71 MB
    fileType: 'png',
    contentType: 'image/png',
    currentVersion: 1,
    versionString: 'v1',
    uploadedBy: 'Phạm Minh Tuấn (Legal)',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    versions: [
      {
        id: 'ver-004-1',
        attachmentId: 'att-004',
        versionNumber: 1,
        versionString: 'v1',
        fileName: 'GiayChungNhan_DangKyKinhDoanh.png',
        fileSize: 3890200,
        fileType: 'png',
        uploadedBy: 'Phạm Minh Tuấn (Legal)',
        uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        notes: 'Bản scan Giấy ĐKKD có dấu đỏ của bên cho thuê',
      },
    ],
  },
];

function getStoredAttachments(): Attachment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ATTACHMENTS));
      return INITIAL_ATTACHMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ATTACHMENTS;
  } catch {
    return INITIAL_ATTACHMENTS;
  }
}

function saveStoredAttachments(items: Attachment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not save attachments to localStorage:', err);
  }
}

/**
 * 1. Lấy danh sách tệp đính kèm theo hợp đồng hoặc từ khóa tìm kiếm
 */
export async function getAttachments(params?: {
  contractId?: string;
  search?: string;
}): Promise<Attachment[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.contractId) searchParams.append('contractId', params.contractId);
    if (params?.search?.trim()) searchParams.append('search', params.search.trim());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient.get<Attachment[] | { items: Attachment[]; data?: Attachment[] }>(
      `/api/v1/attachments${query}`
    );

    let items: Attachment[] = [];
    if (Array.isArray(res)) {
      items = res;
    } else if (res && Array.isArray((res as { items?: Attachment[] }).items)) {
      items = (res as { items: Attachment[] }).items;
    } else if (res && Array.isArray((res as { data?: Attachment[] }).data)) {
      items = (res as { data: Attachment[] }).data;
    }

    return items;
  } catch (error) {
    // Graceful offline fallback to local mock store
    console.info('Backend attachments API unavailable or returned error, using local data store.', error);
    let items = getStoredAttachments();

    if (params?.contractId) {
      items = items.filter((item) => item.contractId === params.contractId);
    }

    if (params?.search?.trim()) {
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
  }
}

/**
 * 2. Gửi tệp đính kèm mới kèm contractId
 */
export async function uploadAttachment(formData: FormData): Promise<Attachment> {
  try {
    return await apiClient.post<Attachment>('/api/v1/attachments', formData);
  } catch (error) {
    console.info('Backend upload API unavailable, saving to local store.', error);

    const file = formData.get('file') as File | null;
    const contractId = (formData.get('contractId') as string) || 'contract-1';
    const contractNumber = (formData.get('contractNumber') as string) || 'HD-2025-001';
    const contractTitle =
      (formData.get('contractTitle') as string) || 'Hợp đồng liên kết';
    const notes = (formData.get('notes') as string) || undefined;

    if (!file) {
      throw new Error('Vui lòng chọn tệp để tải lên');
    }

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const newId = `att-${Date.now()}`;

    const newVersion: AttachmentVersion = {
      id: `ver-${Date.now()}-1`,
      attachmentId: newId,
      versionNumber: 1,
      versionString: 'v1',
      fileName,
      fileSize: file.size,
      fileType: extension,
      uploadedBy: 'Người dùng hiện tại',
      uploadedAt: new Date().toISOString(),
      notes,
    };

    const newAttachment: Attachment = {
      id: newId,
      contractId,
      contractNumber,
      contractTitle,
      fileName,
      originalFileName: fileName,
      fileSize: file.size,
      fileType: extension,
      contentType: file.type || 'application/octet-stream',
      currentVersion: 1,
      versionString: 'v1',
      uploadedBy: 'Người dùng hiện tại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [newVersion],
    };

    const current = getStoredAttachments();
    saveStoredAttachments([newAttachment, ...current]);

    return newAttachment;
  }
}

/**
 * 3. Tải lên phiên bản mới cho tệp đã có
 */
export async function uploadNewVersion(
  attachmentId: string,
  formData: FormData
): Promise<AttachmentVersion> {
  try {
    return await apiClient.post<AttachmentVersion>(
      `/api/v1/attachments/${attachmentId}/versions`,
      formData
    );
  } catch (error) {
    console.info('Backend new version API unavailable, updating local store.', error);

    const file = formData.get('file') as File | null;
    const notes = (formData.get('notes') as string) || undefined;

    if (!file) {
      throw new Error('Vui lòng chọn tệp phiên bản mới');
    }

    const current = getStoredAttachments();
    const index = current.findIndex((a) => a.id === attachmentId);

    if (index === -1) {
      throw new Error('Không tìm thấy tệp đính kèm');
    }

    const target = current[index];
    const nextVersionNumber = (target.currentVersion || target.versions.length || 1) + 1;
    const versionString = `v${nextVersionNumber}`;
    const extension = file.name.split('.').pop()?.toLowerCase() || target.fileType;

    const newVersion: AttachmentVersion = {
      id: `ver-${Date.now()}-${nextVersionNumber}`,
      attachmentId,
      versionNumber: nextVersionNumber,
      versionString,
      fileName: file.name,
      fileSize: file.size,
      fileType: extension,
      uploadedBy: 'Người dùng hiện tại',
      uploadedAt: new Date().toISOString(),
      notes,
    };

    const updatedAttachment: Attachment = {
      ...target,
      fileName: file.name,
      fileSize: file.size,
      fileType: extension,
      currentVersion: nextVersionNumber,
      versionString,
      updatedAt: new Date().toISOString(),
      versions: [newVersion, ...target.versions],
    };

    current[index] = updatedAttachment;
    saveStoredAttachments(current);

    return newVersion;
  }
}

/**
 * 4. Tải tệp về máy (xử lý blob)
 */
export async function downloadAttachment(id: string, preferredFileName?: string): Promise<void> {
  try {
    const { blob, fileName: headerName } = await apiClient.getBlob(
      `/api/v1/attachments/${id}/download`
    );

    const fileName = headerName || preferredFileName || `attachment-${id}`;
    triggerBlobDownload(blob, fileName);
  } catch (error) {
    console.info('Backend download API unavailable, creating demo file blob for download.', error);

    // Fallback: Tìm tệp trong local store và tạo blob demo
    const current = getStoredAttachments();
    const target = current.find((a) => a.id === id);
    const fileName = preferredFileName || target?.fileName || `attachment-${id}.txt`;

    const content = `HỆ THỐNG QUẢN LÝ VÒNG ĐỜI HỢP ĐỒNG (CLM)
--------------------------------------------------
Tên tệp: ${fileName}
Mã tệp: ${id}
Hợp đồng: ${target?.contractNumber || 'N/A'} - ${target?.contractTitle || 'N/A'}
Phiên bản: ${target?.versionString || 'v1'}
Người tải lên: ${target?.uploadedBy || 'N/A'}
Ngày tạo: ${target?.createdAt || new Date().toISOString()}
Dung lượng: ${target?.fileSize || 0} bytes
--------------------------------------------------
Nội dung tài liệu được lưu trữ an toàn theo tiêu chuẩn IStorageProvider.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    triggerBlobDownload(blob, fileName);
  }
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
 */
export async function deleteAttachment(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/v1/attachments/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status !== 404) {
      throw error;
    }
    console.info('Backend delete API unavailable, removing from local store.', error);
  } finally {
    const current = getStoredAttachments();
    const updated = current.filter((a) => a.id !== id);
    saveStoredAttachments(updated);
  }
}
