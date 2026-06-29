/**
 * @swagger
 * tags:
 *   name: User
 *   description: API cho User
 */

import express from 'express';
import { userController } from '../../../controllers/v1/client/user.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { updateProfileSchema } from '../../../validations/user.validation';

const router = express.Router();

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [User]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Lấy thông tin profile.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', auth, userController.getCurrentProfile);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/dashboard
 * # path: {basePath}/dashboard:
 * #   get:
 * #     summary: API GET /dashboard
 * #     tags: [User]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/user/dashboard:
 *   get:
 *     summary: Lấy dữ liệu thống kê tổng quan.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/dashboard', auth, userController.getDashboardData);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/me
 * # path: {basePath}/me:
 * #   put:
 * #     summary: API PUT /me
 * #     tags: [User]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/user/me:
 *   put:
 *     summary: Cập nhật thông tin cá nhân.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/me', auth, validate(updateProfileSchema), userController.updateProfile);

export default router;
