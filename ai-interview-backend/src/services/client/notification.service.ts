import { PrismaClient, NotificationType } from '@prisma/client';
import prisma from '../../config/prisma';
import { eventEmitter } from '../../utils/eventEmitter';

export class NotificationService {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prisma;
  }

  // Tạo thông báo mới và bắn event realtime
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
  ) {
    const notification = await this.prismaClient.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });

    // Bắn sự kiện qua SSE để Frontend cập nhật ngay lập tức
    eventEmitter.emit(`new_notification_${userId}`, notification);

    return notification;
  }

  // Lấy danh sách thông báo của user (phân trang)
  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prismaClient.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prismaClient.notification.count({ where: { userId } }),
    ]);

    const unreadCount = await this.prismaClient.notification.count({
      where: { userId, isRead: false },
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

  // Đánh dấu 1 thông báo là đã đọc
  async markAsRead(userId: string, notificationId: string) {
    return this.prismaClient.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  // Đánh dấu tất cả là đã đọc
  async markAllAsRead(userId: string) {
    return this.prismaClient.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationService = new NotificationService();
