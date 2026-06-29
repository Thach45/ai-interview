/**
 * @swagger
 * tags:
 *   name: Job-template
 *   description: API cho Job-template
 */

import { Router } from 'express';
import { jobTemplateController } from '../../../controllers/v1/admin/job-template.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

/**
 * Các route cho client xem danh sách và chi tiết JD
 * Yêu cầu đăng nhập nhưng không yêu cầu quyền Admin
 */
/**
 * @swagger
 * /api/v1/job-templates:
 *   get:
 *     summary: Lấy danh sách các mẫu công việc.
 *     tags: [Job-template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', auth, jobTemplateController.getAll);
/**
 * @swagger
 * /api/v1/job-templates/{id}:
 *   get:
 *     summary: Xem chi tiết một Job Template.
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
router.get('/:id', auth, jobTemplateController.getById);

export default router;
