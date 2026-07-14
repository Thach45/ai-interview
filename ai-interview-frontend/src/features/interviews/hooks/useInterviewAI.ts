import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { interviewAiApi } from "../api/interview-ai.api";
import type { SetupInterviewRequest } from "../types/interview-ai.type";

export const useInterviewAi = () => {
  const queryClient = useQueryClient();

  const setupInterviewMutation = useMutation({
    mutationFn: (data: SetupInterviewRequest) =>
      interviewAiApi.setupInterview(data),
    onSuccess: () => {
      toast.success("Setup interview thành công! 🎉");
    },
    onError: (error: any) => {
      const message =
        error.message ||
        "Setup interview thất bại";
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

export const useInterviewSSE = (sessionId: string, onStreamUpdate?: (text: string, isFinished?: boolean) => void) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionId) return;

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    
    // Gắn token vào query string để đi qua auth middleware
    const eventSource = new EventSource(
      `${API_URL}/interview-ai/${sessionId}/stream?token=${token}`
    );

    let lastChunkTime = Date.now();

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "SYNC_SESSION") {
          // Bắn sự kiện kết thúc nhưng KHÔNG xóa text để UI tự quyết định (cho TTS Player đọc xong)
          if (onStreamUpdate) onStreamUpdate(data.text || "", true);
          // Invalidate cache -> React Query tự động trigger fetch data mới!
          queryClient.invalidateQueries({ queryKey: ["interviewMessages", sessionId] });
        } else if (data.type === "STREAM_CHUNK") {
          const now = Date.now();
          const delta = now - lastChunkTime;
          lastChunkTime = now;
          
          // Cập nhật text đang stream
       
          if (onStreamUpdate) onStreamUpdate(data.text);
        }
      } catch (error) {
        console.error("Lỗi parse SSE message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Lỗi kết nối SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Dọn dẹp kết nối khi unmount (đóng tab)
    };
  }, [sessionId, queryClient]);
};

export const useStartInterview = (sessionId: string) => {
  return useMutation({
    mutationFn: () => interviewAiApi.startInterview(sessionId),
    onError: (error: any) => {
      const message =
        error.message ||
        "Không thể khởi chạy buổi phỏng vấn";
      toast.error(message);
    },
  });
};

export const useSendChatMessage = (sessionId: string) => {
  return useMutation({
    mutationFn: (message: string) => interviewAiApi.sendChatMessage(sessionId, message),
    onError: (error: any) => {
      const message =
        error.message ||
        "Không thể gửi tin nhắn";
      toast.error(message);
    },
  });
};

export const useSendChatAudio = (sessionId: string) => {
  return useMutation({
    mutationFn: (audioBlob: Blob) => interviewAiApi.sendChatAudio(sessionId, audioBlob),
    onError: (error: any) => {
      const message =
        error.message ||
        "Không thể xử lý âm thanh";
      toast.error(message);
    },
  });
};

export const useSubmitInterviewResult = (sessionId: string) => {
  return useMutation({
    mutationFn: () => interviewAiApi.submitInterviewResult(sessionId),
    onError: (error: any) => {
      const message =
        error.message ||
        "Không thể nộp kết quả phỏng vấn";
      toast.error(message);
    },
  });
};
