import { Controller, Get, Patch, Param, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../common/types/jwt.type';
import { NotificationService } from './notification.service';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { Role } from '@prisma/client';

@Controller('notifications')
@HasRole(Role.CANDIDATE, Role.ADMIN)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * GET /notifications -> Danh sach thong bao cua user (phan trang)
   */
  @Get()
  async getNotifications(
    @CurrentUser() user: TokenPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationService.getNotifications(
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  /**
   * GET /notifications/stream -> SSE streaming thong bao realtime
   * Yeu cau token qua query param (vi SSE khong ho tro custom headers)
   */
  @Get('stream')
  @Sse()
  streamNotifications(
    @CurrentUser() user: TokenPayload,
  ): Observable<MessageEvent> {
    const userId = user.id;

    return new Observable<MessageEvent>((subscriber) => {
      const eventName = `notification_${userId}`;

      const listener = (notification: any) => {
        subscriber.next({ data: notification } as MessageEvent);
      };

      this.eventEmitter.on(eventName, listener);

      // Keepalive 30 giay de duy tri ket noi
      const keepAlive = setInterval(() => {
        subscriber.next({ data: null, type: 'keepalive' } as MessageEvent);
      }, 30000);

      // Cleanup khi huy ket noi
      subscriber.add(() => {
        clearInterval(keepAlive);
        this.eventEmitter.off(eventName, listener);
      });
    });
  }

  /**
   * PATCH /notifications/read-all -> Danh dau tat ca da doc
   */
  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: TokenPayload) {
    await this.notificationService.markAllAsRead(user.id);
    return { message: 'Da danh dau doc tat ca' };
  }

  /**
   * PATCH /notifications/:id/read -> Danh dau 1 thong bao da doc
   */
  @Patch(':id/read')
  async markAsRead(@CurrentUser() user: TokenPayload, @Param('id') id: string) {
    await this.notificationService.markAsRead(user.id, id);
    return { message: 'Da danh dau doc' };
  }
}
