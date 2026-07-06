import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import prisma from '../config/prisma';
import { NotificationType } from '@prisma/client';
import { notificationService } from '../services/client/notification.service';

export interface BroadcastJobData {
  title: string;
  message: string;
  link?: string;
}

export const notificationWorker = new Worker<BroadcastJobData>(
  'notificationQueue',
  async (job: Job<BroadcastJobData>) => {
    const { title, message, link } = job.data;
    const BATCH_SIZE = 2000;

    // 1. Đọc lại tiến độ cũ nếu Job bị retry
    let lastProcessedId = (job.progress as any)?.lastProcessedId || null;

    console.log(
      `[Worker] Bắt đầu xử lý Broadcast Job ${job.id}. Bắt đầu từ ID: ${lastProcessedId || 'Đầu tiên'}`,
    );

    while (true) {
      // 2. Query user theo batch sử dụng Cursor của Prisma
      const users = await prisma.user.findMany({
        take: BATCH_SIZE,
        ...(lastProcessedId && {
          skip: 1, // Bỏ qua thằng cuối cùng của lần trước
          cursor: { id: lastProcessedId },
        }),
        select: { id: true }, // Chỉ lấy ID cho nhẹ RAM
      });

      if (users.length === 0) {
        console.log(`[Worker] Job ${job.id} hoàn thành thành công!`);
        break; // Hết user, thoát vòng lặp
      }

      // 3. Gọi hàm Service để tạo DB và bắn SSE
      const userIds = users.map((user) => user.id);
      await notificationService.createManyAndBroadcast(
        userIds,
        NotificationType.SYSTEM_UPDATE,
        title,
        message,
        link,
      );

      // 4. Cập nhật tiến độ mới nhất vào BullMQ
      lastProcessedId = users[users.length - 1].id;
      await job.updateProgress({ lastProcessedId });

      console.log(
        `[Worker] Đã xử lý xong batch ${users.length} users. Last ID: ${lastProcessedId}`,
      );
    }

    return { success: true };
  },
  {
    connection: redisConnection as any,
    concurrency: 1, // Chỉ xử lý 1 job đồng thời để tránh khóa DB (Lock)
  },
);

notificationWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} thất bại. Lỗi:`, err);
});
