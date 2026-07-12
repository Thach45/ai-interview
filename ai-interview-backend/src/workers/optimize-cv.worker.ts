import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { cvOptimizationService } from '../services/client/cv-optimization.service';
import { notificationService } from '../services/client/notification.service';
import { NotificationType } from '@prisma/client';

export const optimizeCvWorker = new Worker<any>(
  'optimizeCvQueue',
  async (job: Job) => {
    try {
      const { userId, analysisId } = job.data;
      if (!userId || !analysisId) {
        throw new Error('Thiếu userId hoặc analysisId trong payload của Job');
      }

      const result = await cvOptimizationService.optimizeCV(userId, analysisId);

      await notificationService.createNotification(
        userId,
        NotificationType.AI_PROCESS,
        'Tối ưu CV hoàn tất! 🎉',
        'AI đã hoàn thành việc nâng cấp CV của bạn. Nhấn vào để xem ngay!',
        `/jobs/cv-analysis/${analysisId}/optimize`,
      );

      return { success: true, optimizedId: result?.id };
    } catch (error) {
      console.error(`[Optimize CV Worker] Error processing job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5,
  },
);

optimizeCvWorker.on('failed', async (job, err) => {
  console.error(`[Optimize CV Worker] Job ${job?.id} thất bại. Lỗi:`, err);

  if (job?.data?.userId) {
    try {
      await notificationService.createNotification(
        job.data.userId,
        NotificationType.AI_PROCESS,
        'Tối ưu CV thất bại ❌',
        'Hệ thống AI đang quá tải hoặc gặp sự cố. Bạn yên tâm, chúng tôi CHƯA trừ Credit của bạn. Vui lòng thử lại sau ít phút nhé!',
      );
    } catch (notifError) {
      console.error(`[Optimize CV Worker] Lỗi khi gửi thông báo thất bại:`, notifError);
    }
  }
});
