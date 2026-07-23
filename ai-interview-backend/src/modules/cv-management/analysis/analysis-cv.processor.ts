import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { AnalysisCvService } from './analysis-cv.service';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '@prisma/client';

@Processor('analysisCvQueue', { concurrency: 5 })
export class AnalysisCvProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisCvProcessor.name);

  constructor(
    private readonly analysisCvService: AnalysisCvService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      const { userId, cvId, jobTemplateId, externalJobDescription } = job.data;
      let result;

      // Phân tích theo Job Template có sẵn trong hệ thống
      if (jobTemplateId) {
        result = await this.analysisCvService.analysisCVByJobTemplateId(
          userId,
          cvId,
          jobTemplateId,
        );
      }
      // Phân tích theo JD bên ngoài do user dán vào
      else if (externalJobDescription) {
        result = await this.analysisCvService.analysisCVByExternalJob(
          userId,
          cvId,
          externalJobDescription,
        );
      } else {
        throw new Error(
          'Thiếu jobTemplateId hoặc externalJobDescription trong payload của Job',
        );
      }

      await this.notificationService.createNotification(
        userId,
        NotificationType.AI_PROCESS,
        'Phân tích CV hoàn tất! 🎉',
        'AI đã hoàn thành việc đánh giá CV của bạn. Nhấn vào để xem ngay!',
        `/jobs/cv-analysis/${result?.id}`,
      );

      return { success: true, analysisId: result?.id };
    } catch (error) {
      this.logger.error(
        `[Analysis CV Worker] Error processing job ${job.id}:`,
        error,
      );
      // Ném lỗi để BullMQ đưa vào danh sách retry (nếu fail quá số lần sẽ chuyển sang failed)
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[Analysis CV Worker] Job ${job.id} completed successfully`,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    this.logger.error(
      `[Analysis CV Worker] Job ${job?.id} thất bại. Lỗi:`,
      error,
    );

    if (job?.data?.userId) {
      try {
        await this.notificationService.createNotification(
          job.data.userId,
          NotificationType.AI_PROCESS,
          'Phân tích CV thất bại ❌',
          'Hệ thống AI đang quá tải hoặc gặp sự cố. Bạn yên tâm, chúng tôi CHƯA trừ Credit của bạn. Vui lòng thử lại sau ít phút nhé! Chi tiết lỗi: ' +
            (error?.message || String(error)),
        );
      } catch (notifError) {
        this.logger.error(
          `[Analysis CV Worker] Lỗi khi gửi thông báo thất bại:`,
          notifError,
        );
      }
    }
  }
}
