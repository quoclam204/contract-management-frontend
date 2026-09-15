import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { AlertCircle, Bot, RefreshCw, Sparkles } from 'lucide-react';
import { ApiError } from '@/api/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { parseRiskFlags } from '@/types/ai';
import { useAiAnalysis, useTriggerAiAnalysis } from './hooks/useAiAnalysis';

export const AIAnalysisWidget: React.FC<{ contractId: string }> = ({ contractId }) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useAiAnalysis(contractId);
  const triggerMutation = useTriggerAiAnalysis(contractId);

  const [isPolling, setIsPolling] = useState(false);
  const pollingAttemptsRef = useRef(0);
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    setIsPolling(false);
    pollingAttemptsRef.current = 0;
  };

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  // Stop polling once analysis appears
  useEffect(() => {
    if (isPolling && data) {
      clearPolling();
    }
  }, [data, isPolling]);

  const startPolling = () => {
    clearPolling();
    setIsPolling(true);
    pollingAttemptsRef.current = 0;

    const tick = () => {
      pollingAttemptsRef.current += 1;
      void refetch();
      if (pollingAttemptsRef.current >= 10) {
        clearPolling();
      }
    };

    // First refetch after ~3s, then every ~3s up to 10 attempts
    pollingTimerRef.current = setInterval(tick, 3000);
    // Also trigger an initial delayed refetch so the user sees "Đang xử lý" quickly
    setTimeout(() => {
      if (pollingAttemptsRef.current === 0) {
        pollingAttemptsRef.current += 1;
        void refetch();
      }
    }, 3000);
  };

  const handleTrigger = () => {
    triggerMutation.mutate(undefined, {
      onSuccess: () => {
        message.success('Đã gửi yêu cầu phân tích. Hệ thống đang xử lý...');
        startPolling();
      },
      onError: (err: unknown) => {
        if (err instanceof ApiError && err.status === 403) {
          message.error('Bạn không có quyền phân tích hợp đồng này.');
          return;
        }
        if (err instanceof ApiError) {
          const lower = (err.message || '').toLowerCase();
          if (lower.includes('fileurl') || lower.includes('tệp') || lower.includes('file')) {
            message.error('Chưa có tệp PDF/Word của hợp đồng để phân tích.');
            return;
          }
        }
        const msg = err instanceof Error ? err.message : 'Không thể gửi yêu cầu phân tích.';
        message.error(msg);
      },
    });
  };

  const is404 =
    isError && error instanceof ApiError && (error as ApiError).status === 404;
  const is403 =
    isError && error instanceof ApiError && (error as ApiError).status === 403;

  // A. Loading
  if (isLoading) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex items-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
        <span>Đang tải kết quả phân tích...</span>
      </div>
    );
  }

  // E. 403
  if (is403) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Bạn không có quyền phân tích hợp đồng này.</p>
            <p className="text-xs text-amber-700 mt-1">Vui lòng liên hệ người sở hữu hợp đồng hoặc quản trị viên.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // E. Generic error (non-404)
  if (isError && !is404) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Không thể tải kết quả phân tích.</p>
            <p className="text-xs text-rose-600 mt-1">
              {error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải dữ liệu.'}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={isFetching}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Thử lại
        </Button>
      </div>
    );
  }

  // B. No analysis yet (404) — also covers data === undefined after successful load with no result
  if (is404 || !data) {
    const triggerError = triggerMutation.error as unknown;
    const triggerErrorMsg =
      triggerError instanceof Error ? triggerError.message : null;
    const isMissingFile =
      triggerError instanceof ApiError &&
      (triggerError.message.toLowerCase().includes('fileurl') ||
        triggerError.message.toLowerCase().includes('tệp') ||
        triggerError.message.toLowerCase().includes('file'));

    return (
      <div className="space-y-3">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Bot className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">Chưa có kết quả phân tích cho hợp đồng này</p>
          <p className="text-xs text-slate-500 mt-1">
            Nhấn &quot;Phân tích bằng AI&quot; để trích xuất và tóm tắt nội dung hợp đồng.
          </p>
        </div>

        {isMissingFile && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Chưa có tệp PDF/Word của hợp đồng để phân tích.</span>
          </div>
        )}

        {triggerErrorMsg && !isMissingFile && triggerMutation.isError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{triggerErrorMsg}</span>
          </div>
        )}

        {isPolling && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Đang xử lý... Kết quả sẽ hiển thị khi hoàn tất.</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="ml-auto text-xs font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
            >
              Làm mới
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleTrigger}
            disabled={triggerMutation.isPending || isPolling}
            isLoading={triggerMutation.isPending}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            {triggerMutation.isPending
              ? 'Đang gửi yêu cầu phân tích...'
              : isPolling
                ? 'Đang xử lý...'
                : 'Phân tích bằng AI'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching || triggerMutation.isPending}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Làm mới
          </Button>
        </div>
      </div>
    );
  }

  // D. Analysis result
  const summary = data.summary ?? null;
  const extractedValue = data.extractedValue ?? null;
  const extractedExpiryDate = data.extractedExpiryDate ?? null;
  const riskFlags = parseRiskFlags(data.riskFlags);
  const analyzedAt = data.analyzedAt;

  return (
    <div className="space-y-4">
      {triggerMutation.isSuccess && isPolling && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700 text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Đã gửi yêu cầu phân tích. Hệ thống đang xử lý...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-600 mb-1">Tóm tắt hợp đồng</p>
          {summary ? (
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">Chưa có dữ liệu</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 mb-1">Giá trị hợp đồng</p>
            {extractedValue !== null && extractedValue !== undefined ? (
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(Number(extractedValue))}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Chưa có dữ liệu</p>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 mb-1">Ngày hết hạn</p>
            {extractedExpiryDate ? (
              <p className="text-sm font-medium text-slate-900">{formatDate(extractedExpiryDate)}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-600 mb-1">Phân tích lúc</p>
          {analyzedAt ? (
            <p className="text-sm text-slate-700">{formatDate(analyzedAt)}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">Chưa có dữ liệu</p>
          )}
        </div>

        {riskFlags.length > 0 && (
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-800 mb-2">Cảnh báo</p>
            <ul className="space-y-1.5">
              {riskFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTrigger}
          disabled={triggerMutation.isPending || isPolling}
          isLoading={triggerMutation.isPending}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {triggerMutation.isPending
            ? 'Đang gửi yêu cầu phân tích...'
            : isPolling
              ? 'Đang xử lý...'
              : 'Phân tích lại'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching || triggerMutation.isPending}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Làm mới
        </Button>
        {isPolling && (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Đang xử lý
          </span>
        )}
      </div>
    </div>
  );
};
