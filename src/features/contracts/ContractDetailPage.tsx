import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Người 2 phụ trách: Contract Detail, State Machine Visualizer
export const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/contracts" className="text-xs text-blue-600 hover:underline">← Quay lại danh sách</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Chi Tiết Hợp Đồng #{id}</h1>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 2): Triển khai thông tin hợp đồng, State Machine (Draft → PendingApproval → Approved → Signed → Active → Expiring → Renewed/Terminated) */}
        Khung giao diện Chi tiết Hợp đồng & State Machine (Người 2 triển khai)
      </div>
    </div>
  );
};
