import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDepartments } from '@/hooks/data/useDepartments';
import { useCreateUser, useUpdateUser, UserDetail } from '@/hooks/data/useUsers';
import { ROLE_VALUES } from '@/types/auth';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserDetail | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<number>(2); // Default Staff = 2
  const [departmentId, setDepartmentId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { data: departments = [] } = useDepartments();
  const isEditing = !!initialData;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setEmail(initialData.email);
      setPassword('');
      setRole(ROLE_VALUES[initialData.role] ?? 2);
      setDepartmentId(initialData.departmentId || '');
    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setRole(2);
      setDepartmentId('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Vui lòng nhập đầy đủ họ tên và email');
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      setError('Mật khẩu bắt buộc và phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setError(null);
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          payload: {
            fullName: fullName.trim(),
            email: email.trim(),
            role,
            departmentId: departmentId || null,
          },
        });
      } else {
        await createMutation.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          role,
          departmentId: departmentId || null,
        });
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi lưu người dùng';
      setError(msg);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
      description={
        isEditing
          ? 'Chỉnh sửa thông tin, quyền hạn hoặc đổi phòng ban cho nhân viên'
          : 'Khởi tạo tài khoản mới và cấp quyền truy cập hệ thống (Chỉ Admin)'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Họ và tên <span className="text-rose-500">*</span>
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn An"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Địa chỉ Email <span className="text-rose-500">*</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="an.nguyen@clm.com"
            required
          />
        </div>

        {!isEditing && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mật khẩu khởi tạo <span className="text-rose-500">*</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự (Ví dụ: Password@123)"
              required={!isEditing}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vai trò (Role RBAC) <span className="text-rose-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(Number(e.target.value))}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value={0}>Admin (Quản trị viên toàn quyền)</option>
              <option value={1}>Manager (Trưởng phòng)</option>
              <option value={2}>Staff (Nhân viên)</option>
              <option value={3}>Approver (Người phê duyệt)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phòng ban trực thuộc
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Chưa phân bổ --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {isEditing ? 'Lưu thay đổi' : 'Tạo tài khoản'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
