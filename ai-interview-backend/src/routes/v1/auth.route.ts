import express, { Router } from 'express';
import * as user from '../../controllers/v1/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../../validations/user.validation';

const router: Router = express.Router();
router.post('/login', validate(loginSchema), user.login);
router.post('/refresh', user.refreshToken);
router.post('/logout', user.logout);
export default router;
