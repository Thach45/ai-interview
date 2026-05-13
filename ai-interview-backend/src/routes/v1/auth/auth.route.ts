import express, { Router } from 'express';
import { authController } from '../../../controllers/v1/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../../validations/user.validation';
import { authLimiter, otpLimiter } from '../../../middlewares/rate-limit.middleware';

const router: Router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/register', otpLimiter, validate(registerSchema), authController.register);
router.post('/send-otp', otpLimiter, authController.sendOTP);
router.post('/verify-otp', authLimiter, authController.verifyOtp);
router.post('/resend-otp', otpLimiter, authController.resendOtp);
router.post(
  '/forgot-password',
  otpLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
