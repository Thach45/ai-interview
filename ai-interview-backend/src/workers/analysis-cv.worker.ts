import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { analysisCVService } from '../services/client/analysis-cv.service';
import { notificationService } from '../services/client/notification.service';
import { NotificationType } from '@prisma/client';

export const analysisCvWorker = new Worker<any>(
  'analysisCvQueue',
  async (job: Job) => {
    try {
      const { userId, cvId, jobTemplateId, externalJobDescription } = job.data;
      let result;
      // Phân tích theo Job Template có sẵn trong hệ thống
      if (jobTemplateId) {
        result = await analysisCVService.analysisCVByJobTemplateId(userId, cvId, jobTemplateId);
      }
      // Phân tích theo JD bên ngoài do user dán vào
      else if (externalJobDescription) {
        result = await analysisCVService.analysisCVByExternalJob(
          userId,
          cvId,
          externalJobDescription,
        );
      } else {
        throw new Error('Thiếu jobTemplateId hoặc externalJobDescription trong payload của Job');
      }

      await notificationService.createNotification(
        userId,
        NotificationType.AI_PROCESS,
        'Phân tích CV hoàn tất! 🎉',
        'AI đã hoàn thành việc đánh giá CV của bạn. Nhấn vào để xem ngay!',
        `/jobs/cv-analysis/${result?.id}`,
      );
      return { success: true, analysisId: result?.id };
    } catch (error) {
      console.error(`[Analysis CV Worker] Error processing job ${job.id}:`, error);
      // Ném lỗi để BullMQ đưa vào danh sách retry (nếu fail quá số lần sẽ chuyển sang failed)
      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 5, // Phân tích AI khá nặng và tốn thời gian, không nên để concurrency quá cao (tránh rate limit API AI)
  },
);

analysisCvWorker.on('failed', async (job, err) => {
  console.error(`[Analysis CV Worker] Job ${job?.id} thất bại. Lỗi:`, err);

  if (job?.data?.userId) {
    try {
      await notificationService.createNotification(
        job.data.userId,
        NotificationType.AI_PROCESS, // Hoặc SYSTEM_UPDATE tùy bạn chọn
        'Phân tích CV thất bại ❌',
        'Hệ thống AI đang quá tải hoặc gặp sự cố. Bạn yên tâm, chúng tôi CHƯA trừ Credit của bạn. Vui lòng thử lại sau ít phút nhé! Chi tiết lỗi: ' +
          (err?.message || String(err)),
      );
    } catch (notifError) {
      console.error(`[Analysis CV Worker] Lỗi khi gửi thông báo thất bại:`, notifError);
    }
  }
});
