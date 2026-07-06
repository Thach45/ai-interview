import { Router } from 'express';
import { notificationAdminController } from '../../../controllers/v1/admin/notificationAdmin.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { sendNotificationSchema } from '../../../validations/notification.validation';

const router: Router = Router();

// Yêu cầu quyền ADMIN
router.use(auth);
router.use(authorize('ADMIN'));

router.get('/', notificationAdminController.getAll);
router.post('/send', validate(sendNotificationSchema), notificationAdminController.send);
router.delete('/:id', notificationAdminController.delete);

export default router;
