import { Router } from 'express';
import { jobTemplateController } from '../../../controllers/v1/admin/job-template.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// Tất cả các route admin yêu cầu đăng nhập và quyền ADMIN
router.use(auth, authorize('ADMIN'));

router.get('/', jobTemplateController.getAll);
router.get('/:id', jobTemplateController.getById);
router.post('/', jobTemplateController.create);
router.put('/:id', jobTemplateController.update);
router.delete('/:id', jobTemplateController.delete);

export default router;
