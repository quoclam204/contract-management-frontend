import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApprovalTimeline } from '@/components/approval/ApprovalTimeline';
import { ApprovalActionDialog } from '@/components/approval/ApprovalActionDialog';
import { ApprovalService } from '@/services/approvalService';
import { AIAnalysisWidget } from '@/features/ai-analysis/AIAnalysisWidget';

// Mock current user - in real app, this would come from auth context
const mockCurrentUser = {
  id: 'current-user-id',
  role: 'Trưởng phòng', // Example role
};

// Mock function to fetch approval steps for a contract
// In real app, this would be an API call
const fetchApprovalSteps = async (): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - in real app, this would come from backend
  return [
    {
      id: 'step-1',
      stepOrder: 1,
      approverRole: 'Trưởng phòng',
      status: 'Pending',
      comment: undefined,
    },
    {
      id: 'step-2',
      stepOrder: 2,
      approverRole: 'Phó Giám đốc',
      status: 'Pending',
      comment: undefined,
    },
    {
      id: 'step-3',
      stepOrder: 3,
      approverRole: 'Giám đốc',
      status: 'Upcoming', // We'll treat Upcoming as not yet started
      comment: undefined,
    },
  ];
};

export const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pendingStepId, setPendingStepId] = useState<string>('');

  // Fetch approval steps when contract id changes
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchApprovalSteps()
      .then((fetchedSteps) => {
        setSteps(fetchedSteps);
        // Find the first pending step that the current user can approve
        const pendingStep = fetchedSteps.find(
          (step) => step.status === 'Pending' && step.approverRole === mockCurrentUser.role
        );
        setPendingStepId(pendingStep ? pendingStep.id : '');
      })
      .catch((err) => {
        console.error('Failed to fetch approval steps:', err);
        setSteps([]); // Clear steps on error
        setPendingStepId('');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleProcessApproval = async (stepId: string) => {
    setPendingStepId(stepId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPendingStepId('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/contracts" className="text-xs text-blue-600 hover:underline">← Quay lại danh sách</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Chi Tiết Hợp Đồng #{id}</h1>
        </div>
      </div>

      {/* Approval Timeline Section */}
      {!loading && steps.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
          Chưa có thông tin phê duyệt cho hợp đồng này
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quy trình phê duyệt</h2>
          <ApprovalTimeline
            steps={steps}
            currentUserRole={mockCurrentUser.role}
            onProcessApproval={handleProcessApproval}
          />
        </div>
      )}

      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
          Đang tải thông tin phê duyệt...
        </div>
      )}

      {/* Approval Action Dialog */}
      <ApprovalActionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        approvalStepId={pendingStepId}
        approverId={mockCurrentUser.id}
        onSubmit={ApprovalService.processApprovalStep}
      />

      {/* AI Contract Assistant — Người 5 */}
      {id && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Phân tích AI</h2>
          <AIAnalysisWidget contractId={id} />
        </div>
      )}
    </div>
  );
};