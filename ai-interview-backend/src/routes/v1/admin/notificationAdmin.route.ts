/**
 * @swagger
 * tags:
 *   name: NotificationAdmin
 *   description: API cho NotificationAdmin
 */

import { Router } from 'express';
import { notificationAdminController } from '../../../controllers/v1/admin/notificationAdmin.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// Yêu cầu quyền ADMIN
router.use(auth);
router.use(authorize('ADMIN'));

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [NotificationAdmin]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo đã gửi.
 *     tags: [NotificationAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', notificationAdminController.getAll);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/send
 * # path: {basePath}/send:
 * #   post:
 * #     summary: API POST /send
 * #     tags: [NotificationAdmin]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/notifications/send:
 *   post:
 *     summary: Phát thông báo hệ thống.
 *     tags: [NotificationAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/send', notificationAdminController.send);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   delete:
 * #     summary: API DELETE /:id
 * #     tags: [NotificationAdmin]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/notifications/{id}:
 *   delete:
 *     summary: Thu hồi thông báo.
 *     tags: [NotificationAdmin]
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
router.delete('/:id', notificationAdminController.delete);

export default router;
