import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { AlertTriangle } from 'lucide-react';
import { Attachment } from '../types/attachment.types';
import { deleteAttachment } from '../api/attachmentApi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface DeleteAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
}

export const DeleteAttachmentModal: React.FC<DeleteAttachmentModalProps> = ({
  isOpen,
  onClose,
  attachment,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!attachment) throw new Error('Không tìm thấy tệp đính kèm');
      return await deleteAttachment(attachment.id);
    },
    onSuccess: () => {
      message.success(`Đã xóa tệp "${attachment?.fileName || ''}" thành công!`);
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      onClose();
    },
    onError: (err: Error) => {
      message.error(err.message || 'Không thể xóa tệp. Vui lòng thử lại sau.');
    },
  });

  if (!attachment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác Nhận Xóa Tệp Đính Kèm"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm text-rose-900">
              Hành động này không thể hoàn tác!
            </p>
            <p className="text-rose-700">
              Bạn có chắc chắn muốn xóa tệp{' '}
              <strong className="text-slate-900 font-semibold underline">
                {attachment.fileName}
              </strong>{' '}
              (phiên bản {attachment.versionString || `v${attachment.currentVersion}`}) cùng toàn bộ các phiên bản lịch sử của tệp này không?
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between text-slate-500">
            <span>Hợp đồng liên kết:</span>
            <span className="font-medium text-slate-800">
              {attachment.contractNumber || 'Chưa liên kết'}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Số phiên bản lưu trữ:</span>
            <span className="font-medium text-slate-800">
              {attachment.versions?.length || 1} phiên bản
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Xác Nhận Xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};
