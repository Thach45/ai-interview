import express, { Router } from 'express';
import { authController } from '../../controllers/v1/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../../validations/user.validation';

const router: Router = express.Router();
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/register', validate(registerSchema), authController.register);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

export default router;
