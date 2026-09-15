import React from 'react';
import { Modal, Steps, Spin, Alert, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Clock, GitCommit } from 'lucide-react';
import { getApprovalProgress } from '../services/workflowApi';
import { APPROVER_ROLE_MAP, ApprovalDecision } from '../types/workflow.types';

interface ApprovalTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  contractNumber?: string;
}

export const ApprovalTimelineModal: React.FC<ApprovalTimelineModalProps> = ({
  isOpen,
  onClose,
  contractId,
  contractNumber,
}) => {
  const { data: progress, isLoading, isError } = useQuery({
    queryKey: ['approval-progress', contractId],
    queryFn: () => getApprovalProgress(contractId),
    enabled: isOpen && !!contractId,
  });

  const getStatusTag = (status?: string) => {
    switch (status) {
      case 'Approved':
        return <Tag color="success">Đã Phê Duyệt Toàn Bộ</Tag>;
      case 'Rejected':
        return <Tag color="error">Bị Từ Chối</Tag>;
      default:
        return <Tag color="processing">Đang Chờ Duyệt</Tag>;
    }
  };

  const getStepIcon = (decision: number) => {
    if (decision === ApprovalDecision.Approved) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
    if (decision === ApprovalDecision.Rejected) {
      return <XCircle className="w-5 h-5 text-rose-500" />;
    }
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  const stepsItems = progress?.steps.map((step) => {
    const role = APPROVER_ROLE_MAP[step.approverRole];
    let statusText = 'Đang chờ duyệt';
    let stepStatus: 'finish' | 'process' | 'wait' | 'error' = 'wait';

    if (step.decision === ApprovalDecision.Approved) {
      statusText = `Đã duyệt vào ${step.decidedAt ? new Date(step.decidedAt).toLocaleString('vi-VN') : ''}`;
      stepStatus = 'finish';
    } else if (step.decision === ApprovalDecision.Rejected) {
      statusText = `Từ chối vào ${step.decidedAt ? new Date(step.decidedAt).toLocaleString('vi-VN') : ''}`;
      stepStatus = 'error';
    } else if (progress.currentPendingStepOrder === step.stepOrder) {
      statusText = 'Đang chờ xét duyệt ở bước này';
      stepStatus = 'process';
    }

    return {
      title: (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Bước #{step.stepOrder}</span>
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${role?.badgeClass || ''}`}>
            {role?.label || `Role #${step.approverRole}`}
          </span>
        </div>
      ),
      description: (
        <div className="mt-1 text-xs text-slate-600 space-y-1">
          <div>{statusText}</div>
          {step.comment && (
            <div className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 italic">
              &quot;{step.comment}&quot;
            </div>
          )}
        </div>
      ),
      icon: getStepIcon(step.decision),
      status: stepStatus,
    };
  }) || [];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-base">
            <GitCommit className="w-5 h-5 text-indigo-500" />
            Tiến Trình Phê Duyệt {contractNumber ? `- ${contractNumber}` : ''}
          </div>
          {progress && getStatusTag(progress.overallStatus)}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
    >
      <div className="py-4">
        {isLoading && (
          <div className="py-12 text-center">
            <Spin size="large" />
            <div className="text-slate-400 text-xs mt-3">Đang tải tiến trình phê duyệt...</div>
          </div>
        )}

        {isError && (
          <Alert
            type="warning"
            message="Chưa có tiến trình duyệt"
            description="Hợp đồng này chưa được đệ trình (Submit) vào bất kỳ quy trình duyệt nào."
            showIcon
          />
        )}

        {progress && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4 justify-between text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Quy trình áp dụng:</span>{' '}
                <strong className="text-slate-800">{progress.workflowName} (v{progress.workflowVersion})</strong>
              </div>
              <div>
                <span className="text-slate-400">Tiến độ:</span>{' '}
                <strong className="text-slate-800">
                  {progress.approvedStepsCount} / {progress.totalSteps} bước đã hoàn tất
                </strong>
              </div>
            </div>

            <div className="px-4">
              <Steps direction="vertical" current={progress.currentPendingStepOrder ? progress.currentPendingStepOrder - 1 : 0} items={stepsItems} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
