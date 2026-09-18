import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  useDashboardSummary,
  useDashboardByStatus,
  useDashboardByDepartment,
  useDashboardByPartner,
  useDashboardByTime,
} from './hooks/useDashboard';

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '--';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '--';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const STATUS_COLORS: Record<string, string> = {
  Draft: '#94a3b8',
  PendingApproval: '#f59e0b',
  Approved: '#3b82f6',
  Signed: '#8b5cf6',
  Active: '#10b981',
  Expiring: '#f97316',
  Renewed: '#06b6d4',
  Terminated: '#ef4444',
};

const PIE_COLORS = ['#94a3b8', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#06b6d4', '#ef4444'];

const KpiSkeleton: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
    <div className="h-3 bg-slate-200 rounded w-24 mb-3" />
    <div className="h-7 bg-slate-200 rounded w-16" />
  </div>
);

const ChartSkeleton: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-40 mb-4" />
    <div className="h-48 bg-slate-100 rounded" />
  </div>
);

const ChartError: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="bg-white border border-rose-200 rounded-xl p-6 text-center">
    <p className="text-sm text-rose-600 mb-3">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
    >
      Thử lại
    </button>
  </div>
);

const ChartEmpty: React.FC<{ message?: string }> = ({ message = 'Chưa có dữ liệu' }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
    {message}
  </div>
);

export const DashboardPage: React.FC = () => {
  const summary = useDashboardSummary();
  const byStatus = useDashboardByStatus();
  const byDepartment = useDashboardByDepartment();
  const byPartner = useDashboardByPartner(10);
  const byTime = useDashboardByTime();

  const kpiError = summary.isError ? (summary.error as Error)?.message || 'Không thể tải dữ liệu tổng quan' : null;

  const hasSummaryData = !!summary.data;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bảng Điều Khiển (Dashboard)</h1>
        <p className="text-xs text-slate-500">Tổng quan chỉ số hợp đồng, cảnh báo hết hạn và báo cáo phân tích</p>
      </div>

      {/* KPI 4 cards */}
      {summary.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      ) : kpiError ? (
        <div className="bg-white border border-rose-200 rounded-xl p-6 text-center">
          <p className="text-sm text-rose-600 mb-3">{kpiError}</p>
          <button
            onClick={() => summary.refetch()}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium">Tổng Hợp Đồng</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {hasSummaryData ? formatNumber(summary.data!.totalContracts) : '--'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Tổng giá trị: {hasSummaryData ? formatCurrency(summary.data!.totalValue) : '--'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium">Giá Trị Hiệu Lực</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {hasSummaryData ? formatCurrency(summary.data!.activeContractsValue) : '--'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {hasSummaryData ? `${formatNumber(summary.data!.activeContractsCount)} hợp đồng đang hiệu lực` : '--'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium">Chờ Phê Duyệt</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {hasSummaryData ? formatNumber(summary.data!.pendingApprovalCount) : '--'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Giá trị: {hasSummaryData ? formatCurrency(summary.data!.pendingApprovalValue) : '--'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium">Sắp Hết Hạn</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {hasSummaryData ? formatNumber(summary.data!.expiringContractsCount) : '--'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Giá trị: {hasSummaryData ? formatCurrency(summary.data!.expiringContractsValue) : '--'}
            </p>
          </div>
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By Status */}
        {byStatus.isLoading ? (
          <ChartSkeleton />
        ) : byStatus.isError ? (
          <ChartError
            message={(byStatus.error as Error)?.message || 'Không thể tải thống kê theo trạng thái'}
            onRetry={() => byStatus.refetch()}
          />
        ) : !byStatus.data || byStatus.data.length === 0 || byStatus.data.every((d) => d.count === 0) ? (
          <ChartEmpty message="Chưa có dữ liệu thống kê theo trạng thái" />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Hợp đồng theo trạng thái</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="statusName" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatNumber(value), name === 'count' ? 'Số lượng' : name]}
                    labelFormatter={(label) => `Trạng thái: ${label}`}
                  />
                  <Bar dataKey="count" name="Số lượng" radius={[4, 4, 0, 0]}>
                    {byStatus.data.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.statusName] || '#64748b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pie as secondary small viz on larger screens */}
            <div className="h-48 mt-2 hidden xl:block">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus.data.filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="statusName"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ statusName, count }) => `${statusName}: ${count}`}
                  >
                    {byStatus.data
                      .filter((d) => d.count > 0)
                      .map((entry, idx) => (
                        <Cell key={entry.status} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* By Department */}
        {byDepartment.isLoading ? (
          <ChartSkeleton />
        ) : byDepartment.isError ? (
          <ChartError
            message={(byDepartment.error as Error)?.message || 'Không thể tải thống kê theo phòng ban'}
            onRetry={() => byDepartment.refetch()}
          />
        ) : !byDepartment.data || byDepartment.data.length === 0 ? (
          <ChartEmpty message="Chưa có dữ liệu thống kê theo phòng ban" />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Hợp đồng theo phòng ban</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDepartment.data} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="departmentName" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Bar dataKey="count" name="Số lượng" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* By Partner top 10 */}
        {byPartner.isLoading ? (
          <ChartSkeleton />
        ) : byPartner.isError ? (
          <ChartError
            message={(byPartner.error as Error)?.message || 'Không thể tải thống kê theo đối tác'}
            onRetry={() => byPartner.refetch()}
          />
        ) : !byPartner.data || byPartner.data.length === 0 ? (
          <ChartEmpty message="Chưa có dữ liệu thống kê theo đối tác" />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Top 10 đối tác (theo giá trị)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byPartner.data} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
                  <YAxis type="category" dataKey="partnerName" tick={{ fontSize: 10 }} width={130} />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'count' ? [formatNumber(value), 'Số lượng'] : [formatCurrency(value), 'Tổng giá trị']
                    }
                  />
                  <Bar dataKey="count" name="Số lượng" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* By Time */}
        {byTime.isLoading ? (
          <ChartSkeleton />
        ) : byTime.isError ? (
          <ChartError
            message={(byTime.error as Error)?.message || 'Không thể tải thống kê theo thời gian'}
            onRetry={() => byTime.refetch()}
          />
        ) : !byTime.data || byTime.data.length === 0 ? (
          <ChartEmpty message="Chưa có dữ liệu thống kê theo thời gian" />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Hợp đồng theo thời gian (tạo mới)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byTime.data.map((d) => ({
                    ...d,
                    label: `${String(d.month).padStart(2, '0')}/${d.year}`,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'count' ? [formatNumber(value), 'Số lượng'] : [formatCurrency(value), 'Tổng giá trị']
                    }
                  />
                  <Bar dataKey="count" name="Số lượng" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
