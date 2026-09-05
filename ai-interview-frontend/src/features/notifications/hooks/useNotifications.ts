import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";
import type { Notification } from "../type/notification.type";
import { toast } from "sonner";
import { useBackgroundJobStore } from "../../../store/backgroundJobStore";
import { useAuthStore } from "../../../store/authStore";
import { refreshAccessToken } from "../../../shared/services/apiClient";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const authRetryAttemptedRef = useRef(false);

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await notificationApi.getNotifications(1, 50);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          unreadCount: Math.max(0, oldData.unreadCount - 1),
          notifications: oldData.notifications.map((n: Notification) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        };
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          unreadCount: 0,
          notifications: oldData.notifications.map((n: Notification) => ({
            ...n,
            isRead: true,
          })),
        };
      });
    },
  });

  useEffect(() => {
    // Chỉ kết nối SSE nếu đã đăng nhập (có token)
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    if (!token) return;

    // Sử dụng URL SSE
    const sseUrl = `${API_URL}/notifications/stream`;
    const eventSource = new EventSource(`${sseUrl}?token=${token}`);

    eventSource.onopen = () => {
      authRetryAttemptedRef.current = false;
    };

    eventSource.onmessage = (event) => {
      if (event.data === ":") return; // Bỏ qua keep-alive ping

      try {
        const newNotification: Notification = JSON.parse(event.data);

        // --- Logic cập nhật Background Job Widget ---
        if (
          newNotification.type === "AI_PROCESS" ||
          newNotification.title?.includes("Phân tích CV")
        ) {
          const updateJob = useBackgroundJobStore.getState().updateJob;
          const jobs = useBackgroundJobStore.getState().jobs;

          // Tìm job đang chạy gần nhất để cập nhật (vì hệ thống đơn giản chưa map jobId)
          const latestRunningJob = jobs.find((j) => j.status === "processing");
          if (latestRunningJob) {
            if (
              newNotification.title?.includes("thất bại") ||
              newNotification.title?.includes("lỗi")
            ) {
              updateJob(latestRunningJob.id, {
                status: "error",
                errorMessage: newNotification.message,
              });
            } else {
              updateJob(latestRunningJob.id, {
                status: "success",
                resultUrl: newNotification.link,
              });
            }
          }
          // Worker đã xử lý xong (trừ/cộng tiền), nên ta cần ép Header gọi lại API profile ngay lúc này!
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
        // ---------------------------------------------

        queryClient.setQueryData(["notifications"], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            unreadCount: oldData.unreadCount + 1,
            notifications: [newNotification, ...oldData.notifications],
          };
        });

        // Hiển thị toast cho người dùng
        toast(newNotification.title, {
          description: newNotification.message,
          action: newNotification.link
            ? {
                label: "Xem",
                onClick: () => (window.location.href = newNotification.link!),
              }
            : undefined,
        });
      } catch (err) {
        console.error("Error parsing notification SSE:", err);
      }
    };

    eventSource.onerror = async () => {
      if (authRetryAttemptedRef.current) return;

      authRetryAttemptedRef.current = true;
      eventSource.close();

      try {
        await refreshAccessToken();
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient, token]);

  return {
    ...query,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
