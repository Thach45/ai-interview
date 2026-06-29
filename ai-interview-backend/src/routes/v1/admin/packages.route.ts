/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: API cho Packages
 */

import express, { Router } from 'express';
import { packagesController } from '../../../controllers/v1/admin/packages.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Packages]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/packages:
 *   get:
 *     summary: Lấy danh sách gói cước.
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', packagesController.getAll);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   get:
 * #     summary: API GET /:id
 * #     tags: [Packages]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/packages/{id}:
 *   get:
 *     summary: Xem chi tiết gói cước.
 *     tags: [Packages]
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
router.get('/:id', packagesController.getById);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   post:
 * #     summary: API POST /
 * #     tags: [Packages]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/packages:
 *   post:
 *     summary: Tạo gói cước mới.
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', packagesController.create);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   patch:
 * #     summary: API PATCH /:id
 * #     tags: [Packages]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/packages/{id}:
 *   patch:
 *     summary: Cập nhật gói cước.
 *     tags: [Packages]
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
router.patch('/:id', packagesController.update);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   delete:
 * #     summary: API DELETE /:id
 * #     tags: [Packages]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/packages/{id}:
 *   delete:
 *     summary: Xóa gói cước.
 *     tags: [Packages]
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
router.delete('/:id', packagesController.delete);

export default router;
