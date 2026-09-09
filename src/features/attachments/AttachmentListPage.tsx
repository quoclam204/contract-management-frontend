import React from 'react';

// Người 3 phụ trách: File upload, versioning
export const AttachmentListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quản Lý Tệp Đính Kèm & Phiên Bản</h1>
        <p className="text-xs text-slate-500">Tải lên tài liệu PDF/DOCX, quản lý versioning qua IStorageProvider</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 3): Dropzone upload tệp, danh sách version file, xem trước file */}
        Khung tính năng Quản lý Tệp đính kèm (Người 3 triển khai)
      </div>
    </div>
  );
};
