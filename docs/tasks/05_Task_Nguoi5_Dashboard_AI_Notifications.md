# Task Người 5: Dashboard Báo Cáo, Trợ Lý AI & Thông Báo

- **Người phụ trách**: Người 5
- **Module**: `src/features/dashboard/`, `src/features/ai-analysis/`, `src/features/notifications/`

---

## 🎯 Mục Tiêu
Xây dựng trung tâm điều hành thông minh với các chỉ số KPI hợp đồng quan trọng, công cụ AI phân tích điều khoản & rủi ro hợp đồng tự động, cùng hệ thống thông báo tức thời.

---

## 📋 Danh Sách Nhiệm Vụ Cụ Thể

### 1. Bảng Điều Khiển Tổng Quan (`features/dashboard/DashboardPage.tsx`)
- [x] Thẻ thống kê 4 chỉ số KPI quan trọng:
  - Tổng số lượng hợp đồng trong hệ thống.
  - Tổng giá trị hợp đồng đang có hiệu lực (VND).
  - Số lượng hợp đồng đang chờ phê duyệt.
  - Số lượng hợp đồng sắp hết hạn trong 30 ngày cần chú ý.
- [x] Biểu đồ phân bổ hợp đồng theo trạng thái (Hiệu lực, Chờ duyệt, Dự thảo, Sắp hết hạn).
- [x] Danh sách các hợp đồng quan trọng cần xử lý ngay và các hoạt động nhật ký gần nhất.

### 2. Trợ Lý AI Phân Tích Hợp Đồng (`features/ai-analysis/AIAnalysisWidget.tsx`)
- [x] Nút "Phân tích bằng AI" (AI Contract Review) với animation loading.
- [x] Hiển thị Thẻ Điểm Rủi Ro (Risk Score Card):
  - Mức độ: Thấp (Xanh), Trung bình (Vàng), Cao (Đỏ).
- [x] Tóm tắt nội dung tự động bằng AI (3 gạch đầu dòng then chốt).
- [x] Trích xuất các thực thể quan trọng: Giá trị cam kết, Mức phạt trễ hạn, Điều khoản bảo mật, Điều kiện chấm dứt hợp đồng.
- [x] Danh sách Cảnh báo Rủi ro (Risk Flags) cần chuyên viên pháp chế lưu ý trước khi ký duyệt.

### 3. Trung Tâm Thông Báo (`features/notifications/`)
- [x] Menu popover chuông thông báo trên Header.
- [x] Các loại thông báo: Hợp đồng mới được trình duyệt, Yêu cầu phê duyệt cấp trưởng phòng, Cảnh báo hợp đồng sắp hết hạn 30 ngày, Ký số thành công.
- [x] Đánh dấu đã đọc và chuyển nhanh đến chi tiết hợp đồng tương ứng.
