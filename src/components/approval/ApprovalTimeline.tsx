import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface ApprovalStep {
  id: string;
  stepOrder: number;
  approverRole: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comment?: string;
}

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  currentUserRole: string;
  onProcessApproval: (stepId: string) => void;
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  steps,
  currentUserRole,
  onProcessApproval,
}) => {
  if (steps.length === 0) {
    return (
      <div className="text-slate-500 text-center py-8">
        Chưa có thông tin phê duyệt
      </div>
    );
  }

  // Sort steps by stepOrder
  const sortedSteps = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);

  // Find the first pending step
  const pendingStep = sortedSteps.find(step => step.status === 'Pending');

  return (
    <div className="space-y-6">
      {sortedSteps.map((step, index) => {
        const isLast = index === sortedSteps.length - 1;
        const isPending = step.status === 'Pending';
        const isApprover = pendingStep &&
          pendingStep.id === step.id &&
          currentUserRole === step.approverRole;

        // Determine icon and color based on status
        let IconComponent: React.ComponentType<{ className?: string; size?: number }> = CheckCircle;
        let bgColor = 'bg-green-100';
        let iconColor = 'text-green-500';

        if (step.status === 'Rejected') {
          IconComponent = XCircle;
          bgColor = 'bg-red-100';
          iconColor = 'text-red-500';
        } else if (step.status === 'Pending') {
          IconComponent = Clock;
          bgColor = 'bg-yellow-100';
          iconColor = 'text-yellow-500';
        }

        return (
          <div key={step.id} className="flex items-start space-x-4">
            {/* Icon */}
            <div className="flex-shrink-0 flex w-10 h-10 items-center justify-center">
              <IconComponent className={`${iconColor} ${bgColor} rounded-full`} size={24} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900">
                  Bước {step.stepOrder}: {step.approverRole}
                </h3>
                {isPending && isApprover && (
                  <button
                    onClick={() => onProcessApproval(step.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Xử lý duyệt
                  </button>
                )}
              </div>
              <p className="text-slate-600">
                {step.comment ?? (step.status === 'Pending' ? 'Đang chờ duyệt' : '')}
              </p>
            </div>
            {/* Connector line (except for last step) */}
            {!isLast && (
              <div className="absolute left-3 top-10 h-0.5 w-0.5 -mt-2.5 bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
};