import React from 'react';

// Người 1 phụ trách: User management, Department, Roles
export const UserManagementPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quản Lý Người Dùng & Phòng Ban</h1>
        <p className="text-xs text-slate-500">Phân quyền tài khoản (Admin, Manager, Staff, Approver)</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 1): Triển khai bảng danh sách người dùng, modal thêm người dùng, gán phòng ban */}
        Khung tính năng Quản lý Người dùng (Người 1 triển khai)
      </div>
    </div>
  );
};
