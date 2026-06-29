/**
 * @swagger
 * tags:
 *   name: Cv-template
 *   description: API cho Cv-template
 */

import { Router } from 'express';
import { CvTemplateController } from '../../../controllers/v1/admin/cv-template.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router = Router();

// Tất cả các route này yêu cầu quyền Admin
router.use(auth, authorize('ADMIN'));

/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   get:
 * #     summary: API GET /
 * #     tags: [Cv-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/cv-templates:
 *   get:
 *     summary: Lấy danh sách mẫu CV.
 *     tags: [Cv-template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', CvTemplateController.getTemplates);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   get:
 * #     summary: API GET /:id
 * #     tags: [Cv-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/cv-templates/{id}:
 *   get:
 *     summary: Chi tiết CV Template.
 *     tags: [Cv-template]
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
router.get('/:id', CvTemplateController.getTemplateById);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/
 * # path: {basePath}/:
 * #   post:
 * #     summary: API POST /
 * #     tags: [Cv-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/cv-templates:
 *   post:
 *     summary: Tạo CV Template mới.
 *     tags: [Cv-template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/', CvTemplateController.createTemplate);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   put:
 * #     summary: API PUT /:id
 * #     tags: [Cv-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/cv-templates/{id}:
 *   put:
 *     summary: Cập nhật CV Template.
 *     tags: [Cv-template]
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
router.put('/:id', CvTemplateController.updateTemplate);
/**
 * @swagger
 * # Thêm đường dẫn thực tế thay cho {basePath}/:id
 * # path: {basePath}/:id:
 * #   delete:
 * #     summary: API DELETE /:id
 * #     tags: [Cv-template]
 * #     responses:
 * #       200:
 * #         description: Thành công
 */
/**
 * @swagger
 * /api/v1/admin/cv-templates/{id}:
 *   delete:
 *     summary: Xóa CV Template.
 *     tags: [Cv-template]
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
router.delete('/:id', CvTemplateController.deleteTemplate);

export default router;
