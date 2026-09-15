import React, { useState } from 'react';
import { useUsers, useToggleUserActive, UserDetail } from '@/hooks/data/useUsers';
import { useDepartments } from '@/hooks/data/useDepartments';
import { UserModal } from './components/UserModal';
import { Can } from '@/components/auth/Can';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Pencil,
  Lock,
  Unlock,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { UserRole } from '@/types/auth';

const ROLE_BADGES: Record<UserRole, { label: string; className: string }> = {
  Admin: { label: 'Admin (Toàn quyền)', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  Manager: { label: 'Manager (Trưởng phòng)', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Staff: { label: 'Staff (Nhân viên)', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  Approver: { label: 'Approver (Người duyệt)', className: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export const UserManagementPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null);

  const { data: departments = [] } = useDepartments();

  const filterParams = {
    pageNumber: page,
    pageSize,
    search: search.trim() || undefined,
    role: selectedRole !== '' ? Number(selectedRole) : undefined,
    departmentId: selectedDept || undefined,
    isActive: selectedStatus !== '' ? selectedStatus === 'true' : undefined,
  };

  const { data, isLoading, isError, error } = useUsers(filterParams);
  const toggleActiveMutation = useToggleUserActive();

  const users = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const handleOpenCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: UserDetail) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleToggleActive = async (user: UserDetail) => {
    const actionText = user.isActive ? 'khóa' : 'mở khóa';
    if (window.confirm(`Bạn có chắc muốn ${actionText} tài khoản của ${user.fullName}?`)) {
      try {
        await toggleActiveMutation.mutateAsync(user.id);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Thao tác thất bại');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Người Dùng & Phân Quyền</h1>
            <Badge variant="default">{totalCount} người dùng</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị danh sách nhân sự, phân cấp vai trò (Admin, Manager, Staff, Approver) và gán phòng ban
          </p>
        </div>

        {/* RBAC: Only Admin can create users and assign roles */}
        <Can
          roles={['Admin']}
          fallback={
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Chỉ Admin mới có quyền thêm/phân quyền User</span>
            </div>
          }
        >
          <Button onClick={handleOpenCreate} variant="primary" className="flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" />
            <span>Thêm người dùng</span>
          </Button>
        </Can>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên hoặc email..."
            className="pl-9 text-xs"
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tất cả vai trò</option>
          <option value="0">Admin</option>
          <option value="1">Manager</option>
          <option value="2">Staff</option>
          <option value="3">Approver</option>
        </select>

        {/* Department Filter */}
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tất cả phòng ban</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Đã bị khóa</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Đang tải danh sách người dùng...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-rose-600 bg-rose-50/50">
            Lỗi khi tải dữ liệu: {(error as Error)?.message || 'Không thể kết nối API'}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <UsersIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Không tìm thấy người dùng nào</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Chưa có dữ liệu hoặc không có người dùng nào khớp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Người dùng</th>
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4">Phòng ban</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => {
                  const roleConfig = ROLE_BADGES[u.role] || {
                    label: u.roleName || u.role,
                    className: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleConfig.className}`}
                        >
                          {roleConfig.label}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-600">
                        {u.departmentName ? (
                          <span className="flex items-center gap-1.5 text-xs text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {u.departmentName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Chưa phân bổ</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* CreatedAt */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit User: Only Admin */}
                          <Can roles={['Admin']}>
                            <button
                              onClick={() => handleOpenEdit(u)}
                              title="Chỉnh sửa thông tin / đổi vai trò"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </Can>

                          {/* Lock / Unlock: Only Admin */}
                          <Can roles={['Admin']}>
                            <button
                              onClick={() => handleToggleActive(u)}
                              title={u.isActive ? 'Khóa tài khoản này' : 'Mở khóa tài khoản'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                u.isActive
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-rose-600 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {u.isActive ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50">
            <div>
              Hiển thị <span className="font-semibold text-slate-700">{users.length}</span> /{' '}
              <span className="font-semibold text-slate-700">{totalCount}</span> người dùng
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-xs h-8 px-2.5"
              >
                Trước
              </Button>
              <span className="text-[11px] text-slate-600 font-medium">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="text-xs h-8 px-2.5"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingUser}
      />
    </div>
  );
};
