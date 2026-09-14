import React, { useState } from 'react';
import { Modal, Input, Typography, Alert } from 'antd';
import { AlertTriangle } from 'lucide-react';

const { TextArea } = Input;
const { Text } = Typography;

interface RejectDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractNumber?: string;
  stepOrder: number;
  onConfirm: (comment: string) => Promise<void>;
  isSubmitting: boolean;
}

export const RejectDecisionModal: React.FC<RejectDecisionModalProps> = ({
  isOpen,
  onClose,
  contractNumber,
  stepOrder,
  onConfirm,
  isSubmitting,
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOk = async () => {
    if (!comment.trim()) {
      setError('Vui lòng nhập lý do từ chối phê duyệt (bắt buộc).');
      return;
    }
    setError(null);
    try {
      await onConfirm(comment.trim());
      setComment('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi từ chối phê duyệt.';
      setError(msg);
    }
  };

  const handleCancel = () => {
    setComment('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-rose-600 font-semibold text-base">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          Xác Nhận Từ Chối Phê Duyệt
        </div>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isSubmitting}
      okText="Xác nhận Từ Chối"
      cancelText="Hủy bỏ"
      okButtonProps={{ danger: true }}
      centered
    >
      <div className="space-y-4 py-2">
        <p className="text-sm text-slate-600">
          Bạn đang từ chối phê duyệt ở <strong>Bước #{stepOrder}</strong>{' '}
          {contractNumber ? `của hợp đồng ${contractNumber}` : ''}. Tiến trình duyệt sẽ dừng lại và thông báo
          tới các bên liên quan.
        </p>

        {error && <Alert type="error" message={error} showIcon />}

        <div>
          <div className="mb-1">
            <Text strong className="text-xs text-slate-700">
              Lý do từ chối <span className="text-rose-500">*</span>:
            </Text>
          </div>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập chi tiết lý do từ chối (VD: Cần điều chỉnh lại điều khoản thanh toán mục 3.2...)"
            maxLength={500}
            showCount
          />
        </div>
      </div>
    </Modal>
  );
};
