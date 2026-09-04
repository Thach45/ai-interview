import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

export type EmailJobData =
  | { type: 'verifyAccountOtp'; email: string; otp: string }
  | { type: 'resetPasswordOtp'; email: string; otp: string }
  | { type: 'notification'; email: string; title: string; message: string }
  | { type: 'bill'; email: string; title: string; message: string };

@Processor('emailQueue', { concurrency: 50 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<EmailJobData, any, string>): Promise<any> {
    const data = job.data;
    let success: boolean;

    switch (data.type) {
      case 'verifyAccountOtp':
        success = await this.mailService.sendVerifyAccountOtp(
          data.email,
          data.otp,
        );
        break;
      case 'resetPasswordOtp':
        success = await this.mailService.sendResetPasswordOtp(
          data.email,
          data.otp,
        );
        break;
      case 'notification':
        success = await this.mailService.sendNotificationEmail(
          data.email,
          data.title,
          data.message,
        );
        break;
      case 'bill':
        success = await this.mailService.sendBillEmail(
          data.email,
          data.title,
          data.message,
        );
        break;
    }

    if (!success) {
      throw new Error(`Gửi email thất bại cho ${data.email}`); // Ném lỗi để BullMQ retry
    }

    return { success: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[Email Worker] Job ${job.id} (Gửi tới ${job.data.email}) hoàn tất`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `[Email Worker] Job ${job?.id} (Gửi tới ${job?.data.email}) thất bại. Lỗi:`,
      error,
    );
  }
}
