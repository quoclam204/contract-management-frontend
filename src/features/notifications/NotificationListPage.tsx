import React from 'react';

// Người 5 phụ trách: Notification list, preferences
export const NotificationListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Danh Sách Thông Báo</h1>
        <p className="text-xs text-slate-500">Thông báo nhắc việc duyệt hợp đồng, cảnh báo hết hạn và cập nhật hệ thống</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 5): Danh sách thông báo, đánh dấu đã đọc, bộ lọc loại thông báo */}
        Khung tính năng Thông báo Hệ thống (Người 5 triển khai)
      </div>
    </div>
  );
};
