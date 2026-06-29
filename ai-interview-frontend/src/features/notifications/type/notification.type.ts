export type NotificationType = 'AI_PROCESS' | 'BILLING' | 'REMINDER' | 'SYSTEM_UPDATE';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  unreadCount: number;
}
