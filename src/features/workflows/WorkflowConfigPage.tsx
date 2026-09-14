import React from 'react';

// Người 4 phụ trách: Workflow definition, Step mapping
export const WorkflowConfigPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Cấu Hình Luồng Phê Duyệt</h1>
        <p className="text-xs text-slate-500">Thiết lập các bước duyệt theo loại hợp đồng và hạn mức ngân sách</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 4): Định nghĩa workflow step, gán người duyệt mặc định theo role */}
        Khung tính năng Cấu hình Quy trình (Người 4 triển khai)
      </div>
    </div>
  );
};
