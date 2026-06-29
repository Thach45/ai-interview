import apiClient from '../../../shared/services/apiClient';
import type { GetNotificationsResponse } from '../type/notification.type';

export const notificationApi = {
  getNotifications: (page = 1, limit = 20) => 
    apiClient.get<any, { success: boolean; data: GetNotificationsResponse }>(`/client/notifications?page=${page}&limit=${limit}`),

  markAsRead: (id: string) => 
    apiClient.patch<any, { success: boolean }>(`/client/notifications/${id}/read`),

  markAllAsRead: () => 
    apiClient.patch<any, { success: boolean }>('/client/notifications/read-all'),
};
