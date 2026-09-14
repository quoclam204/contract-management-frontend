import React, { useState } from 'react';
import { useDepartments } from '@/hooks/data/useDepartments';
import { Department } from '@/types/department';
import { DepartmentModal } from './components/DepartmentModal';
import { DeleteDepartmentModal } from './components/DeleteDepartmentModal';
import { Can } from '@/components/auth/Can';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

export const DepartmentListPage: React.FC = () => {
  const { data: departments = [], isLoading, isError, error } = useDepartments();

  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingDepartment(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Danh Sách Phòng Ban</h1>
            <Badge variant="default">{departments.length} phòng ban</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý cơ cấu tổ chức doanh nghiệp và phân bổ hợp đồng theo phòng ban
          </p>
        </div>

        {/* RBAC: Only Admin and Manager can create departments */}
        <Can
          roles={['Admin', 'Manager']}
          fallback={
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Chế độ chỉ xem (Staff)</span>
            </div>
          }
        >
          <Button onClick={handleOpenCreate} variant="primary" className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Thêm phòng ban</span>
          </Button>
        </Can>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên phòng ban..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Table content */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Đang tải danh sách phòng ban...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-rose-600 bg-rose-50/50">
            Lỗi khi tải dữ liệu: {(error as Error)?.message || 'Không thể kết nối API'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Chưa có phòng ban nào</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hệ thống chưa có dữ liệu phòng ban hoặc không tìm thấy kết quả phù hợp từ khóa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tên phòng ban</th>
                  <th className="py-3 px-4">Mã phòng ban (ID)</th>
                  <th className="py-3 px-4">Trưởng phòng (Manager)</th>
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {dept.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{dept.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {dept.id.substring(0, 8)}...{dept.id.substring(dept.id.length - 4)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {dept.managerId ? (
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {dept.managerId.substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa phân công</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {formatDate(dept.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit: Manager & Admin */}
                        <Can roles={['Admin', 'Manager']}>
                          <button
                            onClick={() => handleOpenEdit(dept)}
                            title="Chỉnh sửa phòng ban"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </Can>

                        {/* Delete: Only Admin */}
                        <Can roles={['Admin']}>
                          <button
                            onClick={() => setDeletingDepartment(dept)}
                            title="Xóa phòng ban (Chỉ Admin)"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <DepartmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingDepartment}
      />
      <DeleteDepartmentModal
        isOpen={!!deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
        department={deletingDepartment}
      />
    </div>
  );
};
