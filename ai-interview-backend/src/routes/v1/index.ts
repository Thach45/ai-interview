import { Router } from 'express';
import authRoute from './auth.route';
import profileRoute from './profile.route';
import jobCategoryRoute from './jobCategory.route';

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/admin/categories', jobCategoryRoute);

export default router;
