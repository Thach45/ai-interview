import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const optimizeCvQueue = new Queue('optimizeCvQueue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
  },
});
