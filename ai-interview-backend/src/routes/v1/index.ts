import { Router } from 'express';
import authRoute from './auth/auth.route';
import userRoute from './client/user.route';
import analysisCvRoute from './client/analysis-cv.route';
import cvRoute from './client/cv.route';
import jobCategoryRoute from './admin/job-category.route';
import jobTemplateRoute from './admin/job-template.route';

const router: Router = Router();

// Client Routes
router.use('/auth', authRoute);
router.use('/user', userRoute); // Đã đổi từ profile sang user cho đồng bộ
router.use('/cvs', cvRoute);
router.use('/analysis-cv', analysisCvRoute);

// Admin Routes
router.use('/admin/categories', jobCategoryRoute);
router.use('/admin/job-templates', jobTemplateRoute);

export default router;
