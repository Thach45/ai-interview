import { Router } from 'express';
import { notificationAdminController } from '../../../controllers/v1/admin/notificationAdmin.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// Yêu cầu quyền ADMIN
router.use(auth);
router.use(authorize('ADMIN'));

router.get('/', notificationAdminController.getAll);
router.post('/send', notificationAdminController.send);
router.delete('/:id', notificationAdminController.delete);

export default router;
