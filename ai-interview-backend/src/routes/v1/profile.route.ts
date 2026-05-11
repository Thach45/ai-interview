import express from 'express';
import { getCurrentProfile, updateProfile } from '../../controllers/v1/profile.controller';
import { auth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updateProfileSchema } from '../../validations/user.validation';

const router = express.Router();

router.get('/', auth, getCurrentProfile);
router.put('/', auth, validate(updateProfileSchema), updateProfile);

export default router;
