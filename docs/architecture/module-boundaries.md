# Phân Vùng Module & Ranh Giới (Module Boundaries)

Tài liệu này xác định ranh giới giữa các module trong `src/features/` nhằm đảm bảo nhóm 5 thành viên có thể làm việc song song mà không gặp tình trạng xung đột mã nguồn (merge conflict).

---

## 1. Cấu Trúc Module (`src/features/`)

Mỗi module nghiệp vụ được đóng gói độc lập theo cấu trúc sau:

```
src/features/[module-name]/
├── components/           # Các component chỉ phục vụ riêng module này
├── hooks/                # Custom hooks nội bộ module
├── services/ hoặc api/   # Các hàm gọi API chuyên biệt
├── types/                # Types chỉ dùng trong module
└── index.ts              # Public API xuất các thành phần ra ngoài
```

---

## 2. Phân Chia Ranh Giới 5 Phân Hệ

### Module 1: `identity` (Người 1 phụ trách)
- **Nhiệm vụ**: Đăng nhập, đăng xuất, lưu phiên làm việc, chuyển đổi quyền (Role Switcher), thông tin hồ sơ nhân viên.
- **Ranh giới**: Cung cấp `useAuthStore` cho toàn bộ ứng dụng đọc quyền (`role`, `user`, `isAuthenticated`).
- **Cấm**: Không được import trực tiếp logic từ `contracts` hoặc `workflows`.

### Module 2: `contracts` (Người 2 phụ trách)
- **Nhiệm vụ**: Danh sách hợp đồng, bộ lọc, chi tiết hợp đồng, tạo mới hợp đồng, trực quan hóa State Machine vòng đời.
- **Ranh giới**: Là trung tâm của hệ thống. Nhận dữ liệu đối tác từ `partners` và trigger luồng duyệt từ `workflows`.
- **Nguyên tắc**: Sử dụng `types/contract.ts` dùng chung.

### Module 3: `partners`, `payments`, `attachments` (Người 3 phụ trách)
- **Nhiệm vụ**:
  - `partners`: Quản lý danh mục đối tác, mã số thuế, đại diện pháp luật.
  - `payments`: Quản lý các mốc giải ngân/thanh toán theo hợp đồng.
  - `attachments`: Quản lý tải lên tệp văn bản hợp đồng PDF/DOCX và các phụ lục.
- **Ranh giới**: Cung cấp component nhúng cho `contracts/ContractDetailPage.tsx`.

### Module 4: `workflows` (Người 4 phụ trách)
- **Nhiệm vụ**: Luồng phê duyệt đa cấp (Approval Timeline), nút Duyệt/Từ chối, lý do từ chối, mô phỏng Ký số điện tử (E-signature OTP).
- **Ranh giới**: Xuất component `ApprovalTimeline` và modal `WorkflowApprovalModal`, `SignContractModal` để tích hợp vào màn hình chi tiết hợp đồng.

### Module 5: `dashboard`, `ai-analysis`, `notifications` (Người 5 phụ trách)
- **Nhiệm vụ**:
  - `dashboard`: Bảng điều khiển KPI tổng hợp, biểu đồ trực quan, cảnh báo hợp đồng sắp hết hiệu lực.
  - `ai-analysis`: Widget AI đọc hiểu hợp đồng, trích xuất tóm tắt và đánh giá rủi ro điều khoản.
  - `notifications`: Trung tâm thông báo hệ thống trên thanh Header.
- **Ranh giới**: Đọc dữ liệu tổng hợp từ các module khác qua API/TanStack Query.

---

## 3. Quy Tắc Import Giữa Các Tầng

1. **Top-Down Dependency**:
   - `pages` / `router` -> có quyền import `features` và `components`.
   - `features` -> có quyền import `components/ui`, `lib`, `api`, `types`.
   - `components/ui` -> **KHÔNG** được phép import từ `features`.
   - `lib` & `types` -> độc lập, không phụ thuộc vào UI components.

2. **Cross-Feature Imports**:
   - Khi Feature A cần dùng tính năng của Feature B, chỉ được import thông qua public export (`index.ts`) của Feature B, không import sâu vào file nội bộ.
