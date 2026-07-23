import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/notification.dto';
import { NotificationMode } from './enums/notification.enum';
import { NotificationType } from '@prisma/client';

import { NotificationRepository } from './notification.repository';

@Injectable()
export class AdminNotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  /**
   * Lay lich su thong bao toan he thong (kem thong tin user)
   */
  async getAllNotifications(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationRepository.findMany({
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
      this.notificationRepository.count(),
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

  /**
   * Gui thong bao cho tat ca user hoac ca nhan
   */
  async send(dto: SendNotificationDto) {
    if (dto.mode === NotificationMode.ALL) {
      // Lay tat ca user
      const users = await this.prisma.user.findMany({
        select: { id: true },
      });

      const notifications = users.map((user) => ({
        userId: user.id,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        link: dto.link,
      }));

      return this.notificationService.createManyAndBroadcast(notifications);
    }

    // Gui ca nhan
    if (!dto.userId) {
      throw new Error('userId la bat buoc khi mode la individual');
    }

    return this.notificationService.createNotification(
      dto.userId,
      dto.type,
      dto.title,
      dto.message,
      dto.link,
    );
  }

  /**
   * Xoa (thu hoi) mot thong bao
   */
  async delete(id: string) {
    return this.notificationRepository.delete(id);
  }
}
