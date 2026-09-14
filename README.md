# Hệ Thống Quản Lý Vòng Đời Hợp Đồng Doanh Nghiệp (CLM) — Frontend

> **Dự án**: Contract Lifecycle Management (CLM) Frontend  
> **Nền tảng công nghệ**: React 19, TypeScript (Strict Mode), Vite 6, Tailwind CSS, TanStack Query v5, Zustand, React Router v7, Recharts, Lucide Icons.  
> **Tài liệu hướng dẫn & quy chuẩn phát triển dành cho nhóm 5 thành viên.**

---

## 📑 Mục Lục
1. [Giới Thiệu Dự Án](#-giới-thiệu-dự-án)
2. [Nguyên Tắc Phát Triển & Tech Stack](#-nguyên-tắc-phát-triển--tech-stack)
3. [Cấu Trúc Thư Mục Chuẩn (Target Architecture)](#-cấu-trúc-thư-mục-chuẩn-target-architecture)
4. [Phân Công Nhiệm Vụ 5 Thành Viên (Task Breakdown)](#-phân-công-nhiệm-vụ-5-thành-viên-task-breakdown)
5. [Vòng Đời Hợp Đồng & State Machine](#-vòng-đời-hợp-đồng--state-machine)
6. [Quy Chuẩn Tích Hợp API Backend (.NET 9)](#-quy-chuẩn-tích-hợp-api-backend-net-9)
7. [Quy Tắc Lập Trình (Coding Guidelines)](#-quy-tắc-lập-trình-coding-guidelines)
8. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
9. [Hệ Thống Tài Liệu Chi Tiết (Docs Directory)](#-hệ-thống-tài-liệu-chi-tiết-docs-directory)

---

## 🎯 Giới Thiệu Dự Án

Hệ thống CLM (Contract Lifecycle Management) phục vụ số hóa toàn diện quy trình xử lý hợp đồng của doanh nghiệp từ khâu khởi tạo đến khi thanh lý:
- **Soạn thảo & Mẫu hợp đồng**: Khởi tạo hợp đồng từ thư viện mẫu (Template), quản lý phụ lục và điều khoản.
- **Quy trình phê duyệt đa cấp (Approval Workflow)**: Thiết lập tiến trình duyệt qua nhiều phòng ban (Trưởng phòng chuyên môn → Ban Tài chính/Kế toán → Ban Giám đốc điều hành).
- **Ký số điện tử (E-Signature)**: Tích hợp xác thực OTP và chứng thư số (USB Token / Cloud CA).
- **Vòng đời hợp đồng (State Machine)**: Theo dõi chặt chẽ tiến trình qua 8 trạng thái.
- **Trợ lý AI (AI Contract Assistant)**: Tự động trích xuất thực thể, tóm tắt điều khoản cốt lõi và cảnh báo rủi ro pháp lý tiềm ẩn.
- **Bảng điều khiển (Dashboard)**: Thống kê KPI giá trị hợp đồng, theo dõi tiến độ thanh toán và cảnh báo hợp đồng sắp hết hạn trong 30-60 ngày.

---

## 🛠️ Nguyên Tắc Phát Triển & Tech Stack

### Danh Mục Công Nghệ
| Thành phần | Công nghệ / Thư viện | Phiên bản | Vai trò & Mục đích |
|---|---|---|---|
| **Core Framework** | React | `^19.0.0` | Thư viện UI hiện đại, hỗ trợ React Server Components & Compiler |
| **Build Tool** | Vite | `^6.1.0` | Máy chủ phát triển HMR cực nhanh, tối ưu đóng gói bundle |
| **Ngôn ngữ** | TypeScript | `^5.7.0` | Chế độ `strict: true`, đảm bảo an toàn kiểu dữ liệu 100% |
| **Styling** | Tailwind CSS | `^3.4.0` | Utility-first CSS, thiết kế giao diện theo design token |
| **Biểu tượng** | Lucide React | `^0.475.0` | Bộ icon vector sắc nét, tối ưu tree-shaking |
| **Server State** | TanStack Query | `^5.66.0` | Caching API, quản lý loading/error, chống race-condition |
| **Client State** | Zustand | `^5.0.0` | Quản lý phiên đăng nhập (Auth), thông tin User, theme |
| **Routing** | React Router | `^7.1.0` | Điều hướng trang SPA, Route Guards theo quyền (RBAC) |
| **Biểu đồ** | Recharts | Mới nhất | Vẽ biểu đồ Dashboard (phân bổ trạng thái, xu hướng doanh thu) |

### Nguyên Tắc Cốt Lõi Của Nhóm
1. **1 flow demo mỗi sprint**: Mỗi sprint (2 tuần) phải có ít nhất 1 luồng end-to-end hoàn chỉnh chạy được thật giữa FE và BE.
2. **UI tối thiểu trước, polish sau**: Ưu tiên luồng nghiệp vụ hoạt động ổn định và chính xác trước khi trau chuốt giao diện nâng cao.
3. **Phân vùng module độc lập**: Mỗi thành viên triển khai code trong thư mục feature được giao (`src/features/[module]/`). Không sửa trực tiếp vào feature của người khác nếu chưa trao đổi.

---

## 📂 Cấu Trúc Thư Mục Chuẩn (Target Architecture)

Khi nhóm bắt đầu triển khai code chi tiết, cấu trúc mã nguồn trong `src/` sẽ được tổ chức theo mô hình **Feature-Driven Architecture**:

```
src/
├── api/
│   └── client.ts                     # Wrapper fetch tập trung: tự động gắn JWT Bearer token & xử lý ApiError
├── components/
│   ├── layout/                       # Khung giao diện dùng chung (MainLayout, Sidebar, Header, Breadcrumb)
│   └── ui/                           # Design System Primitives (Button, Badge, Card, Modal, Input, Table)
├── features/                         # 9 Phân hệ nghiệp vụ chính (giao cho 5 người)
│   ├── identity/                     # Người 1: Đăng nhập, thông tin người dùng, phòng ban, phân quyền RBAC
│   ├── contracts/                    # Người 2: Danh sách, chi tiết, tạo mới, mẫu hợp đồng, State Machine
│   ├── partners/                     # Người 3: Danh mục đối tác kinh doanh, mã số thuế, đại diện pháp luật
│   ├── payments/                     # Người 3: Quản lý các mốc giải ngân, tiến độ thanh toán
│   ├── attachments/                  # Người 3: Tải lên tệp văn bản PDF/DOCX, quản lý phiên bản (versioning)
│   ├── workflows/                    # Người 4: Cấu hình quy trình duyệt, timeline xét duyệt, ký số điện tử
│   ├── notifications/                # Người 5: Danh sách thông báo, cảnh báo nhắc việc
│   ├── ai-analysis/                  # Người 5: Trợ lý AI đọc hiểu hợp đồng, phân tích điều khoản rủi ro
│   └── dashboard/                    # Người 5: Bảng điều khiển KPI tổng hợp, biểu đồ báo cáo
├── hooks/
│   └── data/                         # Typed wrapper hooks TanStack Query cho từng endpoint (useContracts,...)
├── lib/
│   └── utils.ts                      # Hàm cn() utility, formatCurrency, formatDate
├── router/
│   └── AppRouter.tsx                 # Cấu hình routes và các lớp bảo vệ phân quyền (Route Guards)
├── types/                            # Khai báo TypeScript types dùng chung toàn hệ thống
│   ├── auth.ts                       # User, Role, Session
│   ├── contract.ts                   # Contract, Partner, Payment, Attachment
│   ├── workflow.ts                   # WorkflowStep, ApprovalStatus, Signature
│   └── ai.ts                         # AIAnalysisResult, RiskFlag, ClauseExtraction
├── App.tsx                           # App Root kết nối QueryClientProvider & Router
├── index.css                         # Tailwind CSS base directives
├── main.tsx                          # Điểm khởi đầu ứng dụng React
└── vite-env.d.ts                     # Khai báo biến môi trường Vite (VITE_API_BASE_URL)
```

---

## 👥 Phân Công Nhiệm Vụ 5 Thành Viên (Task Breakdown)

### 👤 Người 1 (Lead / Core & Identity)
- **Module**: `src/features/identity/`, `src/components/layout/`, `src/router/`
- **Nhiệm vụ cụ thể**:
  - Thiết lập nền tảng dự án, Routing, Route Guards kiểm tra quyền đăng nhập.
  - Xây dựng Khung giao diện chung (`MainLayout`, `Sidebar`, `Header`).
  - Quản lý phiên làm việc bằng Zustand (`useAuthStore`): Lưu token, thông tin User, vai trò (Admin, Manager, Staff, Approver).
  - Màn hình Đăng nhập (`LoginPage.tsx`) và Quản lý Người dùng/Phòng ban (`UserManagementPage.tsx`).
- 📄 *Chi tiết*: Xem [`docs/tasks/01_Task_Nguoi1_Identity_Layout.md`](docs/tasks/01_Task_Nguoi1_Identity_Layout.md)

---

### 👤 Người 2 (Nghiệp Vụ Hợp Đồng & Vòng Đời)
- **Module**: `src/features/contracts/`
- **Nhiệm vụ cụ thể**:
  - Bảng danh sách hợp đồng (`ContractListPage.tsx`): Tìm kiếm, lọc theo trạng thái, phân trang.
  - Soạn thảo hợp đồng mới (`ContractCreatePage.tsx`): Nhập số hiệu, đối tác, giá trị, thời hạn.
  - Chi tiết hợp đồng (`ContractDetailPage.tsx`): Hiển thị đầy đủ thông tin pháp lý và các tabs chức năng.
  - Trực quan hóa Vòng đời Hợp đồng (`StateMachineVisualizer.tsx`): Thanh tiến trình thể hiện 8 trạng thái.
- 📄 *Chi tiết*: Xem [`docs/tasks/02_Task_Nguoi2_Contract_Lifecycle.md`](docs/tasks/02_Task_Nguoi2_Contract_Lifecycle.md)

---

### 👤 Người 3 (Đối Tác, Thanh Toán & Tệp Đính Kèm)
- **Module**: `src/features/partners/`, `src/features/payments/`, `src/features/attachments/`
- **Nhiệm vụ cụ thể**:
  - Danh mục đối tác (`PartnerListPage.tsx`): Tên công ty, MST, địa chỉ, người đại diện.
  - Quản lý đợt thanh toán (`PaymentTrackingPage.tsx`): Các mốc giải ngân, tiến độ %, trạng thái thanh toán.
  - Quản lý tệp đính kèm (`AttachmentListPage.tsx`): Kéo thả tải file (Dropzone), versioning (v1.0, v1.1).
- 📄 *Chi tiết*: Xem [`docs/tasks/03_Task_Nguoi3_Partner_Payment_Attachment.md`](docs/tasks/03_Task_Nguoi3_Partner_Payment_Attachment.md)

---

### 👤 Người 4 (Luồng Phê Duyệt & Ký Số Điện Tử)
- **Module**: `src/features/workflows/`
- **Nhiệm vụ cụ thể**:
  - Trực quan hóa timeline phê duyệt (`ApprovalTimeline.tsx`): Hiển thị các bước, người duyệt, nhận xét.
  - Hàng đợi phê duyệt (`ApprovalFlowPage.tsx`): Thao tác Duyệt (Approve) và Từ chối (Reject) kèm lý do.
  - Cấu hình luồng duyệt (`WorkflowConfigPage.tsx`): Định nghĩa các bước duyệt theo hạn mức giá trị hợp đồng.
  - Ký số điện tử (`SignContractModal.tsx`): Mô phỏng xác thực OTP / Chứng thư số USB Token.
- 📄 *Chi tiết*: Xem [`docs/tasks/04_Task_Nguoi4_Workflow_Signature.md`](docs/tasks/04_Task_Nguoi4_Workflow_Signature.md)

---

### 👤 Người 5 (Dashboard, Trợ Lý AI & Thông Báo)
- **Module**: `src/features/dashboard/`, `src/features/ai-analysis/`, `src/features/notifications/`
- **Nhiệm vụ cụ thể**:
  - Bảng điều khiển (`DashboardPage.tsx`): 4 thẻ chỉ số KPI, biểu đồ phân bổ trạng thái (Recharts), danh sách hợp đồng sắp hết hạn trong 30 ngày.
  - Trợ lý AI (`AIAnalysisPage.tsx`): Tóm tắt hợp đồng tự động, trích xuất thực thể, tính điểm rủi ro (Risk Score: Low/Medium/High).
  - Hệ thống thông báo (`NotificationListPage.tsx`): Nhắc việc phê duyệt, cảnh báo thời hạn.
- 📄 *Chi tiết*: Xem [`docs/tasks/05_Task_Nguoi5_Dashboard_AI_Notifications.md`](docs/tasks/05_Task_Nguoi5_Dashboard_AI_Notifications.md)

---

## 🔄 Vòng Đời Hợp Đồng & State Machine

Hệ thống quản lý chuyển đổi trạng thái hợp đồng chặt chẽ qua 8 bước:

```
[Draft] (Dự thảo)
   │
   ▼ (Trình duyệt)
[PendingApproval] (Chờ phê duyệt) ──(Từ chối)──► [Draft]
   │
   ▼ (Duyệt qua tất cả các cấp)
[Approved] (Đã phê duyệt)
   │
   ▼ (Ký số 2 bên)
[Signed] (Đã ký số)
   │
   ▼ (Đến ngày bắt đầu hiệu lực)
[Active] (Đang có hiệu lực)
   │
   ▼ (Còn dưới 30 ngày trước khi hết hạn)
[Expiring] (Cảnh báo sắp hết hạn)
   │
   ├──► [Renewed] (Tái ký / Gia hạn)
   └──► [Terminated] (Thanh lý / Kết thúc)
```

Mỗi trạng thái trên UI bắt buộc hiển thị kèm huy hiệu (Badge) với màu sắc nhận diện riêng biệt:
- `Draft`: Xám (Slate)
- `PendingApproval`: Vàng hổ phách (Amber)
- `Approved`: Xanh lam (Blue)
- `Signed`: Xanh chàm (Indigo)
- `Active`: Xanh lá (Emerald)
- `Expiring`: Cam đỏ (Orange/Rose)
- `Terminated`: Đỏ (Rose)
- `Renewed`: Xanh mòng két (Teal)

---

## 🔌 Quy Chuẩn Tích Hợp API Backend (.NET 9)

- **Base URL**: Cấu hình qua biến môi trường `VITE_API_BASE_URL` (Mặc định `https://localhost:7001`).
- **Xác thực**: JWT Bearer token gửi qua HTTP Header `Authorization: Bearer <token>`.
- **Tập trung hóa HTTP Call**: Toàn bộ yêu cầu mạng bắt buộc đi qua `src/api/client.ts`.
- **Server State Hook**: Không gọi `apiClient` trực tiếp trong component; tạo custom hook trong `src/hooks/data/` sử dụng `useQuery` / `useMutation`.

### Bảng Ánh Xạ Endpoints Cốt Lõi
| Phương thức | Endpoint | Chức năng | Phân hệ |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Đăng nhập hệ thống, nhận JWT | `identity` |
| `GET` | `/api/v1/contracts` | Danh sách hợp đồng (phân trang & lọc) | `contracts` |
| `GET` | `/api/v1/contracts/{id}` | Chi tiết thông tin hợp đồng | `contracts` |
| `POST` | `/api/v1/contracts` | Khởi tạo hợp đồng nháp | `contracts` |
| `POST` | `/api/v1/contracts/{id}/submit-approval` | Trình hợp đồng vào luồng duyệt | `contracts` |
| `POST` | `/api/v1/contracts/{id}/approve` | Phê duyệt bước hiện tại | `workflows` |
| `POST` | `/api/v1/contracts/{id}/reject` | Từ chối phê duyệt kèm lý do | `workflows` |
| `POST` | `/api/v1/contracts/{id}/sign` | Thực hiện ký số điện tử | `workflows` |
| `GET` | `/api/v1/partners` | Danh mục đối tác kinh doanh | `partners` |
| `GET` | `/api/v1/contracts/{id}/ai-analysis` | Lấy kết quả AI phân tích rủi ro | `ai-analysis` |
| `GET` | `/api/v1/dashboard/metrics` | Lấy số liệu thống kê KPI tổng hợp | `dashboard` |

📄 *Chi tiết đầy đủ*: Xem [`docs/api/contract-api-specs.md`](docs/api/contract-api-specs.md)

---

## 📜 Quy Tắc Lập Trình (Coding Guidelines)

Dự án tuân thủ nghiêm ngặt các quy tắc lập trình tại [CLAUDE.md](CLAUDE.md):
1. **TypeScript Strict**:
   - Luôn bật `strict: true`.
   - Tuyệt đối không dùng kiểu `any`. Dùng `unknown` hoặc type guards khi chưa rõ kiểu.
2. **Kích Thước File**:
   - Giữ mỗi component dưới 200 dòng code. Nếu vượt quá, chủ động tách nhỏ theo trách nhiệm.
3. **Quản Lý Trạng Thái**:
   - Dữ liệu từ API: Bắt buộc dùng **TanStack Query v5**. Tuyệt đối không copy dữ liệu server vào `useState` cục bộ.
   - Trạng thái phiên toàn cục (Auth, Theme): Dùng **Zustand**.
4. **Imports**:
   - Dùng path alias `@/` thay cho đường dẫn tương đối dài (`../../`).
   - Tuyệt đối không để lại imports hoặc biến không sử dụng (`noUnusedLocals: true`).

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu tiên quyết
- **Node.js**: Phiên bản `>= 18.0.0` (Khuyến nghị Node 20 LTS).
- **npm** hoặc **yarn / pnpm**.

### Các lệnh thực thi

```bash
# 1. Di chuyển vào thư mục frontend
cd "contract-management-frontend"

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển (Dev Server)
npm run dev
```

Mở trình duyệt tại địa chỉ: **`http://localhost:5173`**

### Kiểm tra build sản phẩm
```bash
npm run build
```

---

## 📚 Hệ Thống Tài Liệu Chi Tiết (Docs Directory)

Dự án sở hữu kho tài liệu hoàn chỉnh tại thư mục [`docs/`](docs/):

```
docs/
├── api/
│   └── contract-api-specs.md                 # Đặc tả toàn bộ API tích hợp với Backend
├── architecture/
│   ├── architecture.md                       # Kiến trúc hệ thống, State & RBAC
│   └── module-boundaries.md                  # Quy ước ranh giới các module src/features/
└── tasks/
    ├── 00_Master_Roadmap.md                  # Lộ trình tổng quan 4 Phase
    ├── 01_Task_Nguoi1_Identity_Layout.md     # Kế hoạch chi tiết Người 1
    ├── 02_Task_Nguoi2_Contract_Lifecycle.md  # Kế hoạch chi tiết Người 2
    ├── 03_Task_Nguoi3_Partner_Payment_Attachment.md # Kế hoạch chi tiết Người 3
    ├── 04_Task_Nguoi4_Workflow_Signature.md  # Kế hoạch chi tiết Người 4
    └── 05_Task_Nguoi5_Dashboard_AI_Notifications.md # Kế hoạch chi tiết Người 5
```
