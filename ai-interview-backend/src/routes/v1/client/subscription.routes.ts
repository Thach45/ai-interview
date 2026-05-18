import { Router } from 'express';
import { subscriptionController } from '../../../controllers/v1/client/subscription.controller';
import { auth } from '../../../middlewares/auth.middleware';

const router = Router();

// Route công khai lấy danh sách gói hoạt động
router.get('/packages', subscriptionController.getPackages);

// Route Webhook Sepay (Không cần auth, dùng API Key kiểm tra)
router.post('/webhook/sepay', subscriptionController.handleWebhook);

// Các route cần đăng nhập và xác thực
router.use(auth);

router.post('/purchase', subscriptionController.purchasePackage);
router.get('/transactions/:id/status', subscriptionController.getTransactionStatus);

export default router;
