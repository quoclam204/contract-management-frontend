import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Department } from '@/types/department';
import { useDeleteDepartment } from '@/hooks/data/useDepartments';
import { AlertTriangle } from 'lucide-react';

interface DeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export const DeleteDepartmentModal: React.FC<DeleteDepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const [error, setError] = useState<string | null>(null);
  const deleteMutation = useDeleteDepartment();

  if (!department) return null;

  const handleDelete = async () => {
    try {
      setError(null);
      await deleteMutation.mutateAsync(department.id);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Không thể xóa phòng ban. Có thể phòng ban đang có nhân viên hoặc hợp đồng liên kết.';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa phòng ban"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Cảnh báo quyền Admin</p>
            <p className="text-amber-800">
              Bạn đang chuẩn bị xóa phòng ban{' '}
              <strong className="underline">{department.name}</strong>. Hành
              động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};
