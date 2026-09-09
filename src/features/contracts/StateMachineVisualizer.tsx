import React from 'react';
import { ContractStatus } from '@/types/contract';

interface StateMachineVisualizerProps {
  status: ContractStatus;
}

// Người 2: State Machine Visualizer (Draft → PendingApproval → Approved → Signed → Active → Expiring → Renewed/Terminated)
export const StateMachineVisualizer: React.FC<StateMachineVisualizerProps> = ({ status }) => {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
      <span className="font-semibold">Trạng thái hợp đồng:</span> {status}
    </div>
  );
};
