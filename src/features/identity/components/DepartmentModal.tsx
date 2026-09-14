import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Department } from '@/types/department';
import {
  useCreateDepartment,
  useUpdateDepartment,
} from '@/hooks/data/useDepartments';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Department | null;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setManagerId(initialData.managerId || '');
    } else {
      setName('');
      setManagerId('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên phòng ban');
      return;
    }

    try {
      setError(null);
      const payload = {
        name: name.trim(),
        managerId: managerId.trim() ? managerId.trim() : null,
      };

      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, dto: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu phòng ban';
      setError(msg);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
      description={
        isEditing
          ? 'Cập nhật thông tin phòng ban (Yêu cầu quyền Manager trở lên)'
          : 'Khởi tạo phòng ban mới vào hệ thống (Yêu cầu quyền Manager trở lên)'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tên phòng ban <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Phòng Pháp Chế, Ban Tài Chính..."
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mã Trưởng phòng (Manager ID - Tùy chọn)
          </label>
          <Input
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="Nhập GUID trưởng phòng (hoặc để trống)"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Có thể cập nhật hoặc gán trưởng phòng sau khi tạo.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            {isEditing ? 'Lưu thay đổi' : 'Tạo phòng ban'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
