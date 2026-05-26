import { Router } from 'express';
import { adminTransactionsController } from '../../../controllers/v1/admin/transactions.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router = Router();

// Áp dụng middleware bắt buộc phải đăng nhập và là ADMIN
router.use(auth);
router.use(authorize('ADMIN'));

router.get('/', adminTransactionsController.getTransactions);
router.get('/stats', adminTransactionsController.getStats);
router.post('/manual', adminTransactionsController.createManual);
router.patch('/:id/status', adminTransactionsController.updateStatus);
router.delete('/:id', adminTransactionsController.delete);

export default router;
