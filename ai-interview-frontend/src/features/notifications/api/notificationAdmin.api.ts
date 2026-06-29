import apiClient from '../../../shared/services/apiClient';

export interface SendNotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export interface AdminNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const notificationAdminApi = {
  // Lấy lịch sử thông báo
  getHistory: async (page: number = 1, limit: number = 10): Promise<AdminNotificationsResponse> => {
    const response: any = await apiClient.get('/admin/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  // Gửi thông báo
  sendDirect: async (data: SendNotificationPayload) => {
    const response = await apiClient.post<{ success: boolean; data: any }>('/admin/notifications/send', data);
    return response.data;
  },

  // Xóa thông báo
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/notifications/${id}`);
    return response.data;
  }
};
