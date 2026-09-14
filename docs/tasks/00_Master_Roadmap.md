# Master Roadmap - Frontend Hệ Thống Quản Lý Hợp Đồng Doanh Nghiệp (CLM)

Tiến độ phát triển Frontend đồng bộ với 4 Phase của Backend và phân bổ công việc cho 5 thành viên.

---

## 🎯 Các Giai Đoạn Phát Triển (Phases)

### Phase 1 (Tuần 1-2): Khởi Tạo Nền Tảng, Khung Giao Diện & CRUD Cơ Bản
- [x] Thiết lập cấu trúc dự án React 19 + TypeScript + Vite + Tailwind CSS.
- [x] Tạo tài liệu kiến trúc, module boundaries và phân công 5 thành viên.
- [x] Xây dựng khung giao diện chuẩn (MainLayout, Sidebar, Header responsive).
- [x] Xây dựng module Identity (Login, lưu JWT, chuyển đổi vai trò Demo RBAC).
- [x] Triển khai màn hình CRUD Đối tác (Partner) & Danh sách Hợp đồng nháp.
- [x] Tích hợp HTTP client với Mock fallback và kết nối API đăng nhập, tạo hợp đồng.

### Phase 2 (Tuần 3-4): Vòng Đời Hợp Đồng & Luồng Phê Duyệt
- [ ] Hoàn thiện màn hình Chi tiết Hợp đồng (Contract Detail) đầy đủ tabs.
- [ ] Trực quan hóa State Machine vòng đời hợp đồng qua 8 trạng thái.
- [ ] Triển khai giao diện Quản lý Đợt thanh toán (Payments) và Tải lên văn bản (Attachments).
- [ ] Xây dựng màn hình Trình duyệt hợp đồng -> Sang trạng thái `PendingApproval`.
- [ ] Tích hợp component Workflow Approval Timeline (Nút Duyệt / Từ chối hợp đồng).

### Phase 3 (Tuần 5-6): Ký Số Điện Tử & Tích Hợp Trợ Lý AI
- [ ] Triển khai Modal Ký số điện tử (Mock OTP và chứng thư số).
- [ ] Tích hợp trạng thái hợp đồng sau khi ký: `Approved` -> `Signed` -> `Active`.
- [ ] Xây dựng Widget Trợ lý AI: Tóm tắt hợp đồng, trích xuất thực thể, tính điểm rủi ro.
- [ ] Hiển thị cảnh báo rủi ro (Risk Flags) ngay trên chi tiết điều khoản hợp đồng.

### Phase 4 (Tuần 7-8): Bảng Điều Khiển (Dashboard), Cảnh Báo Hết Hạn & Đóng Gói
- [ ] Hoàn thiện Dashboard trực quan hóa KPI (Tổng giá trị, phân bổ trạng thái).
- [ ] Danh sách hợp đồng sắp hết hạn trong 30-60 ngày kèm hành động Gia hạn/Thanh lý.
- [ ] Trung tâm Thông báo (Notification Center) realtime/polling.
- [ ] Kiểm thử E2E trọn vẹn luồng từ Đăng nhập -> Tạo hợp đồng -> Duyệt -> Ký -> Phân tích AI.
- [ ] Tối ưu hóa bundle size và đóng gói Dockerfile cho Frontend.

---

## 👥 Ma Trận Trách Nhiệm Thành Viên

| Thành viên | Phân hệ phụ trách | Nhiệm vụ chính |
|---|---|---|
| **Người 1** (Lead / Core) | `identity`, `components/layout` | Thiết lập nền tảng, Routing, RBAC, Layout, Design System |
| **Người 2** (Contract) | `contracts` | CRUD Hợp đồng, Chi tiết, State Machine vòng đời, Templates |
| **Người 3** (Partner & Ops) | `partners`, `payments`, `attachments` | Quản lý Đối tác, Lịch thanh toán, Quản lý tệp đính kèm |
| **Người 4** (Workflow) | `workflows` | Luồng phê duyệt đa cấp, Timeline trạng thái, Ký số điện tử |
| **Người 5** (Dashboard & AI) | `dashboard`, `ai-analysis`, `notifications` | Thống kê KPI, Widget AI rủi ro, Trung tâm thông báo |
