import { Router } from 'express';
import authRoute from './auth.route';
import profileRoute from './profile.route';
import jobCategoryRoute from './jobCategory.route';
import jobTemplateRoute from './jobTemplate.route';

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/admin/categories', jobCategoryRoute);
router.use('/admin/job-templates', jobTemplateRoute);

export default router;
