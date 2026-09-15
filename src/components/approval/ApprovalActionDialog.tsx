import React, { useState } from 'react';

interface ProcessApprovalStepCommand {
  approvalStepId: string;
  approverId: string;
  decision: 'Approved' | 'Rejected' | number;
  comment?: string;
}

interface ApprovalActionDialogProps {
  open: boolean;
  onClose: () => void;
  approvalStepId: string;
  approverId: string;
  onSubmit: (data: ProcessApprovalStepCommand) => Promise<void>;
}

export const ApprovalActionDialog: React.FC<ApprovalActionDialogProps> = ({
  open,
  onClose,
  approvalStepId,
  approverId,
  onSubmit,
}) => {
  const [decision, setDecision] = useState<'Approved' | 'Rejected' | number>('Approved');
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate: if decision is Rejected, comment is required
    if (decision === 'Rejected' && !comment.trim()) {
      setError('Lý do từ chối là bắt buộc khi từ chối');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        approvalStepId,
        approverId,
        decision,
        comment: decision === 'Rejected' ? comment : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-96 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Xử lý duyệt</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-slate-600">Quyết định:</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Approved"
                  checked={decision === 'Approved'}
                  onChange={(e) => setDecision(e.target.value as 'Approved')}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-slate-700">Đồng ý (Approve)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Rejected"
                  checked={decision === 'Rejected'}
                  onChange={(e) => setDecision(e.target.value as 'Rejected')}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-slate-700">Từ chối (Reject)</span>
              </label>
            </div>
          </div>

          {decision === 'Rejected' && (
            <div className="space-y-2">
              <p className="text-slate-600">Lý do từ chối:</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </form>
      </div>
    </div>
  );
};