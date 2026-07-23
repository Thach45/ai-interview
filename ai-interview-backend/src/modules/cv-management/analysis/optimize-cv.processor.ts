import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { CvOptimizerService } from './cv-optimizer.service';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '@prisma/client';

@Processor('optimizeCvQueue', { concurrency: 5 })
export class OptimizeCvProcessor extends WorkerHost {
  private readonly logger = new Logger(OptimizeCvProcessor.name);

  constructor(
    private readonly cvOptimizerService: CvOptimizerService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      const { userId, analysisId, templateId } = job.data;
      if (!userId || !analysisId) {
        throw new Error('Thiếu userId hoặc analysisId trong payload của Job');
      }

      const result = await this.cvOptimizerService.optimizeCV(
        userId,
        analysisId,
        templateId,
      );

      await this.notificationService.createNotification(
        userId,
        NotificationType.AI_PROCESS,
        'Tối ưu CV hoàn tất! 🎉',
        'AI đã hoàn thành việc nâng cấp CV của bạn. Nhấn vào để xem ngay!',
        `/cv-builder/${result.templateId}?id=${result.id}`,
      );

      return { success: true, optimizedId: result?.id };
    } catch (error) {
      this.logger.error(
        `[Optimize CV Worker] Error processing job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[Optimize CV Worker] Job ${job.id} completed successfully`,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    this.logger.error(
      `[Optimize CV Worker] Job ${job?.id} thất bại. Lỗi:`,
      error,
    );

    if (job?.data?.userId) {
      try {
        await this.notificationService.createNotification(
          job.data.userId,
          NotificationType.AI_PROCESS,
          'Tối ưu CV thất bại ❌',
          'Hệ thống AI đang quá tải hoặc gặp sự cố. Bạn yên tâm, chúng tôi CHƯA trừ Credit của bạn. Vui lòng thử lại sau ít phút nhé! Chi tiết lỗi: ' +
            (error?.message || String(error)),
        );
      } catch (notifError) {
        this.logger.error(
          `[Optimize CV Worker] Lỗi khi gửi thông báo thất bại:`,
          notifError,
        );
      }
    }
  }
}
