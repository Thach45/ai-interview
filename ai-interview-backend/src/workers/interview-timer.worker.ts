import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import prisma from '../config/prisma';
import { eventEmitter } from '../utils/eventEmitter';
import { interviewAiService } from '../services/client/interview-ai.service';

export const interviewTimerWorker = new Worker<any>(
  'interviewTimerQueue',
  async (job: Job) => {
    const { sessionId, userId } = job.data;
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
      });

      if (session && session.status === 'IN_PROGRESS') {
        console.log(
          `[Timer Worker] Session ${sessionId} hết giờ. Đang tự động kích hoạt chấm bài...`,
        );

        // 1. Kích hoạt luồng chấm điểm (chuyển sang EVALUATING và push sang Analysis Queue)
        await interviewAiService.initiateInterviewEvaluation(userId, sessionId);
      }
    } catch (error) {
      console.error(
        `[Interview Timer Worker] Lỗi khi xử lý timeout cho session ${sessionId}:`,
        error,
      );
      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 10, // Vì chỉ là check timeout và xử lý nhẹ nhàng
  },
);
