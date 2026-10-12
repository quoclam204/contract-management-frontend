import React, { useState } from 'react';
import { Modal, Form, Input, Select, Radio, Alert, message } from 'antd';
import { PenTool, KeyRound, ShieldCheck } from 'lucide-react';
import {
  SignerType,
  SignatureMethod,
  type ContractSignatureStatusDto,
} from '../types/workflow.types';
import { getSignatureStatus, signContract } from '../services/workflowApi';

import { useAuthStore } from '@/features/identity/useAuthStore';

interface SignContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  contractNumber?: string;
  contractTitle?: string;
  partnerId?: string;
  onSuccess?: () => void;
}

interface SignatureFormValues {
  signerType: SignerType;
  signerName: string;
  signerEmail?: string;
  signerRole?: string;
  signatureMethod: SignatureMethod;
  otpCode?: string;
  reason?: string;
}

export const SignContractModal: React.FC<SignContractModalProps> = ({
  isOpen,
  onClose,
  contractId,
  contractNumber,
  contractTitle,
  partnerId,
  onSuccess,
}) => {
  const [form] = Form.useForm<SignatureFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<SignatureMethod>(SignatureMethod.Mock);
  const [signatureStatus, setSignatureStatus] = useState<ContractSignatureStatusDto | null>(null);

  const currentUser = useAuthStore((state) => state.user);

  // Cập nhật form và xác định bên còn thiếu chữ ký khi modal mở.
  React.useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    setError(null);
    setSignatureStatus(null);
    setSelectedMethod(SignatureMethod.Mock);
    form.setFieldsValue({
      signerType: SignerType.InternalUser,
      signatureMethod: SignatureMethod.Mock,
      otpCode: '123456',
      signerName: currentUser?.fullName || 'Nguyễn Văn A',
      signerEmail: currentUser?.email || 'user1@clm.com',
      signerRole: currentUser?.roleName || (currentUser?.role ? `Vai trò ${currentUser.role}` : 'Đại diện thẩm quyền'),
    });

    setIsLoadingStatus(true);
    void getSignatureStatus(contractId)
      .then((status) => {
        if (isCancelled) return;

        setSignatureStatus(status);
        if (status.hasInternalSignature && !status.hasPartnerSignature && partnerId) {
          form.setFieldValue('signerType', SignerType.PartnerRepresentative);
        }
      })
      .catch((statusError: unknown) => {
        if (isCancelled) return;
        setError(
          statusError instanceof Error
            ? statusError.message
            : 'Không thể tải trạng thái ký của hợp đồng.'
        );
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingStatus(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [contractId, currentUser, form, isOpen, partnerId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (signatureStatus?.isFullySigned) {
        setError('Hợp đồng đã được cả hai bên ký đầy đủ.');
        return;
      }

      if (values.signerType === SignerType.PartnerRepresentative && !partnerId) {
        setError('Hợp đồng chưa có thông tin đối tác để thực hiện chữ ký đối tác.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Ưu tiên Id thực tế của user hiện tại, fallback về user hợp lệ trong database
      const internalSignerId =
        values.signerType === SignerType.InternalUser
          ? currentUser?.id || '897a44a7-000f-4b89-a70e-feb4a14b8c96'
          : undefined;

      const partnerSignerId =
        values.signerType === SignerType.PartnerRepresentative
          ? partnerId
          : undefined;

      await signContract({
        contractId,
        signerType: values.signerType,
        internalSignerId,
        partnerSignerId,
        signerName: values.signerName.trim(),
        signerEmail: values.signerEmail?.trim(),
        signerRole: values.signerRole?.trim(),
        signatureMethod: values.signatureMethod,
        otpCode: values.signatureMethod === SignatureMethod.Otp ? values.otpCode : undefined,
        reason: values.reason?.trim(),
      });

      message.success('Ký điện tử hợp đồng thành công!');
      form.resetFields();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ký số thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setError(null);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-base">
          <PenTool className="w-5 h-5 text-indigo-500" />
          Ký Kết Hợp Đồng Điện Tử (Người 4)
        </div>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isSubmitting}
      okButtonProps={{
        disabled: isLoadingStatus || signatureStatus?.isFullySigned === true,
      }}
      okText="Xác nhận Ký số"
      cancelText="Đóng"
      width={580}
      centered
    >
      <div className="space-y-4 py-2">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
          <div>
            <strong>Hợp đồng:</strong> {contractNumber || '—'} - {contractTitle || 'Hợp đồng'}
          </div>
          <div className="text-slate-400 mt-0.5">
            Khi tất cả các bên hoàn tất ký số, hợp đồng sẽ chính thức có hiệu lực (Active).
          </div>
        </div>

        {error && <Alert type="error" message={error} showIcon />}

        {signatureStatus && (
          <Alert
            type={signatureStatus.isFullySigned ? 'success' : 'info'}
            showIcon
            message={`Tiến độ ký: ${signatureStatus.signedPartiesCount}/${signatureStatus.totalRequiredParties} bên`}
            description={
              signatureStatus.isFullySigned
                ? 'Hợp đồng đã được cả bên Nội bộ và Đối tác ký đầy đủ.'
                : `Nội bộ: ${signatureStatus.hasInternalSignature ? 'Đã ký' : 'Chưa ký'} • Đối tác: ${signatureStatus.hasPartnerSignature ? 'Đã ký' : 'Chưa ký'}`
            }
          />
        )}

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            signerType: SignerType.InternalUser,
            signatureMethod: SignatureMethod.Mock,
            otpCode: '123456',
            signerName: 'Nguyễn Văn A',
            signerEmail: 'nguyenvana@clm.com',
            signerRole: 'Đại diện thẩm quyền',
          }}
        >
          <Form.Item
            name="signerType"
            label="Bên tham gia ký kết"
            rules={[{ required: true }]}
          >
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-3">
                <Radio.Button
                  value={SignerType.InternalUser}
                  disabled={signatureStatus?.hasInternalSignature}
                  className="text-center py-1"
                >
                  Đại diện Nội bộ
                </Radio.Button>
                <Radio.Button
                  value={SignerType.PartnerRepresentative}
                  disabled={signatureStatus?.hasPartnerSignature || !partnerId}
                  className="text-center py-1"
                >
                  Đại diện Đối tác
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item
              name="signerName"
              label="Họ & tên người ký"
              rules={[{ required: true, message: 'Vui lòng nhập tên người ký' }]}
            >
              <Input placeholder="VD: Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="signerRole"
              label="Chức vụ / Vai trò"
            >
              <Input placeholder="VD: Tổng Giám Đốc" />
            </Form.Item>
          </div>

          <Form.Item
            name="signerEmail"
            label="Email người ký"
          >
            <Input type="email" placeholder="VD: email@doanhnghiep.vn" />
          </Form.Item>

          <Form.Item
            name="signatureMethod"
            label="Phương thức ký xác thực"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(val: SignatureMethod) => setSelectedMethod(val)}
              options={[
                {
                  value: SignatureMethod.Mock,
                  label: (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Ký điện tử Mock (Nhanh - Dành cho Demo/Test)</span>
                    </div>
                  ),
                },
                {
                  value: SignatureMethod.Otp,
                  label: (
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-blue-500" />
                      <span>Xác thực mã OTP (Mã demo: 123456)</span>
                    </div>
                  ),
                },
              ]}
            />
          </Form.Item>

          {selectedMethod === SignatureMethod.Otp && (
            <Form.Item
              name="otpCode"
              label="Mã OTP xác thực"
              rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}
              extra="Mã OTP demo mặc định của hệ thống là 123456"
            >
              <Input placeholder="Nhập 6 chữ số OTP" maxLength={6} />
            </Form.Item>
          )}

          <Form.Item name="reason" label="Ghi chú ký kết (Tùy chọn)">
            <Input.TextArea rows={2} placeholder="Nhập ghi chú hoặc lý do ký kết..." />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
