import { Router } from 'express';
import { notificationController } from '../../../controllers/v1/client/notification.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router: Router = Router();

// Tất cả các route notification đều yêu cầu đăng nhập
router.use(auth);

router.get('/', notificationController.getNotifications);
router.get('/stream', notificationController.streamNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

export default router;
