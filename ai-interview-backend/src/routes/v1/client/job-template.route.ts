import { Router } from 'express';
import { jobTemplateController } from '../../../controllers/v1/admin/job-template.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

/**
 * Các route cho client xem danh sách và chi tiết JD
 * Yêu cầu đăng nhập nhưng không yêu cầu quyền Admin
 */
router.get('/', jobTemplateController.getAll);
router.get('/:id', jobTemplateController.getById);

export default router;
