import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { mailService } from '../shared/services/mail.service';

export interface EmailJobData {
  email: string;
  title: string;
  message: string;
}

export const emailWorker = new Worker<EmailJobData>(
  'emailQueue',
  async (job: Job<EmailJobData>) => {
    const { email, title, message } = job.data;

    // Gửi email
    const success = await mailService.sendNotificationEmail(email, title, message);

    if (!success) {
      throw new Error(`Gửi email thất bại cho ${email}`); // Ném lỗi để BullMQ retry
    }

    return { success: true };
  },
  {
    connection: redisConnection as any,
    concurrency: 50, // Xử lý song song 50 email cùng lúc
  },
);

emailWorker.on('failed', (job, err) => {
  console.error(`[Email Worker] Job ${job?.id} (Gửi tới ${job?.data.email}) thất bại. Lỗi:`, err);
});
