# Task Người 4: Quy Trình Phê Duyệt & Ký Số Điện Tử

- **Người phụ trách**: Người 4
- **Module**: `src/features/workflows/`

---

## 🎯 Mục Tiêu
Xây dựng luồng phê duyệt đa cấp linh hoạt cho hợp đồng doanh nghiệp và trải nghiệm ký số điện tử bảo mật, chuyên nghiệp.

---

## 📋 Danh Sách Nhiệm Vụ Cụ Thể

### 1. Trực Quan Hóa Luồng Duyệt (`ApprovalTimeline.tsx`)
- [x] Hiển thị các bước phê duyệt theo sơ đồ timeline dọc/ngang:
  - Bước 1: Trưởng phòng chuyên môn duyệt.
  - Bước 2: Kế toán trưởng / Tài chính thẩm định ngân sách.
  - Bước 3: Ban Giám đốc phê chuẩn cuối cùng.
- [x] Mỗi bước hiển thị: Tên người duyệt, Chức danh, Trạng thái (Đã duyệt, Đang chờ, Từ chối, Chưa tới lượt), Thời gian duyệt, Ý kiến nhận xét.

### 2. Thao Tác Phê Duyệt & Từ Chối (`WorkflowApprovalModal.tsx`)
- [x] Nút "Phê duyệt" (Approve) và "Từ chối" (Reject) chỉ hiển thị khi tài khoản hiện tại đúng thẩm quyền ở bước đang chờ.
- [x] Modal nhập ý kiến phê duyệt hoặc nhập lý do bắt buộc khi từ chối.
- [x] Khi từ chối: Hợp đồng chuyển về trạng thái `Draft` kèm thông báo gửi cho người tạo.
- [x] Khi duyệt bước cuối: Hợp đồng chuyển sang trạng thái `Approved` (Sẵn sàng ký số).

### 3. Mô Phỏng Ký Số Điện Tử (`SignContractModal.tsx`)
- [x] Nút "Ký số điện tử" xuất hiện khi hợp đồng đã ở trạng thái `Approved`.
- [x] Modal xác nhận ký:
  - Chọn phương thức ký: Chữ ký số USB Token hoặc OTP SMS/Email.
  - Nhập mã xác thực OTP (mặc định giả lập mã `123456`).
  - Đóng dấu con dấu điện tử (E-stamp) và hiển thị thông tin chữ ký gồm: Tên đại diện, Doanh nghiệp, Thời gian ký (Timestamp).
- [x] Sau khi ký thành công: Hợp đồng chuyển sang trạng thái `Signed` hoặc `Active`.
