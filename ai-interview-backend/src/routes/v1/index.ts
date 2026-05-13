import { Router } from 'express';
import authRoute from './auth/auth.route';
import clientUserRoute from './client/user.route';
import analysisCvRoute from './client/analysis-cv.route';
import cvRoute from './client/cv.route';
import jobTemplateRoute from './client/job-template.route';
import jobCategoryRoute from './client/job-category.route';
import adminJobCategoryRoute from './admin/job-category.route';
import adminJobTemplateRoute from './admin/job-template.route';
import adminUserRoute from './admin/user.route';

const router: Router = Router();

// ==========================
// CLIENT ROUTES (Người dùng)
// ==========================
router.use('/auth', authRoute);
router.use('/user', clientUserRoute);
router.use('/cvs', cvRoute);
router.use('/analysis-cv', analysisCvRoute);
router.use('/job-templates', jobTemplateRoute);
router.use('/categories', jobCategoryRoute);

// ==========================
// ADMIN ROUTES (Quản trị)
// ==========================
router.use('/admin/categories', adminJobCategoryRoute);
router.use('/admin/job-templates', adminJobTemplateRoute);
router.use('/admin/users', adminUserRoute);

export default router;
