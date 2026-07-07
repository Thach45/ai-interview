import express from 'express';
import { userController } from '../../../controllers/v1/client/user.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { updateProfileSchema } from '../../../validations/user.validation';

const router = express.Router();

router.get('/me', auth, userController.getCurrentProfile);
router.get('/dashboard', auth, userController.getDashboardData);
router.put('/me', auth, validate(updateProfileSchema), userController.updateProfile);

export default router;
