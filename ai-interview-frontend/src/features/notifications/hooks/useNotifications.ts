import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import type { Notification } from '../type/notification.type';


export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationApi.getNotifications(1, 50);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['notifications'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          unreadCount: Math.max(0, oldData.unreadCount - 1),
          notifications: oldData.notifications.map((n: Notification) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        };
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          unreadCount: 0,
          notifications: oldData.notifications.map((n: Notification) => ({ ...n, isRead: true })),
        };
      });
    },
  });

  useEffect(() => {
    // Chỉ kết nối SSE nếu đã đăng nhập (có token)
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL
    if (!token) return;

    // Sử dụng URL SSE
    const sseUrl = `${API_URL}/notifications/stream`;
    const eventSource = new EventSource(`${sseUrl}?token=${token}`);

    eventSource.onmessage = (event) => {
      if (event.data === ':') return; // Bỏ qua keep-alive ping

      try {
        const newNotification: Notification = JSON.parse(event.data);
        
        queryClient.setQueryData(['notifications'], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            unreadCount: oldData.unreadCount + 1,
            notifications: [newNotification, ...oldData.notifications],
          };
        });
      } catch (err) {
        console.error('Error parsing notification SSE:', err);
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection lost, reconnecting automatically...');
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return {
    ...query,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
