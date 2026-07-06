import { z } from 'zod';
import { NotificationType } from '@prisma/client';
import { NotificationMode } from '../enum/notification.enum';

export const sendNotificationSchema = z.object({
  body: z
    .object({
      mode: z.nativeEnum(NotificationMode),
      userId: z.string().optional(),
      type: z.nativeEnum(NotificationType),
      title: z.string().min(1, 'Tiêu đề không được để trống'),
      message: z.string().min(1, 'Nội dung không được để trống'),
      link: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.mode === NotificationMode.PERSONAL && !data.userId) {
          return false;
        }
        return true;
      },
      {
        message: 'userId là bắt buộc khi mode là personal',
        path: ['userId'],
      },
    ),
});
