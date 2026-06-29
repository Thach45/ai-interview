/**
 * @swagger
 * tags:
 *   name: Job-template
 *   description: API cho Job-template
 */

import { Router } from 'express';
import { jobTemplateController } from '../../../controllers/v1/admin/job-template.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// Tất cả các route admin yêu cầu đăng nhập và quyền ADMIN
router.use(auth, authorize('ADMIN'));

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Job-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/job-templates:
 *   get:
 *     summary: Lấy danh sách Job Templates.
 *     tags: [Job-template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', jobTemplateController.getAll);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   get:
 * #     summary: API GET /:id
 * #     tags: [Job-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/job-templates/{id}:
 *   get:
 *     summary: Xem chi tiết Job Template.
 *     tags: [Job-template]
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
router.get('/:id', jobTemplateController.getById);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   post:
 * #     summary: API POST /
 * #     tags: [Job-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/job-templates:
 *   post:
 *     summary: Thêm mới Job Template.
 *     tags: [Job-template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', jobTemplateController.create);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   put:
 * #     summary: API PUT /:id
 * #     tags: [Job-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/job-templates/{id}:
 *   put:
 *     summary: Cập nhật Job Template.
 *     tags: [Job-template]
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
router.put('/:id', jobTemplateController.update);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   delete:
 * #     summary: API DELETE /:id
 * #     tags: [Job-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/job-templates/{id}:
 *   delete:
 *     summary: Xóa Job Template.
 *     tags: [Job-template]
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
router.delete('/:id', jobTemplateController.delete);

export default router;
