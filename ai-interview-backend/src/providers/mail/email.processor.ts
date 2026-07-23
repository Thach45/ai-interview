import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

export interface EmailJobData {
  email: string;
  title: string;
  message: string;
}

@Processor('emailQueue', { concurrency: 50 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<EmailJobData, any, string>): Promise<any> {
    const { email, title, message } = job.data;

    // Gửi email
    const success = await this.mailService.sendNotificationEmail(
      email,
      title,
      message,
    );

    if (!success) {
      throw new Error(`Gửi email thất bại cho ${email}`); // Ném lỗi để BullMQ retry
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
