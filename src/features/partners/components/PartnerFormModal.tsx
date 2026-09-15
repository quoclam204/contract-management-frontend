import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Partner } from '../types/partner.types';
import { createPartner, updatePartner } from '../api/partnerApi';
import { partnerFormSchema, PartnerFormData } from '../schemas/partner.schema';

export interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partner | null;
}

export const PartnerFormModal: React.FC<PartnerFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialData && initialData.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: '',
      taxCode: '',
      representative: '',
      contactEmail: '',
      address: '',
    },
  });

  // Synchronize form values whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          taxCode: initialData.taxCode || '',
          representative: initialData.representative || '',
          contactEmail: initialData.contactEmail || '',
          address: initialData.address || '',
        });
      } else {
        reset({
          name: '',
          taxCode: '',
          representative: '',
          contactEmail: '',
          address: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const mutation = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      if (isEdit && initialData?.id) {
        return await updatePartner(initialData.id, data);
      }
      return await createPartner(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      message.success(
        isEdit
          ? 'Cập nhật thông tin đối tác thành công!'
          : 'Thêm mới đối tác thành công!'
      );
      onClose();
    },
    onError: (error: Error) => {
      message.error(
        error.message ||
          (isEdit
            ? 'Không thể cập nhật đối tác. Vui lòng thử lại.'
            : 'Không thể thêm mới đối tác. Vui lòng thử lại.')
      );
    },
  });

  const onSubmit = (data: PartnerFormData) => {
    mutation.mutate(data);
  };

  const isLoading = mutation.isPending || isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) {
          onClose();
        }
      }}
      title={isEdit ? 'Chỉnh sửa đối tác' : 'Thêm mới đối tác'}
      description={
        isEdit
          ? 'Cập nhật thông tin đối tác doanh nghiệp / nhà cung cấp trong hệ thống'
          : 'Thêm mới đối tác kinh doanh để phục vụ quản lý hợp đồng và thanh toán'
      }
      maxWidth="lg"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mutation.isError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Đã xảy ra lỗi:</p>
              <p className="mt-0.5 text-rose-700">
                {mutation.error?.message ||
                  'Không thể lưu thông tin đối tác. Vui lòng kiểm tra lại.'}
              </p>
            </div>
          </div>
        )}

        {/* Tên đối tác */}
        <div>
          <Input
            id="partner-name"
            label="Tên đối tác / Doanh nghiệp"
            required
            placeholder="VD: Công ty Cổ phần Công nghệ FPT"
            error={errors.name?.message}
            disabled={isLoading}
            {...register('name')}
          />
        </div>

        {/* Grid 2 cột: Mã số thuế & Người đại diện */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="partner-taxCode"
            label="Mã số thuế"
            required
            placeholder="VD: 0101234567 hoặc 0101234567-001"
            error={errors.taxCode?.message}
            disabled={isLoading}
            {...register('taxCode')}
          />

          <Input
            id="partner-representative"
            label="Người đại diện"
            required
            placeholder="VD: Nguyễn Văn A"
            error={errors.representative?.message}
            disabled={isLoading}
            {...register('representative')}
          />
        </div>

        {/* Email liên hệ */}
        <div>
          <Input
            id="partner-contactEmail"
            type="email"
            label="Email liên hệ"
            required
            placeholder="VD: contact@doitac.com"
            error={errors.contactEmail?.message}
            disabled={isLoading}
            {...register('contactEmail')}
          />
        </div>

        {/* Địa chỉ trụ sở */}
        <div className="space-y-1.5">
          <label
            htmlFor="partner-address"
            className="block text-xs font-semibold text-slate-700"
          >
            Địa chỉ trụ sở <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="partner-address"
            rows={3}
            placeholder="VD: Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội"
            disabled={isLoading}
            className={cn(
              'w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-2xs placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              errors.address && 'border-rose-400 focus:ring-rose-500 focus:border-rose-500'
            )}
            {...register('address')}
          />
          {errors.address ? (
            <p className="text-xs text-rose-500 font-medium">
              {errors.address.message}
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Tối đa 500 ký tự theo quy định bảng 4.3 SRS v3.
            </p>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm đối tác'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
