export type BackendNotificationType = 0 | 1 | 2 | 3;

export interface NotificationDto {
  id: string;
  userId: string;
  contractId: string | null;
  type: BackendNotificationType;
  typeName: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationDisplayType =
  | 'new_submission'
  | 'approval_required'
  | 'expiring_soon'
  | 'digitally_signed'
  | 'system';

export interface NotificationDisplayItem {
  id: string;
  title: string;
  message: string;
  type: NotificationDisplayType;
  createdAt: string;
  isRead: boolean;
  contractId: string | null;
}
