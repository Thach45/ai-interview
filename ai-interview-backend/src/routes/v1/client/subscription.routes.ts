/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: API cho Subscription
 */

import { Router } from 'express';
import { subscriptionController } from '../../../controllers/v1/client/subscription.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router = Router();

// Route công khai lấy danh sách gói hoạt động
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/packages
 * # path: {basePath}/packages:
 * #   get:
 * #     summary: API GET /packages
 * #     tags: [Subscription]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/subscriptions/packages:
 *   get:
 *     summary: Lấy danh sách các gói cước.
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/packages', subscriptionController.getPackages);

// Các route cần đăng nhập và xác thực
router.use(auth);

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/purchase
 * # path: {basePath}/purchase:
 * #   post:
 * #     summary: API POST /purchase
 * #     tags: [Subscription]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/subscriptions/purchase:
 *   post:
 *     summary: Tạo giao dịch thanh toán.
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/purchase', subscriptionController.purchasePackage);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/transactions/:id/status
 * # path: {basePath}/transactions/:id/status:
 * #   get:
 * #     summary: API GET /transactions/:id/status
 * #     tags: [Subscription]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/subscriptions/transactions/{id}/status:
 *   get:
 *     summary: Kiểm tra trạng thái giao dịch.
 *     tags: [Subscription]
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
router.get('/transactions/:id/status', subscriptionController.getTransactionStatus);

export default router;
