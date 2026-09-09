# Đặc Tả Tích Hợp API Frontend - Backend (API Specs)

Tài liệu ánh xạ danh sách các API Endpoints mà Frontend gọi tới Backend ASP.NET Core Web API (`VITE_API_BASE_URL`).

---

## 1. Xác Thực & Người Dùng (Auth & Identity)

| Phương thức | Endpoint | Mô tả | Request Body | Response DTO |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Đăng nhập hệ thống, lấy JWT Bearer Token | `{ username, password }` | `{ token, refreshToken, user: { id, fullName, role, department } }` |
| `POST` | `/api/v1/auth/refresh-token` | Làm mới Token khi hết hạn | `{ refreshToken }` | `{ token, refreshToken }` |
| `GET` | `/api/v1/users/me` | Lấy thông tin tài khoản hiện tại | - | `UserDto` |
| `GET` | `/api/v1/users` | Danh sách người dùng (dùng chọn Approver) | `?departmentId=...` | `List<UserDto>` |

---

## 2. Quản Lý Hợp Đồng (Contracts)

| Phương thức | Endpoint | Mô tả | Query / Body | Response DTO |
|---|---|---|---|---|
| `GET` | `/api/v1/contracts` | Lấy danh sách hợp đồng (phân trang, lọc) | `?page=1&pageSize=20&status=...&keyword=...` | `PagedResult<ContractSummaryDto>` |
| `GET` | `/api/v1/contracts/{id}` | Chi tiết hợp đồng đầy đủ thông tin | `id: string/guid` | `ContractDetailDto` |
| `POST` | `/api/v1/contracts` | Tạo mới hợp đồng nháp | `{ title, contractNumber, partnerId, value, startDate, endDate, contractTypeId, description }` | `ContractDetailDto` |
| `PUT` | `/api/v1/contracts/{id}` | Cập nhật hợp đồng (khi ở trạng thái Draft) | Payload cập nhật | `ContractDetailDto` |
| `DELETE` | `/api/v1/contracts/{id}` | Xóa hợp đồng nháp | - | `204 No Content` |
| `POST` | `/api/v1/contracts/{id}/submit-approval` | Trình duyệt hợp đồng (chuyển sang `PendingApproval`) | - | `{ status: "PendingApproval" }` |

---

## 3. Quy Trình Duyệt & Ký Số (Workflows & Signature)

| Phương thức | Endpoint | Mô tả | Request Body | Response DTO |
|---|---|---|---|---|
| `GET` | `/api/v1/contracts/{id}/workflow-steps` | Lấy danh sách các bước duyệt hợp đồng | - | `List<WorkflowStepDto>` |
| `POST` | `/api/v1/contracts/{id}/approve` | Duyệt bước hiện tại của hợp đồng | `{ stepId, comment }` | `{ currentStep, contractStatus }` |
| `POST` | `/api/v1/contracts/{id}/reject` | Từ chối hợp đồng kèm lý do | `{ stepId, reason }` | `{ contractStatus: "Draft" }` |
| `POST` | `/api/v1/contracts/{id}/sign` | Ký số điện tử vào hợp đồng | `{ otpCode, certificateSerial, signRole }` | `{ signatureId, signedAt, contractStatus: "Signed" }` |

---

## 4. Quản Lý Đối Tác (Partners) & Thanh Toán (Payments)

| Phương thức | Endpoint | Mô tả | Query / Body | Response DTO |
|---|---|---|---|---|
| `GET` | `/api/v1/partners` | Danh sách đối tác | `?keyword=...` | `List<PartnerDto>` |
| `POST` | `/api/v1/partners` | Thêm mới đối tác | `{ name, taxCode, email, phone, address }` | `PartnerDto` |
| `GET` | `/api/v1/contracts/{id}/payments` | Danh sách mốc thanh toán của hợp đồng | - | `List<PaymentMilestoneDto>` |
| `POST` | `/api/v1/contracts/{id}/payments` | Thêm mốc thanh toán | `{ title, amount, dueDate, notes }` | `PaymentMilestoneDto` |

---

## 5. Trợ Lý Phân Tích AI & Báo Cáo (AI Analysis & Dashboard)

| Phương thức | Endpoint | Mô tả | Query / Body | Response DTO |
|---|---|---|---|---|
| `GET` | `/api/v1/contracts/{id}/ai-analysis` | Lấy kết quả AI phân tích hợp đồng | - | `AIAnalysisResultDto` |
| `POST` | `/api/v1/contracts/{id}/ai-analyze` | Kích hoạt tác vụ phân tích AI | - | `{ taskId, status: "Processing" }` |
| `GET` | `/api/v1/dashboard/metrics` | Lấy số liệu tổng hợp KPI | - | `DashboardMetricsDto` |
| `GET` | `/api/v1/dashboard/expiring-contracts` | Danh sách hợp đồng sắp hết hạn trong 30 ngày | - | `List<ContractSummaryDto>` |
