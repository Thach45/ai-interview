/**
 * @swagger
 * tags:
 *   name: Job-category
 *   description: API cho Job-category
 */

import express, { Router } from 'express';
import { jobCategoryController } from '../../../controllers/v1/admin/job-category.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
  createJobCategorySchema,
  updateJobCategorySchema,
} from '../../../validations/job-category.validation';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

// GET /api/v1/admin/categories        → Cây 3 tầng đầy đủ
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
 * /api/v1/admin/categories:
 *   get:
 *     summary: Lấy danh sách danh mục.
 *     tags: [Job-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', jobCategoryController.getTree);

// GET /api/v1/admin/categories/flat   → Flat list, filter ?type=GROUP|INDUSTRY|POSITION
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
 * /api/v1/admin/categories/flat:
 *   get:
 *     summary: Lấy danh sách danh mục (Flat).
 *     tags: [Job-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/flat', jobCategoryController.getAll);

// GET /api/v1/admin/categories/:id    → Chi tiết 1 danh mục
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
 * /api/v1/admin/categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục.
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
router.get('/:id', jobCategoryController.getById);

// POST /api/v1/admin/categories       → Tạo mới
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   post:
 * #     summary: API POST /
 * #     tags: [Job-category]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/categories:
 *   post:
 *     summary: Thêm mới danh mục.
 *     tags: [Job-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', validate(createJobCategorySchema), jobCategoryController.create);

// PUT /api/v1/admin/categories/:id    → Cập nhật tên
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   put:
 * #     summary: API PUT /:id
 * #     tags: [Job-category]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục.
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
router.put('/:id', validate(updateJobCategorySchema), jobCategoryController.update);

// DELETE /api/v1/admin/categories/:id → Xóa (từ chối nếu còn children)
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   delete:
 * #     summary: API DELETE /:id
 * #     tags: [Job-category]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục.
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
router.delete('/:id', jobCategoryController.delete);

export default router;
