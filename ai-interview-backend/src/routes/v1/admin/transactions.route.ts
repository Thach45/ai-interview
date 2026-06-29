/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API cho Transactions
 */

import { Router } from 'express';
import { adminTransactionsController } from '../../../controllers/v1/admin/transactions.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router = Router();

// Áp dụng middleware bắt buộc phải đăng nhập và là ADMIN
router.use(auth);
router.use(authorize('ADMIN'));

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Transactions]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/transactions:
 *   get:
 *     summary: Lấy lịch sử giao dịch.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', adminTransactionsController.getTransactions);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/stats
 * # path: {basePath}/stats:
 * #   get:
 * #     summary: API GET /stats
 * #     tags: [Transactions]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/transactions/stats:
 *   get:
 *     summary: Lấy thống kê doanh thu.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/stats', adminTransactionsController.getStats);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/manual
 * # path: {basePath}/manual:
 * #   post:
 * #     summary: API POST /manual
 * #     tags: [Transactions]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/transactions/manual:
 *   post:
 *     summary: Cộng/trừ tiền thủ công.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/manual', adminTransactionsController.createManual);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id/status
 * # path: {basePath}/:id/status:
 * #   patch:
 * #     summary: API PATCH /:id/status
 * #     tags: [Transactions]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/transactions/{id}/status:
 *   patch:
 *     summary: Đổi trạng thái giao dịch.
 *     tags: [Transactions]
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
router.patch('/:id/status', adminTransactionsController.updateStatus);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   delete:
 * #     summary: API DELETE /:id
 * #     tags: [Transactions]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/transactions/{id}:
 *   delete:
 *     summary: Xóa bản ghi giao dịch.
 *     tags: [Transactions]
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
router.delete('/:id', adminTransactionsController.delete);

export default router;
