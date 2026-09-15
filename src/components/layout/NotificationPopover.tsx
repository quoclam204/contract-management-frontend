import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Check,
  CheckCheck,
  FileText,
  Clock,
  AlertTriangle,
  FileCheck,
  Info,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
  mapNotificationDtoToDisplay,
} from '@/features/notifications/api';
import type { NotificationDisplayItem } from '@/types/notification';

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: dtos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: 30_000,
  });

  const notifications: NotificationDisplayItem[] = useMemo(
    () => (dtos ?? []).map(mapNotificationDtoToDisplay),
    [dtos]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

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

  // Handle click outside & escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const togglePopover = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markOneMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate();
  };

  const handleNotificationClick = (notification: NotificationDisplayItem) => {
    if (!notification.isRead) {
      markOneMutation.mutate(notification.id);
    }

    setIsOpen(false);

    if (notification.contractId) {
      navigate(`/contracts/${notification.contractId}`);
    }
  };

  const getNotificationIcon = (type: NotificationDisplayItem['type']) => {
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
  };

  const getIconBgClass = (type: NotificationDisplayItem['type']) => {
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
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={togglePopover}
        aria-label={`Thông báo, ${unreadCount} chưa đọc`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer',
          isOpen && 'bg-slate-100 text-slate-900'
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Danh sách thông báo"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Popover Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Đang tải thông báo...</div>
            ) : isError ? (
              <div className="p-8 text-center text-xs">
                <p className="font-medium text-rose-600">Không tải được thông báo</p>
                <p className="text-slate-400 mt-1">Vui lòng thử lại sau.</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p className="font-medium text-slate-500">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50/80 group relative',
                    !notification.isRead ? 'bg-blue-50/40' : 'bg-white'
                  )}
                >
                  {/* Unread indicator dot */}
                  {!notification.isRead && (
                    <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'p-2 rounded-lg border shrink-0 mt-0.5',
                      getIconBgClass(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p
                        className={cn(
                          'text-xs leading-snug line-clamp-1',
                          !notification.isRead
                            ? 'font-bold text-slate-900'
                            : 'font-medium text-slate-700'
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        {notification.createdAt}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>

                    {notification.contractId && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-blue-600 group-hover:text-blue-700">
                        <span>Hợp đồng #{notification.contractId.slice(0, 8)}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Mark as read action */}
                  {!notification.isRead && (
                    <button
                      type="button"
                      title="Đánh dấu đã đọc"
                      aria-label="Đánh dấu đã đọc"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shrink-0 self-center border border-transparent hover:border-slate-200"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1 w-full py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors rounded-md hover:bg-slate-100"
            >
              <span>Xem tất cả thông báo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
