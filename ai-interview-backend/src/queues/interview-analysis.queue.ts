import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const interviewAnalysisQueue = new Queue('interviewAnalysisQueue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
