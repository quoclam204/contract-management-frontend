# Task Người 1: Core Foundation, Identity & Layout Shell

- **Người phụ trách**: Người 1 (Lead / Core)
- **Module**: `src/features/identity/`, `src/components/layout/`, `src/router/`

---

## 🎯 Mục Tiêu
Xây dựng nền móng kiến trúc Frontend vững chắc, hệ thống định tuyến bảo vệ theo vai trò (RBAC), màn hình đăng nhập chuyên nghiệp và khung giao diện làm việc chung (Layout Shell) cho 4 thành viên còn lại.

---

## 📋 Danh Sách Nhiệm Vụ Cụ Thể

### 1. Cấu Trúc Khung Dự Án & Routing
- [x] Thiết lập cấu hình Vite, Tailwind CSS, TypeScript strict mode, path alias `@/`.
- [x] Tạo `AppRouter.tsx` với React Router v7, bao bọc bằng Route Guard kiểm tra quyền đăng nhập và role.
- [x] Tích hợp `QueryClientProvider` từ TanStack Query v5 tại `main.tsx`.

### 2. Giao Diện Shell & Layout Chung (`components/layout/`)
- [x] `MainLayout.tsx`: Khung chia màn hình gồm Sidebar cố định bên trái, Header cố định bên trên, nội dung cuộn bên phải.
- [x] `Sidebar.tsx`: Danh mục điều hướng theo module với icon Lucide, hỗ trợ thu gọn/mở rộng, đánh dấu active route.
- [x] `Header.tsx`:
  - Thanh tìm kiếm nhanh hợp đồng.
  - Bộ chuyển đổi nhanh vai trò (Role Switcher: Admin, Manager, Staff, Approver) phục vụ kiểm thử nhanh.
  - Chuông thông báo với số lượng tin chưa đọc.
  - Menu tài khoản người dùng và nút Đăng xuất.

### 3. Phân Hệ Xác Thực & Phân Quyền (`features/identity/`)
- [x] `useAuthStore.ts`: Quản lý trạng thái bằng Zustand (thông tin user, token, role, switch role demo).
- [x] `LoginPage.tsx`: Giao diện đăng nhập hiện đại với form validation, gợi ý tài khoản mẫu theo từng vai trò.
- [x] Tích hợp tự động gán Bearer Token vào mọi request trong `src/api/client.ts`.
