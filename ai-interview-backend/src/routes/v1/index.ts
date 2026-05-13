import { Router } from 'express';
import authRoute from './auth.route';
import profileRoute from './profile.route';
import jobCategoryRoute from './job-category.route';
import jobTemplateRoute from './job-template.route';
import analysisCvRoute from './analysis-cv.route';

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/admin/categories', jobCategoryRoute);
router.use('/admin/job-templates', jobTemplateRoute);
router.use('/analysis-cv', analysisCvRoute);

export default router;
