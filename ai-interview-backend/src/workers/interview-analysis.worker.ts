import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import prisma from '../config/prisma';
import { eventEmitter } from '../utils/eventEmitter';
import { interviewAiService } from '../services/client/interview-ai.service';
import { notificationService } from '../services/client/notification.service';
import { NotificationType } from '@prisma/client';

export const interviewAnalysisWorker = new Worker<any>(
  'interviewAnalysisQueue',
  async (job: Job) => {
    const { sessionId, userId } = job.data;
    try {
      console.log(`[Analysis Worker] Bắt đầu phân tích AI cho session ${sessionId}...`);

      // Thực hiện gọi AI và lưu kết quả
      await interviewAiService.submitInterviewResult(userId, sessionId);

      console.log(`[Analysis Worker] Phân tích AI hoàn tất cho session ${sessionId}.`);

      // Gửi thông báo hệ thống realtime báo cho user
      try {
        await notificationService.createNotification(
          userId,
          NotificationType.AI_PROCESS,
          'Kết quả phỏng vấn của bạn đã sẵn sàng!',
          'Báo cáo đánh giá chi tiết về kết quả phỏng vấn AI đã được tạo thành công. Nhấn vào đây để xem kết quả.',
          `/interviews/report?sessionId=${sessionId}`,
        );
        console.log(`[Analysis Worker] Đã gửi thông báo thành công cho user ${userId}`);
      } catch (notiError) {
        console.error(`[Analysis Worker] Lỗi khi tạo thông báo cho user:`, notiError);
      }

      // Bắn event thông báo qua SSE để Frontend cập nhật sang COMPLETED
      eventEmitter.emit(`chat_updated_${sessionId}`);
    } catch (error) {
      console.error(`[Analysis Worker] Lỗi khi phân tích AI cho session ${sessionId}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 2, // Giới hạn số job phân tích AI song song để tránh chạm Rate Limit của OpenAI/Gemini
  },
);
