import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { interviewAiApi } from "../api/interview-ai.api";
import type { SetupInterviewRequest } from "../types/interview-ai.type";
import { useAuthStore } from "../../../store/authStore";
import { refreshAccessToken } from "../../../shared/services/apiClient";

export const useInterviewAi = () => {
  const queryClient = useQueryClient();

  const setupInterviewMutation = useMutation({
    mutationFn: (data: SetupInterviewRequest) =>
      interviewAiApi.setupInterview(data),
    onSuccess: () => {
      toast.success("Setup interview thành công! 🎉");
    },
    onError: (error: any) => {
      const message = error.message || "Setup interview thất bại";
      toast.error(message);
    },
  });

  return {
    setupInterviewMutation,
  };
};

export const useInterviewSession = (sessionId: string) => {
  return useQuery({
    queryKey: ["interviewSession", sessionId],
    queryFn: async () => {
      const response = await interviewAiApi.getInterviewSession(sessionId);
      return response;
    },
    enabled: !!sessionId,
    staleTime: 0,
  });
};

export const useInterviewMessages = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["interviewMessages", sessionId],
    queryFn: async () => {
      const response = await interviewAiApi.getInterviewMessages(sessionId);
      return response;
    },
    enabled: !!sessionId,
    staleTime: Infinity, // Dữ liệu chỉ stale khi bị invalidate (SSE bắn tín hiệu)
  });
};

export const useInterviewSSE = (
  sessionId: string,
  onStreamUpdate?: (text: string, isFinished?: boolean) => void,
) => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const authRetryAttemptedRef = useRef(false);

  // Lưu callback mới nhất vào ref để không bị trigger useEffect liên tục khi callback thay đổi
  const onStreamUpdateRef = useRef(onStreamUpdate);
  useEffect(() => {
    onStreamUpdateRef.current = onStreamUpdate;
  }, [onStreamUpdate]);

  useEffect(() => {
    if (!sessionId || !token) return;

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

    // Gắn token vào query string để đi qua auth middleware
    const eventSource = new EventSource(
      `${API_URL}/interview-ai/${sessionId}/stream?token=${token}`,
    );

    eventSource.onopen = () => {
      authRetryAttemptedRef.current = false;
    };

    let lastChunkTime = Date.now();

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "SYNC_SESSION") {
          // Bắn sự kiện kết thúc nhưng KHÔNG xóa text để UI tự quyết định (cho TTS Player đọc xong)
          if (onStreamUpdateRef.current)
            onStreamUpdateRef.current(data.text || "", true);
          // Invalidate cache -> React Query tự động trigger fetch data mới!
          queryClient.invalidateQueries({
            queryKey: ["interviewMessages", sessionId],
          });
          queryClient.invalidateQueries({
            queryKey: ["interviewSession", sessionId],
          });
        } else if (data.type === "STREAM_CHUNK") {
          const now = Date.now();
          const delta = now - lastChunkTime;
          lastChunkTime = now;

          // Cập nhật text đang stream

          if (onStreamUpdateRef.current) onStreamUpdateRef.current(data.text);
        }
      } catch (error) {
        console.error("Lỗi parse SSE message:", error);
      }
    };

    eventSource.onerror = async (error) => {
      console.error("Lỗi kết nối SSE:", error);
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
      eventSource.close(); // Dọn dẹp kết nối khi unmount (đóng tab)
    };
  }, [sessionId, token, queryClient]);
};

export const useStartInterview = (sessionId: string) => {
  return useMutation({
    mutationFn: () => interviewAiApi.startInterview(sessionId),
    onError: (error: any) => {
      const message = error.message || "Không thể khởi chạy buổi phỏng vấn";
      toast.error(message);
    },
  });
};

export const useSendChatAudio = (sessionId: string) => {
  return useMutation({
    mutationFn: (audioBlob: Blob) =>
      interviewAiApi.sendChatAudio(sessionId, audioBlob),
    onError: (error: any) => {
      const message = error.message || "Không thể xử lý âm thanh";
      toast.error(message);
    },
  });
};

export const useSubmitInterviewResult = (sessionId: string) => {
  return useMutation({
    mutationFn: () => interviewAiApi.submitInterviewResult(sessionId),
    onError: (error: any) => {
      const message = error.message || "Không thể nộp kết quả phỏng vấn";
      toast.error(message);
    },
  });
};
