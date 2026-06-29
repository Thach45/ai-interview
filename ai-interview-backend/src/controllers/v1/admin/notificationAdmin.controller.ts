import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { notificationAdminService } from '../../../services/admin/notificationAdmin.service';
import { notificationService } from '../../../services/client/notification.service';
import { NotificationType } from '@prisma/client';

export const notificationAdminController = {
  // 1. Lấy danh sách thông báo (phân trang)
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;

    const result = await notificationAdminService.getAllNotifications(
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );

    return sendResponse(res, 200, 'Lấy danh sách thông báo thành công', result);
  }),

  // 2. Tạo thông báo mới (Gửi cho 1 user)
  send: asyncHandler(async (req: Request, res: Response) => {
    const { userId, type, title, message, link } = req.body;

    if (!userId || !type || !title || !message) {
      return sendResponse(res, 400, 'Thiếu thông tin bắt buộc', null);
    }

    const notification = await notificationService.createNotification(
      userId,
      type as NotificationType,
      title,
      message,
      link
    );

    return sendResponse(res, 201, 'Gửi thông báo thành công', notification);
  }),

  // 3. Xóa thông báo
  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, 'Thiếu ID thông báo', null);
    }

    await notificationAdminService.deleteNotification(id);
    
    return sendResponse(res, 200, 'Đã thu hồi thông báo', null);
  }),
};
