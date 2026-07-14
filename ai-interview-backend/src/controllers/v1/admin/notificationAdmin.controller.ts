import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { notificationAdminService } from '../../../services/admin/notificationAdmin.service';
import { notificationService } from '../../../services/client/notification.service';
import { NotificationType } from '@prisma/client';
import { notificationQueue } from '../../../queues/notification.queue';
import { NotificationMode } from '../../../enum/notification.enum';

export const notificationAdminController = {
  // 1. Lấy danh sách thông báo (phân trang)
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    const result = await notificationAdminService.getAllNotifications(
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20,
    );

    return sendResponse(res, 200, 'Lấy danh sách thông báo thành công', result);
  }),

  // 2. Tạo thông báo mới (Cá nhân hoặc Hàng loạt)
  send: asyncHandler(async (req: Request, res: Response) => {
    const { mode, userId, type, title, message, link } = req.body;

    if (mode === NotificationMode.PERSONAL) {
      const notification = await notificationService.createNotification(
        userId,
        type as NotificationType,
        title,
        message,
        link,
      );
      return sendResponse(res, 201, 'Gửi thông báo cá nhân thành công', notification);
    }

    if (mode === NotificationMode.ALL) {
      await notificationQueue.add('broadcast', {
        type,
        title,
        message,
        link,
      });
      return sendResponse(
        res,
        200,
        'Đã đưa yêu cầu gửi thông báo hàng loạt vào hàng đợi (BullMQ)',
        null,
      );
    }
  }),

  // 3. Xóa thông báo
  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, 'Thiếu ID thông báo', null);
    }

    await notificationAdminService.deleteNotification((id as string));

    return sendResponse(res, 200, 'Đã thu hồi thông báo', null);
  }),
};
