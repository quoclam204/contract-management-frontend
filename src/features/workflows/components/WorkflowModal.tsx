import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Button } from 'antd';
import { Plus, Trash2, Sliders } from 'lucide-react';
import {
  ApproverRole,
  APPROVER_ROLE_MAP,
  type CreateWorkflowDefinitionRequest,
  type WorkflowDefinitionDto,
} from '../types/workflow.types';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWorkflow?: WorkflowDefinitionDto | null;
  onSubmit: (values: CreateWorkflowDefinitionRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  editingWorkflow,
  onSubmit,
  isSubmitting,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editingWorkflow) {
        form.setFieldsValue({
          name: editingWorkflow.name,
          conditionExpression: editingWorkflow.conditionExpression,
          isActive: editingWorkflow.isActive,
          steps: editingWorkflow.steps.map((s) => ({
            stepOrder: s.stepOrder,
            approverRole: s.approverRole,
            minimumAmount: s.minimumAmount,
            isRequired: s.isRequired,
          })),
        });
      } else {
        form.setFieldsValue({
          name: '',
          conditionExpression: 'ContractValue > 10000000',
          isActive: true,
          steps: [
            { stepOrder: 1, approverRole: ApproverRole.Manager, minimumAmount: 0, isRequired: true },
            { stepOrder: 2, approverRole: ApproverRole.Approver, minimumAmount: 50000000, isRequired: true },
            { stepOrder: 3, approverRole: ApproverRole.Admin, minimumAmount: 200000000, isRequired: true },
          ],
        });
      }
    }
  }, [isOpen, editingWorkflow, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        name: values.name,
        conditionExpression: values.conditionExpression,
        isActive: values.isActive,
        steps: values.steps.map((s: any, idx: number) => ({
          stepOrder: idx + 1,
          approverRole: s.approverRole,
          minimumAmount: s.minimumAmount || 0,
          isRequired: s.isRequired ?? true,
        })),
      });
      form.resetFields();
      onClose();
    } catch {
      // Form validation error handled by AntD
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-base">
          <Sliders className="w-5 h-5 text-indigo-500" />
          {editingWorkflow ? `Tạo Phiên Bản Mới Cho "${editingWorkflow.name}"` : 'Tạo Mới Quy Trình Phê Duyệt'}
        </div>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isSubmitting}
      okText={editingWorkflow ? 'Tạo Phiên Bản Mới' : 'Tạo Quy Trình'}
      cancelText="Hủy"
      width={720}
      centered
    >
      <div className="py-2">
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên quy trình duyệt"
              rules={[{ required: true, message: 'Vui lòng nhập tên quy trình' }]}
            >
              <Input placeholder="VD: Luồng duyệt mua sắm tài sản lớn" />
            </Form.Item>

            <Form.Item
              name="conditionExpression"
              label="Biểu thức điều kiện áp dụng (Giá trị HĐ)"
              extra="Ví dụ: ContractValue > 50000000 hoặc ContractValue <= 20000000"
            >
              <Input placeholder="ContractValue > 10000000" />
            </Form.Item>
          </div>

          <Form.Item name="isActive" label="Kích hoạt quy trình" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div className="border-t border-slate-200 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-800 text-sm">Các bước xét duyệt tuần tự:</span>
            </div>

            <Form.List name="steps">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div
                      key={key}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3"
                    >
                      <div className="font-bold text-xs px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-md">
                        #{index + 1}
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'approverRole']}
                        rules={[{ required: true, message: 'Chọn vai trò' }]}
                        className="mb-0 flex-1 min-w-[160px]"
                      >
                        <Select
                          options={Object.entries(APPROVER_ROLE_MAP).map(([val, info]) => ({
                            value: Number(val),
                            label: info.label,
                          }))}
                          placeholder="Chọn vai trò người duyệt"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'minimumAmount']}
                        className="mb-0 flex-1 min-w-[140px]"
                      >
                        <InputNumber
                          className="w-full"
                          placeholder="Hạn mức tối thiểu (VNĐ)"
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0)}
                          addonAfter="₫"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'isRequired']}
                        valuePropName="checked"
                        className="mb-0"
                      >
                        <Switch checkedChildren="Bắt buộc" unCheckedChildren="Tùy chọn" />
                      </Form.Item>

                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => remove(name)}
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add({ approverRole: ApproverRole.Manager, minimumAmount: 0, isRequired: true })}
                    block
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Thêm Bước Duyệt
                  </Button>
                </div>
              )}
            </Form.List>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
