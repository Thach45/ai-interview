import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const notificationQueue = new Queue('notificationQueue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, 25s, 125s
    },
    removeOnComplete: true,
  },
});
