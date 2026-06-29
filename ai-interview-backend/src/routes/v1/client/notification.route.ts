/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: API cho Notification
 */

import { Router } from 'express';
import { notificationController } from '../../../controllers/v1/client/notification.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// Tất cả các route notification đều yêu cầu đăng nhập
router.use(auth);

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Notification]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', notificationController.getNotifications);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/stream
 * # path: {basePath}/stream:
 * #   get:
 * #     summary: API GET /stream
 * #     tags: [Notification]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/notifications/stream:
 *   get:
 *     summary: Nhận thông báo realtime (SSE).
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/stream', notificationController.streamNotifications);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/read-all
 * # path: {basePath}/read-all:
 * #   patch:
 * #     summary: API PATCH /read-all
 * #     tags: [Notification]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/notifications/read-all:
 *   patch:
 *     summary: Đánh dấu tất cả đã đọc.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/read-all', notificationController.markAllAsRead);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/read
 * # path: {basePath}/:id/read:
 * #   patch:
 * #     summary: API PATCH /:id/read
 * #     tags: [Notification]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu đã đọc.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/:id/read', notificationController.markAsRead);

export default router;
