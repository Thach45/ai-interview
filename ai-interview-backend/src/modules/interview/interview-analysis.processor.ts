import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { InterviewAiService } from './interview-ai.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';

@Processor('interviewAnalysisQueue', { concurrency: 2 })
export class InterviewAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(InterviewAnalysisProcessor.name);

  constructor(
    private readonly interviewAiService: InterviewAiService,
    private readonly notificationService: NotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { sessionId, userId } = job.data;
    try {
      this.logger.log(
        `[Analysis Worker] Bắt đầu phân tích AI cho session ${sessionId}...`,
      );

      // Thực hiện gọi AI và lưu kết quả
      await this.interviewAiService.submitInterviewResult(userId, sessionId);

      this.logger.log(
        `[Analysis Worker] Phân tích AI hoàn tất cho session ${sessionId}.`,
      );

      // Gửi thông báo hệ thống realtime báo cho user
      try {
        await this.notificationService.createNotification(
          userId,
          NotificationType.AI_PROCESS,
          'Kết quả phỏng vấn của bạn đã sẵn sàng!',
          'Báo cáo đánh giá chi tiết về kết quả phỏng vấn AI đã được tạo thành công. Nhấn vào đây để xem kết quả.',
          `/interviews/report?sessionId=${sessionId}`,
        );
        this.logger.log(
          `[Analysis Worker] Đã gửi thông báo thành công cho user ${userId}`,
        );
      } catch (notiError) {
        this.logger.error(
          `[Analysis Worker] Lỗi khi tạo thông báo cho user:`,
          notiError,
        );
      }

      // Bắn event thông báo qua SSE để Frontend cập nhật sang COMPLETED
      this.eventEmitter.emit(`chat_updated_${userId}_${sessionId}`);

      return { success: true, sessionId };
    } catch (error) {
      this.logger.error(
        `[Analysis Worker] Lỗi khi phân tích AI cho session ${sessionId}:`,
        error,
      );
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[Interview Analysis Worker] Job ${job.id} completed successfully`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `[Interview Analysis Worker] Job ${job.id} failed:`,
      error,
    );
  }
}
