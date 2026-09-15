import { apiClient } from '@/api/client';
import type { NotificationDto, NotificationDisplayItem } from '@/types/notification';

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8) : id;
}

function getTitleAndMessage(dto: NotificationDto): { title: string; message: string } {
  const cid = dto.contractId ? shortId(dto.contractId) : null;
  switch (dto.type) {
    case 0:
      return {
        title: 'Yêu cầu phê duyệt',
        message: cid
          ? `Hợp đồng #${cid} đang chờ phê duyệt.`
          : 'Có hợp đồng mới đang chờ phê duyệt.',
      };
    case 1:
      return {
        title: 'Yêu cầu ký số',
        message: cid
          ? `Hợp đồng #${cid} đang chờ chữ ký.`
          : 'Có hợp đồng đang chờ chữ ký.',
      };
    case 2:
      return {
        title: 'Sắp hết hạn',
        message: cid
          ? `Hợp đồng #${cid} sắp hết hạn.`
          : 'Có hợp đồng sắp hết hạn cần xử lý.',
      };
    case 3:
    default:
      return {
        title: 'Thông báo hệ thống',
        message: 'Bạn có thông báo hệ thống mới.',
      };
  }
}

function mapType(dto: NotificationDto): NotificationDisplayItem['type'] {
  switch (dto.type) {
    case 0:
      return 'approval_required';
    case 1:
      return 'digitally_signed';
    case 2:
      return 'expiring_soon';
    case 3:
      return 'system';
    default:
      return 'system';
  }
}

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Vừa xong';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Hôm qua';
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function mapNotificationDtoToDisplay(dto: NotificationDto): NotificationDisplayItem {
  const { title, message } = getTitleAndMessage(dto);
  return {
    id: dto.id,
    title,
    message,
    type: mapType(dto),
    createdAt: formatCreatedAt(dto.createdAt),
    isRead: dto.isRead,
    contractId: dto.contractId,
  };
}

export function getNotifications(isRead?: boolean): Promise<NotificationDto[]> {
  const query = isRead !== undefined ? `?isRead=${isRead}` : '';
  return apiClient.get<NotificationDto[]>(`/api/notifications${query}`);
}

export function getUnreadCount(): Promise<number> {
  return apiClient.get<number>('/api/notifications/unread-count');
}

export function getUnread(): Promise<NotificationDto[]> {
  return apiClient.get<NotificationDto[]>('/api/notifications/unread');
}

export function markNotificationsRead(notificationIds: string[]): Promise<number> {
  return apiClient.patch<number>('/api/notifications/mark-read', { notificationIds });
}

export function markAllNotificationsRead(): Promise<number> {
  return apiClient.patch<number>('/api/notifications/mark-all-read');
}
