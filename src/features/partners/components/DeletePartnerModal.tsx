import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { AlertTriangle, Building2, FileText, Mail, User } from 'lucide-react';
import { Partner } from '../types/partner.types';
import { deletePartner } from '../api/partnerApi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface DeletePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
}

export const DeletePartnerModal: React.FC<DeletePartnerModalProps> = ({
  isOpen,
  onClose,
  partner,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!partner?.id) throw new Error('Không tìm thấy thông tin đối tác');
      return await deletePartner(partner.id);
    },
    onSuccess: () => {
      message.success(`Đã xóa đối tác "${partner?.name || ''}" thành công!`);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      onClose();
    },
    onError: (err: Error) => {
      const errMsg = err.message || 'Không thể xóa đối tác. Vui lòng thử lại sau.';
      message.error(errMsg);
    },
  });

  if (!partner) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!mutation.isPending) {
          onClose();
        }
      }}
      title="Xác nhận xóa đối tác"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm text-rose-900">
              Hành động này không thể hoàn tác!
            </p>
            <p className="text-rose-700 leading-relaxed">
              Bạn có chắc chắn muốn xóa đối tác{' '}
              <strong className="text-slate-900 font-semibold underline">
                {partner.name}
              </strong>{' '}
              khỏi hệ thống không?
            </p>
          </div>
        </div>

        {/* Partner Info Summary Card */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-medium text-slate-800 pb-2 border-b border-slate-200/60">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">{partner.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>MST:</span>
              <span className="font-mono font-medium text-slate-800">
                {partner.taxCode}
              </span>
            </div>

            {partner.representative && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Đại diện:</span>
                <span className="font-medium text-slate-800 truncate">
                  {partner.representative}
                </span>
              </div>
            )}

            {partner.contactEmail && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Email:</span>
                <span className="font-medium text-slate-800 truncate">
                  {partner.contactEmail}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error notice if mutation failed (e.g., tied to contracts) */}
        {mutation.isError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Không thể thực hiện xóa:</p>
              <p className="text-amber-800 mt-0.5">
                {mutation.error?.message ||
                  'Đối tác này có thể đang liên kết với hợp đồng hoặc giao dịch trong hệ thống. Vui lòng kiểm tra lại.'}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Xóa đối tác
          </Button>
        </div>
      </div>
    </Modal>
  );
};
