import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  FileCheck,
  Info,
  FileText,
  ChevronRight,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import {
  getNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
  mapNotificationDtoToDisplay,
} from './api';
import type { NotificationDisplayItem, BackendNotificationType } from '@/types/notification';
import { ApiError } from '@/api/client';

type ReadFilter = 'all' | 'unread' | 'read';
type TypeFilter = 'all' | BackendNotificationType;

const TYPE_LABEL: Record<BackendNotificationType, string> = {
  0: 'Phê duyệt',
  1: 'Ký số',
  2: 'Sắp hết hạn',
  3: 'Hệ thống',
};

const TYPE_FILTER_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 0, label: 'Phê duyệt' },
  { value: 1, label: 'Ký số' },
  { value: 2, label: 'Sắp hết hạn' },
  { value: 3, label: 'Hệ thống' },
];

function getIcon(type: NotificationDisplayItem['type']) {
  switch (type) {
    case 'new_submission':
      return <FileText className="w-4 h-4 text-blue-600" />;
    case 'approval_required':
      return <Clock className="w-4 h-4 text-amber-600" />;
    case 'expiring_soon':
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    case 'digitally_signed':
      return <FileCheck className="w-4 h-4 text-emerald-600" />;
    case 'system':
    default:
      return <Info className="w-4 h-4 text-slate-600" />;
  }
}

function getIconBg(type: NotificationDisplayItem['type']) {
  switch (type) {
    case 'new_submission':
      return 'bg-blue-50 border-blue-100';
    case 'approval_required':
      return 'bg-amber-50 border-amber-100';
    case 'expiring_soon':
      return 'bg-rose-50 border-rose-100';
    case 'digitally_signed':
      return 'bg-emerald-50 border-emerald-100';
    case 'system':
    default:
      return 'bg-slate-100 border-slate-200';
  }
}

function getTypeBadgeClass(rawType: BackendNotificationType) {
  switch (rawType) {
    case 0:
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 1:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 2:
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 3:
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

const SkeletonItem: React.FC = () => (
  <div className="p-4 flex gap-3 animate-pulse">
    <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  </div>
);

export const NotificationListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const { data: dtos, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: 30_000,
  });

  const markOneMutation = useMutation({
    mutationFn: (id: string) => markNotificationsRead([id]),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const displayItems: (NotificationDisplayItem & { rawType: BackendNotificationType })[] = useMemo(() => {
    if (!dtos) return [];
    return dtos.map((dto) => ({
      ...mapNotificationDtoToDisplay(dto),
      rawType: dto.type,
    }));
  }, [dtos]);

  const filtered = useMemo(() => {
    return displayItems.filter((n) => {
      if (readFilter === 'unread' && n.isRead) return false;
      if (readFilter === 'read' && !n.isRead) return false;
      if (typeFilter !== 'all' && n.rawType !== typeFilter) return false;
      return true;
    });
  }, [displayItems, readFilter, typeFilter]);

  const unreadCount = useMemo(() => displayItems.filter((n) => !n.isRead).length, [displayItems]);

  const handleMarkOne = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (markOneMutation.isPending) return;
    markOneMutation.mutate(id);
  };

  const handleMarkAll = () => {
    if (markAllMutation.isPending || unreadCount === 0) return;
    markAllMutation.mutate();
  };

  const handleItemClick = (item: NotificationDisplayItem) => {
    if (!item.isRead) {
      markOneMutation.mutate(item.id);
    }
    if (item.contractId) {
      navigate(`/contracts/${item.contractId}`);
    }
  };

  const isAuthError = isError && error instanceof ApiError && (error.status === 401 || error.status === 403);
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Không tải được thông báo. Vui lòng thử lại.';

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh Sách Thông Báo</h1>
          <p className="text-xs text-slate-500 mt-1">
            Thông báo nhắc việc duyệt hợp đồng, cảnh báo hết hạn và cập nhật hệ thống
            {displayItems.length > 0 && (
              <span className="ml-2 text-slate-400">
                — {displayItems.length} thông báo{unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ''}
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={markAllMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            {markAllMutation.isPending ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start">
          {(['all', 'unread', 'read'] as const).map((v) => {
            const label = v === 'all' ? 'Tất cả' : v === 'unread' ? 'Chưa đọc' : 'Đã đọc';
            const active = readFilter === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setReadFilter(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  active ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
                {v === 'unread' && unreadCount > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600'}`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="notif-type-filter" className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Loại:
          </label>
          <select
            id="notif-type-filter"
            value={String(typeFilter)}
            onChange={(e) => {
              const v = e.target.value;
              setTypeFilter(v === 'all' ? 'all' : (Number(v) as BackendNotificationType));
            }}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-slate-100">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </div>
        ) : isError ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {isAuthError ? 'Phiên đăng nhập hết hạn' : 'Không tải được thông báo'}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto break-words">{errorMessage}</p>
            {isAuthError && (
              <p className="text-xs text-slate-400 mt-1">Vui lòng đăng nhập lại để tiếp tục.</p>
            )}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Thử lại
              </button>
              {isAuthError && (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
              {displayItems.length === 0 ? (
                <Inbox className="w-6 h-6 text-slate-400" />
              ) : (
                <Bell className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {displayItems.length === 0 ? 'Không có thông báo nào' : 'Không có thông báo phù hợp bộ lọc'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {displayItems.length === 0
                ? 'Khi có hợp đồng cần duyệt, ký hoặc sắp hết hạn, thông báo sẽ xuất hiện ở đây.'
                : 'Thử đổi bộ lọc để xem các thông báo khác.'}
            </p>
            {displayItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setReadFilter('all');
                  setTypeFilter('all');
                }}
                className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 flex gap-3 transition-colors group ${!item.isRead ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'bg-white hover:bg-slate-50/80'} ${item.contractId ? 'cursor-pointer' : ''}`}
              >
                {/* Unread dot */}
                <div className="pt-1 shrink-0 w-2 flex justify-center">
                  {!item.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" aria-hidden />}
                </div>

                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${getIconBg(item.type)}`}>
                  {getIcon(item.type)}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${!item.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {item.title}
                    </p>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">{item.message}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeBadgeClass(item.rawType)}`}
                    >
                      {TYPE_LABEL[item.rawType] ?? item.rawType}
                    </span>
                    {!item.isRead && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                        Chưa đọc
                      </span>
                    )}
                    {item.contractId && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:text-blue-700">
                        Hợp đồng #{item.contractId.slice(0, 8)}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 flex flex-col items-end gap-2 self-center">
                  {!item.isRead ? (
                    <button
                      type="button"
                      onClick={(e) => handleMarkOne(item.id, e)}
                      disabled={markOneMutation.isPending}
                      aria-label="Đánh dấu đã đọc"
                      title="Đánh dấu đã đọc"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 rounded-lg text-[11px] font-semibold transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Đã đọc</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 hidden sm:inline">Đã đọc</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer hint */}
      {!isLoading && !isError && filtered.length > 0 && (
        <p className="text-[11px] text-slate-400 text-center">Nhấn vào thông báo để xem hợp đồng liên quan (nếu có).</p>
      )}
    </div>
  );
};
