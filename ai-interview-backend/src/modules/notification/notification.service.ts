import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationRepository: NotificationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Lay danh sach thong bao cua user (phan trang)
   */
  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationRepository.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.notificationRepository.count({ userId }),
    ]);

    const unreadCount = await this.notificationRepository.count({
      userId,
      isRead: false,
    });

    return {
      notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Danh dau 1 thong bao la da doc
   */
  async markAsRead(userId: string, id: string) {
    return this.notificationRepository.updateMany(
      { id, userId },
      { isRead: true },
    );
  }

  /**
   * Danh dau tat ca thong bao la da doc
   */
  async markAllAsRead(userId: string) {
    return this.notificationRepository.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  /**
   * Tao thong bao moi va phat su kien SSE
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
  ) {
    const notification = await this.notificationRepository.create({
      user: { connect: { id: userId } },
      type,
      title,
      message,
      link,
    });

    // Emit SSE event cho user nhan thong bao
    this.eventEmitter.emit(`notification_${userId}`, notification);

    return notification;
  }

  /**
   * Tao hang loat thong bao va phat SSE cho tung user
   */
  async createManyAndBroadcast(
    notifications: {
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      link?: string;
    }[],
  ) {
    // Tao notification records
    await this.notificationRepository.createMany(
      notifications.map((n) => ({
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
      })),
    );
    // Prisma v5 doesn't support createManyAndReturn, so fetch back
    const created = await this.notificationRepository.findMany({
      where: {
        userId: { in: notifications.map((n) => n.userId) },
        createdAt: { gte: new Date(Date.now() - 60000) },
      },
      orderBy: { createdAt: 'desc' },
      take: notifications.length,
    });

    // Emit SSE cho tung user
    for (const noti of created) {
      this.eventEmitter.emit(`notification_${noti.userId}`, noti);
    }

    return created;
  }
}
