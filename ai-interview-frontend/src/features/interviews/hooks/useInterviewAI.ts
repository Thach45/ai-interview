import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
        error.response?.data?.error ||
        error.response?.data?.message ||
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

export const useStartInterview = (sessionId: string) => {
  return useMutation({
    mutationFn: () => interviewAiApi.startInterview(sessionId),
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
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
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Không thể gửi tin nhắn";
      toast.error(message);
    },
  });
};

export const useSubmitInterviewResult = (sessionId: string) => {
  return useMutation({
    mutationFn: () => interviewAiApi.submitInterviewResult(sessionId),
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Không thể nộp kết quả phỏng vấn";
      toast.error(message);
    },
  });
};
