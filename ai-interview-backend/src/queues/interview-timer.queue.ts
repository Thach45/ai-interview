import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const interviewTimerQueue = new Queue('interviewTimerQueue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    removeOnComplete: true, // Xóa job khi hoàn thành thành công để đỡ rác Redis
    removeOnFail: true,
  },
});
