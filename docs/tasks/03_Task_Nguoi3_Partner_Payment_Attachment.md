# Task Người 3: Quản Lý Đối Tác, Thanh Toán & Tệp Đính Kèm

- **Người phụ trách**: Người 3
- **Module**: `src/features/partners/`, `src/features/payments/`, `src/features/attachments/`

---

## 🎯 Mục Tiêu
Phát triển các module hỗ trợ xung quanh hợp đồng: Quản lý danh bạ đối tác kinh doanh, theo dõi tiến độ thanh toán tài chính và quản lý tệp tin đính kèm.

---

## 📋 Danh Sách Nhiệm Vụ Cụ Thể

### 1. Quản Lý Đối Tác (`features/partners/PartnerListPage.tsx`)
- [x] Danh sách đối tác dạng thẻ/bảng: Tên công ty/đối tác, Mã số thuế, Người đại diện, Email, Số điện thoại, Địa chỉ, Số lượng hợp đồng đang chạy.
- [x] Tìm kiếm đối tác theo tên và mã số thuế.
- [x] Modal thêm mới đối tác kinh doanh.

### 2. Theo Dõi Mốc Thanh Toán (`features/payments/`)
- [x] Bảng các đợt giải ngân theo hợp đồng: Đợt thanh toán, Số tiền (VND), Tỷ lệ %, Ngày đến hạn, Trạng thái (Chờ thanh toán, Đã thanh toán, Quá hạn).
- [x] Thanh tiến độ giải ngân (Progress bar: ví dụ Đã giải ngân 60% / 100%).
- [x] Thêm mốc thanh toán mới cho hợp đồng.

### 3. Quản Lý Tệp Tin Đính Kèm (`features/attachments/`)
- [x] Khu vực kéo thả tải tệp (Dropzone upload) hỗ trợ PDF, DOCX.
- [x] Danh sách tệp đính kèm: Tên file, Dung lượng, Phiên bản (v1.0, v1.1), Người tải lên, Ngày cập nhật, Nút xem trước (Preview) và Tải về.
