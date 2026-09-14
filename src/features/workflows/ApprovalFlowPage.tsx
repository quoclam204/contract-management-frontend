import React from 'react';

// Người 4 phụ trách: Workflow config, Approval flow, Signature
export const ApprovalFlowPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Tiến Trình Phê Duyệt & Ký Số</h1>
        <p className="text-xs text-slate-500">Hàng đợi xét duyệt hợp đồng đa cấp và thao tác ký điện tử</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 4): Luồng phê duyệt (Trưởng phòng -> Tài chính -> Ban Giám đốc), Ký số OTP/Token */}
        Khung tính năng Phê duyệt & Ký số (Người 4 triển khai)
      </div>
    </div>
  );
};
