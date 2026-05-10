import { Router } from 'express';
import authRoute from './auth.route';
import profileRoute from './profile.route';

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/profile', profileRoute);

export default router;
