/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API cho Dashboard
 */

import express, { Router } from 'express';
import { auth, authorize } from '../../../middlewares/auth.middleware';
import { dashboardAdminController } from '../../../controllers/v1/admin/dashboard.controller';
import { validate } from '../../../middlewares/validate.middleware';

import { getDashboardStatsSchema } from '../../../validations/dashboard-admin.validation';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Dashboard]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Lấy thống kê Admin Dashboard.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', validate(getDashboardStatsSchema), dashboardAdminController.getDashboardAdmin);

export default router;
