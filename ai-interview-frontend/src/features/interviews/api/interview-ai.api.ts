import apiClient from "../../../shared/services/apiClient";
import type { SetupInterviewRequest } from "../types/interview-ai.type";

export const interviewAiApi = {
  /**
   * Thiết lập phiên phỏng vấn thông minh (AI Interview Session)
   */
  setupInterview: async (body: SetupInterviewRequest): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>('/interview-ai/setup', body);
    return response.data;
  },

  /**
   * Lấy thông tin phiên phỏng vấn dựa trên sessionId
   */
  getInterviewSession: async (sessionId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>(`/interview-ai/${sessionId}`);
    return response.data;
  },

  /**
   * Khởi chạy buổi phỏng vấn — nhận câu hỏi đầu tiên từ AI
   */
  startInterview: async (sessionId: string): Promise<any[]> => {
    const response = await apiClient.post<any, { success: boolean; data: any[] }>(`/interview-ai/${sessionId}/start`);
    return response.data;
  },

  /**
   * Gửi tin nhắn của ứng viên và nhận phản hồi AI
   */
  sendChatMessage: async (sessionId: string, message: string): Promise<{
    message: { id: string; role: string; content: string; questionIndex: number | null; isFollowUp: boolean; createdAt: string };
    currentQuestionIndex: number;
    status: string;
  }> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>(`/interview-ai/${sessionId}/chat`, { message });
    return response.data;
  },

  /**
   * Yêu cầu AI nộp và tổng hợp kết quả phỏng vấn
   */
  submitInterviewResult: async (sessionId: string): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>(`/interview-ai/${sessionId}/submit`);
    return response.data;
  },

  /**
   * Lấy báo cáo kết quả phỏng vấn đã được phân tích
   */
  getInterviewResult: async (sessionId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>(`/interview-ai/${sessionId}/result`);
    return response.data;
  }
};
