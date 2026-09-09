import React from 'react';
import { WorkflowStep } from '@/types/workflow';

interface ApprovalTimelineProps {
  steps?: WorkflowStep[];
}

// Người 4: Approval timeline component
export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ steps = [] }) => {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
      Tiến trình duyệt ({steps.length} bước) - Placeholder component
    </div>
  );
};
