import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  notificationService,
  NotificationService,
} from '../../../services/client/notification.service';
import { sendResponse } from '../../../utils/apiResponse';
import { eventEmitter } from '../../../utils/eventEmitter';

class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await this.notificationService.getNotifications(req.user!.id, page, limit);
    sendResponse(res, 200, 'Lấy danh sách thông báo thành công', result);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.notificationService.markAsRead(req.user!.id, id);
    sendResponse(res, 200, 'Đã đánh dấu đọc', null);
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    await this.notificationService.markAllAsRead(req.user!.id);
    sendResponse(res, 200, 'Đã đánh dấu đọc tất cả', null);
  });

  streamNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Thiết lập headers bắt buộc cho SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform', // Bắt buộc cho Nginx
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const eventName = `new_notification_${userId}`;

    const sendEvent = (notification: any) => {
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
      (res as any).flush?.();
    };

    // Lắng nghe sự kiện từ service
    eventEmitter.on(eventName, sendEvent);

    // Gửi ping định kỳ để giữ connection mở
    const keepAlive = setInterval(() => {
      res.write(':\n\n');
      (res as any).flush?.();
    }, 30000);

    req.on('close', () => {
      clearInterval(keepAlive);
      eventEmitter.off(eventName, sendEvent);
    });
  });
}

export const notificationController = new NotificationController(notificationService);
