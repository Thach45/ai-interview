import express, { Router } from 'express';
import { auth, authorize } from '../../../middlewares/auth.middleware';
import { dashboardAdminController } from '../../../controllers/v1/admin/dashboard.controller';
import { validate } from '../../../middlewares/validate.middleware';

import { getDashboardStatsSchema } from '../../../validations/dashboard-admin.validation';

const router: Router = express.Router();

// Tất cả routes chỉ dành cho ADMIN
router.use(auth, authorize('ADMIN'));

router.get('/', validate(getDashboardStatsSchema), dashboardAdminController.getDashboardAdmin);

export default router;
