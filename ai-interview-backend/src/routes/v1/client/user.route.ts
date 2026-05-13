import express from 'express';
import { userController } from '../../../controllers/v1/client/user.controller';
import { auth } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { updateProfileSchema } from '../../../validations/user.validation';

const router = express.Router();

router.get('/', auth, userController.getCurrentProfile);
router.put('/', auth, validate(updateProfileSchema), userController.updateProfile);

export default router;
