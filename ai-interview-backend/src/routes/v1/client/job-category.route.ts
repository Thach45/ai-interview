/**
 * @swagger
 * tags:
 *   name: Job-category
 *   description: API cho Job-category
 */

import { Router } from 'express';
import { jobCategoryController } from '../../../controllers/v1/admin/job-category.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// ==========================================
// CLIENT ROUTES CHO JOB CATEGORY (Người dùng)
// Yêu cầu đăng nhập nhưng không yêu cầu ADMIN
// ==========================================

// GET /api/v1/categories        → Lấy toàn bộ cây danh mục
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Job-category]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Lấy danh sách danh mục nghề nghiệp.
 *     tags: [Job-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', auth, jobCategoryController.getTree);

// GET /api/v1/categories/flat   → Lấy danh sách phẳng (có hỗ trợ filter)
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/flat
 * # path: {basePath}/flat:
 * #   get:
 * #     summary: API GET /flat
 * #     tags: [Job-category]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/categories/flat:
 *   get:
 *     summary: Lấy danh sách danh mục nghề nghiệp dạng phẳng.
 *     tags: [Job-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/flat', auth, jobCategoryController.getAll);

// GET /api/v1/categories/:id    → Lấy chi tiết 1 danh mục
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   get:
 * #     summary: API GET /:id
 * #     tags: [Job-category]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Xem chi tiết một danh mục nghề nghiệp.
 *     tags: [Job-category]
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
router.get('/:id', auth, jobCategoryController.getById);

export default router;
