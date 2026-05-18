import express, { Router } from 'express';
import { packagesController } from '../../../controllers/v1/admin/packages.controller';
import { auth, authorize } from '../../../middlewares/auth.middleware';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

router.get('/', packagesController.getAll);
router.get('/:id', packagesController.getById);
router.post('/', packagesController.create);
router.patch('/:id', packagesController.update);
router.delete('/:id', packagesController.delete);

export default router;
