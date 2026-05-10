import express from 'express';
import { getCurrentProfile, updateProfile, testLogin } from '../../controllers/v1/profile.controller';
import { authMiddleware } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate.middleware';
import { updateProfileSchema } from '../../validations/user.validation';

const router = express.Router();

router.get('/profile', authMiddleware, getCurrentProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);
router.post('/test-login', testLogin);

export default router;
