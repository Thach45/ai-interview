import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';

export interface BroadcastJobData {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

@Processor('notificationQueue', { concurrency: 1 })
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);
  private readonly BATCH_SIZE = 2000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<BroadcastJobData, any, string>): Promise<any> {
    const { type, title, message, link } = job.data;

    // 1. Đọc lại tiến độ cũ nếu Job bị retry
    let lastProcessedId = (job.progress as any)?.lastProcessedId || null;

    this.logger.log(
      `[Worker] Bắt đầu xử lý Broadcast Job ${job.id}. Bắt đầu từ ID: ${lastProcessedId || 'Đầu tiên'}`,
    );

    while (true) {
      // 2. Query user theo batch sử dụng Cursor của Prisma
      const users = await this.prisma.user.findMany({
        take: this.BATCH_SIZE,
        ...(lastProcessedId && {
          skip: 1, // Bỏ qua thằng cuối cùng của lần trước
          cursor: { id: lastProcessedId },
        }),
        select: { id: true, email: true }, // Lấy thêm email để gửi mail
      });

      if (users.length === 0) {
        this.logger.log(`[Worker] Job ${job.id} hoàn thành thành công!`);
        break; // Hết user, thoát vòng lặp
      }

      // 3. Goi ham Service de tao DB, ban SSE, va gui Mail (neu type = EMAIL)
      const notificationData = users.map((user) => ({
        userId: user.id,
        type,
        title,
        message,
        link,
      }));
      await this.notificationService.createManyAndBroadcast(notificationData);

      // 4. Cập nhật tiến độ mới nhất vào BullMQ
      lastProcessedId = users[users.length - 1].id;
      await job.updateProgress({ lastProcessedId });

      this.logger.log(
        `[Worker] Đã xử lý xong batch ${users.length} users. Last ID: ${lastProcessedId}`,
      );
    }

    return { success: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[Notification Worker] Job ${job.id} completed successfully`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`[Worker] Job ${job?.id} thất bại. Lỗi:`, error);
  }
}
