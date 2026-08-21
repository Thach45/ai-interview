import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';

type DependencyStatus = 'up' | 'down' | 'not_configured';

type DependencyHealth = {
  status: DependencyStatus;
  responseTimeMs?: number;
};

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    const startedAt = Date.now();
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const hasUnavailableDependency = [database, redis].some(
      (dependency) => dependency.status === 'down',
    );

    return {
      status: hasUnavailableDependency ? 'degraded' : 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      responseTimeMs: Date.now() - startedAt,
      services: {
        api: { status: 'up' as const },
        database,
        redis,
      },
    };
  }

  private async checkDatabase(): Promise<DependencyHealth> {
    const startedAt = Date.now();

    try {
      await this.withTimeout(this.prisma.$runCommandRaw({ ping: 1 }), 2000);
      return { status: 'up', responseTimeMs: Date.now() - startedAt };
    } catch {
      return { status: 'down' };
    }
  }

  private async checkRedis(): Promise<DependencyHealth> {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) return { status: 'not_configured' };

    const client = new Redis(redisUrl, {
      connectTimeout: 2000,
      enableOfflineQueue: false,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
    const startedAt = Date.now();

    try {
      await this.withTimeout(client.connect(), 2000);
      await this.withTimeout(client.ping(), 2000);
      return { status: 'up', responseTimeMs: Date.now() - startedAt };
    } catch {
      return { status: 'down' };
    } finally {
      client.disconnect();
    }
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Health check timed out')),
          timeoutMs,
        );
      }),
    ]);
  }
}
