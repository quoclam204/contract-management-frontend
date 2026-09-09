import React from 'react';

// Người 5 phụ trách: Dashboard, reports, charts (Recharts)
export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bảng Điều Khiển (Dashboard)</h1>
        <p className="text-xs text-slate-500">Tổng quan chỉ số hợp đồng, cảnh báo hết hạn và báo cáo phân tích</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Tổng Hợp Đồng</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">--</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Giá Trị Hiệu Lực</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">--</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Chờ Phê Duyệt</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">--</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium">Sắp Hết Hạn</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">--</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 5): Triển khai biểu đồ Recharts (phân bổ trạng thái, phòng ban, đối tác) */}
        Khung biểu đồ Dashboard & Báo cáo thống kê (Người 5 triển khai)
      </div>
    </div>
  );
};
