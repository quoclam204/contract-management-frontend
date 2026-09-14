# Task Người 2: Quản Lý Hợp Đồng & Vòng Đời (Contract Lifecycle)

- **Người phụ trách**: Người 2
- **Module**: `src/features/contracts/`

---

## 🎯 Mục Tiêu
Xây dựng phân hệ cốt lõi nhất của hệ thống: Danh sách hợp đồng, Chi tiết hợp đồng, Tạo mới hợp đồng và Trực quan hóa State Machine vòng đời 8 trạng thái.

---

## 📋 Danh Sách Nhiệm Vụ Cụ Thể

### 1. Danh Sách Hợp Đồng (`ContractListPage.tsx`)
- [x] Bảng hiển thị danh sách hợp đồng trực quan: Mã hợp đồng, Tiêu đề, Đối tác, Giá trị, Ngày hiệu lực, Người tạo, Trạng thái.
- [x] Bộ lọc thông minh:
  - Lọc theo Trạng thái (Tất cả, Dự thảo, Chờ duyệt, Đã duyệt, Đã ký, Có hiệu lực, Sắp hết hạn, Chấm dứt).
  - Tìm kiếm từ khóa theo số hiệu hợp đồng, tên đối tác.
- [x] Phân trang dữ liệu và hiển thị tổng số kết quả.
- [x] Nút "Tạo Hợp Đồng Mới" mở modal biểu mẫu.

### 2. Tạo Mới Hợp Đồng (`CreateContractModal.tsx`)
- [x] Biểu mẫu nhập liệu: Mã số hợp đồng, Tên hợp đồng, Chọn đối tác, Giá trị hợp đồng (VND), Ngày bắt đầu, Ngày kết thúc, Loại hợp đồng, Mô tả chi tiết.
- [x] Validation dữ liệu form trước khi gửi.
- [x] Sau khi tạo thành công, tự động cập nhật danh sách và đưa vào trạng thái `Draft`.

### 3. Chi Tiết Hợp Đồng (`ContractDetailPage.tsx`)
- [x] Header hiển thị: Tiêu đề hợp đồng, Mã hợp đồng, Huy hiệu trạng thái (Badge màu riêng biệt), Nút thao tác (Trình duyệt, Sửa, In).
- [x] **Trực quan hóa Vòng đời (State Machine Visualizer)**: Hiển thị thanh tiến trình 8 trạng thái trực quan, đánh dấu trạng thái hiện tại.
- [x] Hệ thống Tabs chi tiết:
  - **Tab Thông tin chung**: Chi tiết đối tác, ngày hiệu lực, giá trị, tóm tắt nội dung.
  - **Tab Phê duyệt & Ký số**: Nhúng component `ApprovalTimeline` từ Người 4.
  - **Tab Thanh toán**: Nhúng component `PaymentMilestones` từ Người 3.
  - **Tab Tài liệu đính kèm**: Danh sách file hợp đồng và phụ lục từ Người 3.
  - **Tab Phân tích AI**: Nhúng component `AIAnalysisWidget` từ Người 5.
