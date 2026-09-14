import React from 'react';

// Người 3 phụ trách: Partner management
export const PartnerListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Danh Mục Đối Tác</h1>
        <p className="text-xs text-slate-500">Quản lý nhà cung cấp, khách hàng và thông tin liên hệ pháp lý</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 3): Bảng danh sách đối tác, tìm kiếm theo MST, thêm mới đối tác */}
        Khung tính năng Quản lý Đối tác (Người 3 triển khai)
      </div>
    </div>
  );
};
