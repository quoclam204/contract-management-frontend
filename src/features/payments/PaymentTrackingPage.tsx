import React from 'react';

// Người 3 phụ trách: Payment tracking
export const PaymentTrackingPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Theo Dõi Đợt Thanh Toán</h1>
        <p className="text-xs text-slate-500">Quản lý mốc giải ngân, tiến độ thanh toán và cảnh báo quá hạn</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 3): Bảng tiến độ thanh toán hợp đồng, cập nhật trạng thái giải ngân */}
        Khung tính năng Theo dõi Thanh toán (Người 3 triển khai)
      </div>
    </div>
  );
};
