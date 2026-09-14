import React from 'react';
import { Link } from 'react-router-dom';

// Người 2 phụ trách: Contract CRUD, Template, State Machine
export const ContractListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh Sách Hợp Đồng</h1>
          <p className="text-xs text-slate-500">Quản lý vòng đời hợp đồng doanh nghiệp (CLM)</p>
        </div>
        <Link
          to="/contracts/create"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          + Tạo Hợp Đồng
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 2): Triển khai bộ lọc, bảng dữ liệu hợp đồng (Contract Table), phân trang */}
        Khung giao diện Danh sách Hợp đồng (Người 2 triển khai)
      </div>
    </div>
  );
};
