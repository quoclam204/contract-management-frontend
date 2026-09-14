import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  Switch,
  Card,
  Input,
  Space,
  message,
} from 'antd';
import {
  Plus,
  ArrowLeft,
  Sliders,
  RefreshCw,
  GitBranch,
  Search,
} from 'lucide-react';
import {
  getWorkflows,
  createWorkflow,
  createNewWorkflowVersion,
  toggleWorkflowStatus,
} from './services/workflowApi';
import {
  APPROVER_ROLE_MAP,
  type WorkflowDefinitionDto,
  type CreateWorkflowDefinitionRequest,
} from './types/workflow.types';
import { WorkflowModal } from './components/WorkflowModal';

export const WorkflowConfigPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowDefinitionDto | null>(null);

  // Fetch workflows
  const {
    data: workflows = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['workflows', searchKeyword],
    queryFn: () => getWorkflows(undefined, searchKeyword || undefined),
  });

  // Create workflow mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateWorkflowDefinitionRequest) => createWorkflow(data),
    onSuccess: (newWf) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setIsModalOpen(false);
      message.success(`Đã tạo thành công quy trình: "${newWf.name}"`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tạo quy trình.';
      message.error(msg);
    },
  });

  // Create new version mutation
  const newVersionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateWorkflowDefinitionRequest }) =>
      createNewWorkflowVersion(id, {
        conditionExpression: data.conditionExpression,
        steps: data.steps,
      }),
    onSuccess: (newVer) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setIsModalOpen(false);
      setEditingWorkflow(null);
      message.success(`Đã tạo phiên bản v${newVer.version} cho quy trình "${newVer.name}".`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tạo phiên bản mới.';
      message.error(msg);
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleWorkflowStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      message.success('Đã cập nhật trạng thái quy trình.');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái.';
      message.error(msg);
    },
  });

  const handleFormSubmit = async (values: CreateWorkflowDefinitionRequest) => {
    if (editingWorkflow) {
      await newVersionMutation.mutateAsync({ id: editingWorkflow.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const columns = [
    {
      title: 'Tên Quy Trình',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: WorkflowDefinitionDto) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-800 text-sm">{text}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
              v{record.version}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {record.id.substring(0, 8)}...</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Điều Kiện Áp Dụng',
      dataIndex: 'conditionExpression',
      key: 'conditionExpression',
      render: (expr?: string) => (
        <code className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-mono border border-slate-200">
          {expr || 'Mặc định (Tất cả hợp đồng)'}
        </code>
      ),
    },
    {
      title: 'Các Bước Xét Duyệt',
      dataIndex: 'steps',
      key: 'steps',
      render: (steps: WorkflowDefinitionDto['steps']) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps && steps.length > 0 ? (
            steps
              .sort((a, b) => a.stepOrder - b.stepOrder)
              .map((step) => {
                const role = APPROVER_ROLE_MAP[step.approverRole];
                return (
                  <span
                    key={step.id || step.stepOrder}
                    className={`text-xs px-2 py-0.5 rounded border font-medium ${role?.badgeClass || ''}`}
                    title={`Bước ${step.stepOrder} - Hạn mức tối thiểu: ${step.minimumAmount?.toLocaleString('vi-VN')} ₫`}
                  >
                    #{step.stepOrder} {role?.label?.split(' ')[0] || `Role ${step.approverRole}`}
                  </span>
                );
              })
          ) : (
            <span className="text-slate-400 text-xs">Chưa có bước</span>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: WorkflowDefinitionDto) => (
        <Switch
          checked={isActive}
          onChange={(checked) => toggleMutation.mutate({ id: record.id, isActive: checked })}
          loading={toggleMutation.isPending && toggleMutation.variables?.id === record.id}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm dừng"
        />
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_: any, record: WorkflowDefinitionDto) => (
        <Space size="small">
          <Button
            size="small"
            icon={<GitBranch className="w-3.5 h-3.5" />}
            onClick={() => {
              setEditingWorkflow(record);
              setIsModalOpen(true);
            }}
          >
            Nâng phiên bản
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/workflows" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-7 h-7 text-indigo-600" />
              Cấu Hình Quy Trình Phê Duyệt
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Thiết lập danh mục luồng duyệt, hạn mức tài chính và phân bổ vai trò duyệt (Người 4).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={<RefreshCw className="w-4 h-4" />} onClick={() => refetch()} loading={isLoading}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingWorkflow(null);
              setIsModalOpen(true);
            }}
          >
            Tạo Quy Trình Mới
          </Button>
        </div>
      </div>

      {/* Filter and Table */}
      <Card className="rounded-2xl border-slate-200 shadow-xs">
        <div className="mb-4 max-w-md">
          <Input
            placeholder="Tìm kiếm theo tên quy trình..."
            prefix={<Search className="w-4 h-4 text-slate-400" />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={workflows}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          className="border border-slate-100 rounded-xl overflow-hidden"
        />
      </Card>

      {/* Create / Edit Version Modal */}
      {isModalOpen && (
        <WorkflowModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWorkflow(null);
          }}
          editingWorkflow={editingWorkflow}
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending || newVersionMutation.isPending}
        />
      )}
    </div>
  );
};
