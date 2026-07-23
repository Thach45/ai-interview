import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InterviewSessionRepository } from './repositories/interview-session.repository';
import { InterviewAiService } from './interview-ai.service';

@Processor('interviewTimerQueue', { concurrency: 10 })
export class InterviewTimerProcessor extends WorkerHost {
  private readonly logger = new Logger(InterviewTimerProcessor.name);

  constructor(
    private readonly interviewSessionRepository: InterviewSessionRepository,
    private readonly interviewAiService: InterviewAiService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { sessionId, userId } = job.data;
    try {
      const session = await this.interviewSessionRepository.findUnique({
        where: { id: sessionId },
      });

      if (session && session.status === 'IN_PROGRESS') {
        this.logger.log(
          `[Timer Worker] Session ${sessionId} hết giờ. Đang tự động kích hoạt chấm bài...`,
        );

        // 1. Kích hoạt luồng chấm điểm (chuyển sang EVALUATING và push sang Analysis Queue)
        await this.interviewAiService.initiateInterviewEvaluation(
          userId,
          sessionId,
        );
      }
    } catch (error) {
      this.logger.error(
        `[Interview Timer Worker] Lỗi khi xử lý timeout cho session ${sessionId}:`,
        error,
      );
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `[Interview Timer Worker] Job ${job.id} completed successfully`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`[Interview Timer Worker] Job ${job.id} failed:`, error);
  }
}
