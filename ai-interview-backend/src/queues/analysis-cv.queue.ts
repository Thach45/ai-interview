import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const analysisCvQueue = new Queue('analysisCvQueue', {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, 25s, 125s, 625s, 3125s
    },
    removeOnComplete: true,
  },
});
