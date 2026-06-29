import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';

export class NotificationAdminService {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prisma;
  }

  // Lấy lịch sử thông báo trên toàn hệ thống (kèm thông tin user)
  async getAllNotifications(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prismaClient.notification.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      this.prismaClient.notification.count(),
    ]);

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Thu hồi (xóa) một thông báo
  async deleteNotification(id: string) {
    // Lưu ý: Nếu muốn cẩn thận hơn, có thể thêm logic kiểm tra isRead = true thì không cho xóa
    const notification = await this.prismaClient.notification.delete({
      where: { id },
    });
    return notification;
  }
}

export const notificationAdminService = new NotificationAdminService();
