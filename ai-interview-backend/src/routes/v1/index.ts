import { Router } from 'express';
import authRoute from './auth.route';
import jobCategoryRoute from './jobCategory.route';

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/admin/categories', jobCategoryRoute);

export default router;
