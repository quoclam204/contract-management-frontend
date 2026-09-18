import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from './api/contractApi';
import { StateMachineVisualizer } from './StateMachineVisualizer';
import { ApprovalTimeline } from '@/components/approval/ApprovalTimeline';
import { ApprovalActionDialog } from '@/components/approval/ApprovalActionDialog';
import { ApprovalService } from '@/services/approvalService';
import { AIAnalysisWidget } from '@/features/ai-analysis/AIAnalysisWidget';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  FileText,
  Building2,
  DollarSign,
  Send,
  ShieldCheck,
  RotateCcw,
  Ban,
  Trash2,
  Paperclip,
  ExternalLink,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const mockCurrentUser = {
  id: 'current-user-id',
  role: 'Trưởng phòng',
};

const fetchApprovalSteps = async (): Promise<any[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
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
      status: 'Upcoming',
      comment: undefined,
    },
    {
      id: 'step-3',
      stepOrder: 3,
      approverRole: 'Giám đốc',
      status: 'Upcoming',
      comment: undefined,
    },
  ];
};

export const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [steps, setSteps] = useState<any[]>([]);
  const [loadingSteps, setLoadingSteps] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pendingStepId, setPendingStepId] = useState<string>('');

  // Fetch contract detail
  const {
    data: contract,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => (id ? contractApi.getContractById(id) : Promise.reject('No ID')),
    enabled: !!id,
  });

  // State Machine Mutations
  const submitMutation = useMutation({
    mutationFn: () => contractApi.submitContract(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => contractApi.activateContract(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  const renewMutation = useMutation({
    mutationFn: () => contractApi.renewContract(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  const terminateMutation = useMutation({
    mutationFn: () => contractApi.terminateContract(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => contractApi.deleteContract(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      navigate('/contracts');
    },
  });

  useEffect(() => {
    if (!id) return;
    setLoadingSteps(true);
    fetchApprovalSteps()
      .then((fetchedSteps) => {
        setSteps(fetchedSteps);
        const pendingStep = fetchedSteps.find(
          (s) => s.status === 'Pending' && s.approverRole === mockCurrentUser.role
        );
        setPendingStepId(pendingStep ? pendingStep.id : '');
      })
      .catch(() => {
        setSteps([]);
      })
      .finally(() => {
        setLoadingSteps(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs">
        <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-blue-500" />
        Đang tải thông tin chi tiết hợp đồng...
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="p-12 text-center text-rose-600 text-xs bg-white rounded-2xl border border-rose-200">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900 mb-1">Không tìm thấy hợp đồng</h2>
        <p className="text-slate-500 mb-4">
          {error instanceof Error ? error.message : 'Hợp đồng không tồn tại hoặc đã bị xóa.'}
        </p>
        <Link
          to="/contracts"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isDraft = String(contract.status) === '0' || String(contract.status).toLowerCase() === 'draft';
  const isApproved = String(contract.status) === '2' || String(contract.status).toLowerCase() === 'approved';
  const isSigned = String(contract.status) === '3' || String(contract.status).toLowerCase() === 'signed';
  const isActive = String(contract.status) === '4' || String(contract.status).toLowerCase() === 'active';
  const isExpiring = String(contract.status) === '5' || String(contract.status).toLowerCase() === 'expiring';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/contracts"
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-600 text-sm">
                {contract.contractNumber}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{contract.contractTypeName || 'Hợp đồng'}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">{contract.title}</h1>
          </div>
        </div>

        {/* Action Buttons for State Machine */}
        <div className="flex flex-wrap items-center gap-2">
          {isDraft && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa bản thảo hợp đồng này?')) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
                className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Xóa Bản Nháp
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  if (confirm('Đệ trình hợp đồng này vào tiến trình phê duyệt?')) {
                    submitMutation.mutate();
                  }
                }}
                disabled={submitMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-sm shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                {submitMutation.isPending ? 'Đang gửi...' : 'Đệ Trình Phê Duyệt'}
              </Button>
            </>
          )}

          {(isApproved || isSigned) && (
            <Button
              size="sm"
              onClick={() => {
                if (confirm('Kích hoạt hiệu lực cho hợp đồng này?')) {
                  activateMutation.mutate();
                }
              }}
              disabled={activateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shadow-sm shadow-emerald-500/20"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {activateMutation.isPending ? 'Đang kích hoạt...' : 'Kích Hoạt Hợp Đồng (Active)'}
            </Button>
          )}

          {(isActive || isExpiring) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Xác nhận gia hạn thời gian hợp đồng này?')) {
                    renewMutation.mutate();
                  }
                }}
                disabled={renewMutation.isPending}
                className="text-teal-700 hover:bg-teal-50 border-teal-200 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Gia Hạn (Renew)
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Xác nhận chấm dứt / thanh lý hợp đồng này?')) {
                    terminateMutation.mutate();
                  }
                }}
                disabled={terminateMutation.isPending}
                className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs"
              >
                <Ban className="w-3.5 h-3.5 mr-1" />
                Chấm Dứt (Terminate)
              </Button>
            </>
          )}
        </div>
      </div>

      {/* State Machine Stepper Visualizer */}
      <StateMachineVisualizer status={contract.status} />

      {/* Contract Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Giá trị & Thời gian */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Tài Chính & Thời Hạn
          </h3>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-500">Tổng Giá Trị Hợp Đồng</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {formatCurrency(contract.value)} VNĐ
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Ngày Ký:</span>
              <span className="font-medium text-slate-800">
                {contract.signedDate ? formatDate(contract.signedDate) : 'Chưa ký'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Ngày Hiệu Lực:</span>
              <span className="font-medium text-emerald-700">
                {formatDate(contract.effectiveDate)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Ngày Hết Hạn:</span>
              <span className="font-medium text-rose-700">
                {formatDate(contract.expiryDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Đối tác & Phân loại */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 md:col-span-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            Thông Tin Đối Tác & Văn Bản
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Loại Hợp Đồng</span>
              <span className="font-semibold text-slate-800 text-sm">
                {contract.contractTypeName || 'Hợp đồng tiêu chuẩn'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Mã Đối Tác / Khách Hàng</span>
              <span className="font-mono text-slate-700">
                {contract.partnerId || '—'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Ngày Khởi Tạo</span>
              <span className="text-slate-700">{formatDate(contract.createdAt)}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Tệp Hợp Đồng / Đính Kèm</span>
              {contract.fileUrl ? (
                <a
                  href={contract.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Mở tệp đính kèm
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic">Chưa có tệp đính kèm</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Timeline Section (Người 4) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Tiến Trình Phê Duyệt (Workflow Approval - Người 4)
        </h2>
        {loadingSteps ? (
          <div className="text-center py-6 text-slate-400 text-xs">Đang tải tiến trình phê duyệt...</div>
        ) : steps.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">Chưa có quy trình phê duyệt cho hợp đồng này.</div>
        ) : (
          <ApprovalTimeline
            steps={steps}
            currentUserRole={mockCurrentUser.role}
            onProcessApproval={(stepId) => {
              setPendingStepId(stepId);
              setOpenDialog(true);
            }}
          />
        )}
      </div>

      <ApprovalActionDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setPendingStepId('');
        }}
        approvalStepId={pendingStepId}
        approverId={mockCurrentUser.id}
        onSubmit={ApprovalService.processApprovalStep}
      />

      {/* AI Analysis Widget Section (Người 5) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" />
          Trợ Lý AI Đánh Giá Rủi Ro Hợp Đồng (Người 5)
        </h2>
        <AIAnalysisWidget contractId={id!} />
      </div>
    </div>
  );
};