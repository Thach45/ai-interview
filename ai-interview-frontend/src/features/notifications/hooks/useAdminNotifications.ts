import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAdminApi, type SendNotificationPayload } from '../api/notificationAdmin.api';
import { toast } from 'sonner';

export const useAdminNotifications = (page: number, limit: number) => {
  const queryClient = useQueryClient();

  // Query để lấy danh sách
  const notificationsQuery = useQuery({
    queryKey: ['admin_notifications', page, limit],
    queryFn: () => notificationAdminApi.getHistory(page, limit),
    staleTime: 5 * 60 * 1000,
  });

  // Mutation để gửi thông báo
  const sendMutation = useMutation({
    mutationFn: (data: SendNotificationPayload) => notificationAdminApi.sendDirect(data),
    onSuccess: () => {
      toast.success('Đã gửi thông báo thành công');
      // Invalidate để tải lại danh sách ngay lập tức
      queryClient.invalidateQueries({ queryKey: ['admin_notifications'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Lỗi khi gửi thông báo');
    },
  });

  // Mutation để xóa thông báo
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationAdminApi.delete(id),
    onSuccess: () => {
      toast.success('Đã thu hồi thông báo');
      queryClient.invalidateQueries({ queryKey: ['admin_notifications'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Lỗi khi thu hồi thông báo');
    },
  });

  return {
    notificationsQuery,
    sendNotification: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    deleteNotification: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
