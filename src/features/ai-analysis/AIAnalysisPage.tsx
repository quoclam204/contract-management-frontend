import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, FileText, Sparkles, RefreshCw, AlertCircle, Search, ChevronRight } from 'lucide-react';
import { useContracts } from '@/hooks/data/useContracts';
import { AIAnalysisWidget } from './AIAnalysisWidget';
import type { Contract } from '@/types/contract';
import { ApiError } from '@/api/client';
import { formatCurrency } from '@/lib/utils';

function getContractLabel(c: Contract): string {
  const num = (c.contractNumber || '').trim();
  const title = (c.title || '').trim();
  if (num && title) return `${num} — ${title}`;
  return num || title || c.id.slice(0, 8);
}

const STATUS_LABEL: Record<string, string> = {
  Draft: 'Nháp',
  PendingApproval: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  Signed: 'Đã ký',
  Active: 'Hiệu lực',
  Expiring: 'Sắp hết hạn',
  Terminated: 'Đã chấm dứt',
  Renewed: 'Đã gia hạn',
};

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABEL[status] ?? status;
  const cls =
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'PendingApproval'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : status === 'Expiring'
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : status === 'Terminated'
            ? 'bg-slate-100 text-slate-600 border-slate-200'
            : 'bg-blue-50 text-blue-700 border-blue-200';
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>{label}</span>;
}

export const AIAnalysisPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [keyword, setKeyword] = useState('');

  const { data: rawData, isLoading, isError, error, refetch, isFetching } = useContracts();

  const contracts: Contract[] = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData as Contract[];
    const maybePaged = rawData as unknown as { items?: Contract[]; data?: Contract[] };
    if (Array.isArray(maybePaged.items)) return maybePaged.items;
    if (Array.isArray(maybePaged.data)) return maybePaged.data;
    return [];
  }, [rawData]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return contracts;
    return contracts.filter((c) => {
      const hay = `${c.contractNumber ?? ''} ${c.title ?? ''} ${c.partnerName ?? ''} ${c.status ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [contracts, keyword]);

  const selectedContract = useMemo(
    () => (selectedId ? contracts.find((c) => c.id === selectedId) ?? null : null),
    [contracts, selectedId]
  );

  const isAuthError = isError && error instanceof ApiError && (error.status === 401 || error.status === 403);

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </span>
          Trợ Lý AI Phân Tích Hợp Đồng
        </h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          AI hỗ trợ <span className="font-semibold text-slate-700">trích xuất thông tin</span> (giá trị, ngày hết hạn) và{' '}
          <span className="font-semibold text-slate-700">tóm tắt nội dung</span> hợp đồng từ tệp PDF/Word đã tải lên. Chọn hợp đồng bên dưới để
          kích hoạt phân tích — backend xử lý nền bằng Hangfire, kết quả hiển thị ngay khi hoàn tất.
        </p>
      </div>

      {/* Contract selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Chọn hợp đồng để phân tích</h2>
          {contracts.length > 0 && (
            <span className="ml-auto text-[11px] text-slate-400">{filtered.length} / {contracts.length} hợp đồng</span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-9 bg-slate-100 rounded-lg" />
            <div className="h-9 bg-slate-100 rounded-lg w-2/3" />
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang tải danh sách hợp đồng...
            </p>
          </div>
        ) : isError ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-sm font-semibold text-rose-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {isAuthError ? 'Phiên đăng nhập hết hạn' : 'Không tải được danh sách hợp đồng'}
            </p>
            <p className="text-xs text-rose-600 mt-1 break-words">
              {error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải dữ liệu.'}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Thử lại
              </button>
              {isAuthError && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        ) : contracts.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Chưa có hợp đồng nào</p>
            <p className="text-xs text-slate-500 mt-1">Tạo hợp đồng và tải tệp PDF/Word trước khi sử dụng AI phân tích.</p>
            <Link
              to="/contracts"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Đến danh sách hợp đồng <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm theo số hợp đồng, tên, đối tác..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full sm:w-[360px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn hợp đồng --</option>
                {filtered.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getContractLabel(c)}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 && (
              <p className="text-xs text-slate-500">Không tìm thấy hợp đồng phù hợp từ khóa "{keyword}".</p>
            )}

            {selectedContract && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{getContractLabel(selectedContract)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {selectedContract.status && <StatusBadge status={selectedContract.status} />}
                    {selectedContract.partnerName && <span>Đối tác: {selectedContract.partnerName}</span>}
                    {typeof selectedContract.value === 'number' && (
                      <span>Giá trị: {formatCurrency(selectedContract.value)}</span>
                    )}
                    {selectedContract.contractType && <span>Loại: {selectedContract.contractType}</span>}
                  </div>
                  {(selectedContract.startDate || selectedContract.endDate) && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {selectedContract.startDate ? `Từ ${selectedContract.startDate}` : ''}
                      {selectedContract.startDate && selectedContract.endDate ? ' — ' : ''}
                      {selectedContract.endDate ? `đến ${selectedContract.endDate}` : ''}
                    </p>
                  )}
                  {selectedContract.attachments && selectedContract.attachments.length > 0 ? (
                    <p className="text-[11px] text-emerald-600 mt-1">
                      {selectedContract.attachments.length} tệp đính kèm
                      {selectedContract.attachments[0]?.fileName ? ` — ${selectedContract.attachments[0].fileName}` : ''}
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-600 mt-1">Chưa có thông tin tệp đính kèm trong dữ liệu hợp đồng hiện có.</p>
                  )}
                </div>
                <Link
                  to={`/contracts/${selectedContract.id}`}
                  className="inline-flex items-center gap-1 shrink-0 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Instruction when no selection */}
      {!selectedId ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Chọn hợp đồng để bắt đầu phân tích AI</p>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            Sau khi chọn, bạn có thể nhấn <span className="font-semibold">Phân tích bằng AI</span> để kích hoạt xử lý nền. Hệ thống sẽ trích xuất
            giá trị, ngày hết hạn và tạo tóm tắt hợp đồng — kết quả hiển thị ngay dưới đây khi hoàn tất.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Kết quả phân tích AI
            <span className="ml-auto text-[11px] font-normal text-slate-400 hidden sm:inline">
              Nguồn: AI Contract Assistant — Extract + Summary (SRS V3 MVP)
            </span>
          </h3>
          <AIAnalysisWidget contractId={selectedId} />
        </div>
      )}
    </div>
  );
};
