import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Tabs,
  Button,
  Spin,
  Alert,
  Empty,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  CheckCircle2,
  XCircle,
  Clock,
  PenTool,
  GitCommit,
  Sliders,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  getPendingApprovals,
  processApprovalDecision,
} from './services/workflowApi';
import {
  ApprovalDecision,
  APPROVER_ROLE_MAP,
  type PendingApprovalItemDto,
} from './types/workflow.types';
import { RejectDecisionModal } from './components/RejectDecisionModal';
import { SignContractModal } from './components/SignContractModal';
import { ApprovalTimelineModal } from './components/ApprovalTimelineModal';

export const ApprovalFlowPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');

  // Modal states
  const [rejectItem, setRejectItem] = useState<PendingApprovalItemDto | null>(null);
  const [signContractData, setSignContractData] = useState<{ id: string; number?: string; title?: string } | null>(null);
  const [timelineContractId, setTimelineContractId] = useState<string | null>(null);

  // Fetch Pending Approvals
  const {
    data: pendingList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => getPendingApprovals(),
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (item: PendingApprovalItemDto) => {
      return processApprovalDecision({
        approvalStepId: item.approvalStepId,
        approverId: item.approverId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        decision: ApprovalDecision.Approved,
        comment: 'Đã phê duyệt đạt yêu cầu.',
      });
    },
    onSuccess: () => {
      message.success('Đã phê duyệt thành công bước xét duyệt!');
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lỗi khi thực hiện phê duyệt.';
      message.error(msg);
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ item, comment }: { item: PendingApprovalItemDto; comment: string }) => {
      return processApprovalDecision({
        approvalStepId: item.approvalStepId,
        approverId: item.approverId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        decision: ApprovalDecision.Rejected,
        comment,
      });
    },
    onSuccess: () => {
      message.success('Đã từ chối bước phê duyệt.');
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lỗi khi từ chối phê duyệt.';
      message.error(msg);
    },
  });

  const handleConfirmReject = async (comment: string) => {
    if (!rejectItem) return;
    await rejectMutation.mutateAsync({ item: rejectItem, comment });
  };

  const pendingCount = pendingList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitCommit className="w-7 h-7 text-indigo-600" />
            Tiến Trình Phê Duyệt & Ký Số
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý hàng đợi xét duyệt hợp đồng đa cấp, tiến trình duyệt và thực hiện ký số điện tử (Người 4 phụ trách).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            Làm mới
          </Button>
          <Link to="/workflows/config">
            <Button type="primary" icon={<Sliders className="w-4 h-4" />}>
              Cấu hình Quy trình
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border-slate-200 shadow-xs hover:border-indigo-200 transition-all">
            <Statistic
              title={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cần duyệt ngay</span>}
              value={pendingCount}
              valueStyle={{ color: pendingCount > 0 ? '#4f46e5' : '#10b981', fontWeight: 700 }}
              prefix={<Clock className="w-5 h-5 mr-1" />}
              suffix="hồ sơ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border-slate-200 shadow-xs hover:border-blue-200 transition-all">
            <Statistic
              title={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phương thức ký số</span>}
              value="Mock / OTP"
              valueStyle={{ color: '#2563eb', fontWeight: 700 }}
              prefix={<PenTool className="w-5 h-5 mr-1" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border-slate-200 shadow-xs hover:border-emerald-200 transition-all">
            <Statistic
              title={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạ tầng xác thực</span>}
              value="Sẵn sàng"
              valueStyle={{ color: '#059669', fontWeight: 700 }}
              prefix={<ShieldCheck className="w-5 h-5 mr-1" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card className="rounded-2xl border-slate-200 shadow-xs">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pending',
              label: (
                <span className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4" />
                  Hàng Đợi Chờ Duyệt
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full font-bold">
                      {pendingCount}
                    </span>
                  )}
                </span>
              ),
              children: (
                <div className="py-2">
                  {isLoading && (
                    <div className="py-16 text-center">
                      <Spin size="large" />
                      <div className="text-slate-400 text-xs mt-3">Đang tải danh sách chờ duyệt...</div>
                    </div>
                  )}

                  {isError && (
                    <Alert
                      type="error"
                      message="Không thể tải danh sách chờ duyệt"
                      description={error instanceof Error ? error.message : 'Lỗi kết nối Backend.'}
                      showIcon
                      action={
                        <Button size="small" onClick={() => refetch()}>
                          Thử lại
                        </Button>
                      }
                    />
                  )}

                  {!isLoading && !isError && pendingList.length === 0 && (
                    <div className="py-12">
                      <Empty
                        description={
                          <div className="text-slate-500">
                            <p className="font-semibold text-slate-700 text-base">Hiện không có hợp đồng nào cần duyệt!</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Khi có hợp đồng được Submit vào luồng phê duyệt, các bước tương ứng với vai trò sẽ hiển thị tại đây.
                            </p>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {!isLoading && !isError && pendingList.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                      {pendingList.map((item) => {
                        const roleInfo = APPROVER_ROLE_MAP[item.approverRole];
                        return (
                          <div
                            key={item.approvalStepId}
                            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
                                  Bước #{item.stepOrder}
                                </span>
                                <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${roleInfo?.badgeClass || ''}`}>
                                  {roleInfo?.label || `Role #${item.approverRole}`}
                                </span>
                                <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-semibold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Chờ xét duyệt
                                </span>
                              </div>

                              <div className="text-xs text-slate-400">
                                Đệ trình lúc: {new Date(item.createdAt).toLocaleString('vi-VN')}
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="text-xs text-slate-400">Quy trình áp dụng:</div>
                                <div className="text-sm font-semibold text-slate-800">
                                  {item.workflowName}
                                </div>
                                <div className="text-xs text-slate-500 font-mono">
                                  Contract ID: {item.contractId}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  icon={<GitCommit className="w-4 h-4 text-slate-500" />}
                                  onClick={() => setTimelineContractId(item.contractId)}
                                >
                                  Tiến trình
                                </Button>

                                <Button
                                  danger
                                  icon={<XCircle className="w-4 h-4" />}
                                  onClick={() => setRejectItem(item)}
                                  loading={rejectMutation.isPending && rejectItem?.approvalStepId === item.approvalStepId}
                                >
                                  Từ Chối
                                </Button>

                                <Button
                                  type="primary"
                                  className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                                  icon={<CheckCircle2 className="w-4 h-4" />}
                                  onClick={() => approveMutation.mutate(item)}
                                  loading={approveMutation.isPending && approveMutation.variables?.approvalStepId === item.approvalStepId}
                                >
                                  Phê Duyệt
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'signature',
              label: (
                <span className="flex items-center gap-2 font-medium">
                  <PenTool className="w-4 h-4" />
                  Ký Số Hợp Đồng
                </span>
              ),
              children: (
                <div className="py-4 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Thao tác Ký số Trực tiếp</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Thực hiện ký điện tử xác nhận cho các bên (Ký Mock một chạm hoặc Ký bảo mật qua mã OTP).
                      </p>
                    </div>
                    <Button
                      type="primary"
                      icon={<PenTool className="w-4 h-4" />}
                      onClick={() =>
                        setSignContractData({
                          id: pendingList[0]?.contractId || '11111111-1111-1111-1111-111111111111',
                          number: 'HD-DEMO-2026',
                          title: 'Hợp đồng mua bán dịch vụ công nghệ',
                        })
                      }
                    >
                      Ký Số Hợp Đồng
                    </Button>
                  </div>

                  <Alert
                    type="info"
                    showIcon
                    message="Quy trình Ký số sau khi hoàn tất Phê duyệt"
                    description="Sau khi hợp đồng trải qua tất cả các bước xét duyệt (Approved), hệ thống chuyển sang giai đoạn Ký số. Khi cả bên Nội bộ và Đối tác hoàn tất ký kết, hệ thống tự động kích hoạt trạng thái Có hiệu lực (Active) cho hợp đồng."
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Modals */}
      {rejectItem && (
        <RejectDecisionModal
          isOpen={!!rejectItem}
          onClose={() => setRejectItem(null)}
          contractNumber={rejectItem.contractNumber}
          stepOrder={rejectItem.stepOrder}
          onConfirm={handleConfirmReject}
          isSubmitting={rejectMutation.isPending}
        />
      )}

      {signContractData && (
        <SignContractModal
          isOpen={!!signContractData}
          onClose={() => setSignContractData(null)}
          contractId={signContractData.id}
          contractNumber={signContractData.number}
          contractTitle={signContractData.title}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
          }}
        />
      )}

      {timelineContractId && (
        <ApprovalTimelineModal
          isOpen={!!timelineContractId}
          onClose={() => setTimelineContractId(null)}
          contractId={timelineContractId}
        />
      )}
    </div>
  );
};
