import React from 'react';

// Người 5 phụ trách: AI analysis results, risk flags
export const AIAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Trợ Lý AI Phân Tích Hợp Đồng</h1>
        <p className="text-xs text-slate-500">Tự động trích xuất thông tin, tóm tắt điều khoản và cảnh báo rủi ro pháp lý</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
        {/* TODO (Người 5): Triển khai AI summary, trích xuất thực thể, bảng điểm rủi ro (Risk Score) */}
        Khung tính năng Trợ lý AI Phân tích Hợp đồng (Người 5 triển khai)
      </div>
    </div>
  );
};
