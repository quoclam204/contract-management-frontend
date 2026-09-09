import React from 'react';
import { Link } from 'react-router-dom';

// Người 2 phụ trách: Soạn thảo hợp đồng, chọn mẫu (Template)
export const ContractCreatePage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <Link to="/contracts" className="text-xs text-blue-600 hover:underline">← Quay lại danh sách</Link>
        <h1 className="text-xl font-bold text-slate-900 mt-1">Soạn Thảo Hợp Đồng Mới</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 2): Form tạo hợp đồng, chọn đối tác, loại hợp đồng, số tiền, ngày hiệu lực */}
        Khung biểu mẫu Soạn thảo Hợp đồng (Người 2 triển khai)
      </div>
    </div>
  );
};
