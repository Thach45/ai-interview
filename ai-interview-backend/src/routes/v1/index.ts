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
import interviewAIRoute from './client/interview-ai.route';
import adminPackagesRoute from './admin/packages.route';
import adminTransactionsRoute from './admin/transactions.route';
import subscriptionRoutes from './client/subscription.routes';
import ttsRoute from './shared/tts.route';
import dashboardAdminRoute from './admin/dashboard.route';

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
router.use('/interview-ai', interviewAIRoute);
router.use('/subscriptions', subscriptionRoutes);

// ==========================
// SHARED ROUTES (Dùng chung)
// ==========================
router.use('/tts', ttsRoute);

// ==========================
// ADMIN ROUTES (Quản trị)
// ==========================
router.use('/admin/categories', adminJobCategoryRoute);
router.use('/admin/job-templates', adminJobTemplateRoute);
router.use('/admin/users', adminUserRoute);
router.use('/admin/packages', adminPackagesRoute);
router.use('/admin/transactions', adminTransactionsRoute);
router.use('/admin/dashboard', dashboardAdminRoute);

export default router;
