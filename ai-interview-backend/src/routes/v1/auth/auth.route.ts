import express, { Router } from 'express';
import { authController } from '../../../controllers/v1/client/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../../validations/user.validation';
import { authLimiter, otpLimiter } from '../../../middlewares/rate-limit.middleware';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API Quản lý đăng nhập và xác thực người dùng
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về Access Token
 *       400:
 *         description: Thông tin đăng nhập không hợp lệ
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công, xóa cookie chứa refresh token
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Làm mới Access Token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Cấp lại token thành công
 *       401:
 *         description: Refresh token hết hạn hoặc không hợp lệ
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/register', otpLimiter, validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/v1/auth/send-otp:
 *   post:
 *     summary: Gửi OTP qua email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã gửi mã OTP
 */
router.post('/send-otp', otpLimiter, authController.sendOTP);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Xác thực mã OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác thực thành công
 */
router.post('/verify-otp', authLimiter, authController.verifyOtp);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Gửi lại mã OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đã gửi lại mã
 */
router.post('/resend-otp', otpLimiter, authController.resendOtp);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Yêu cầu thành công, kiểm tra email
 */
router.post(
  '/forgot-password',
  otpLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Mật khẩu đã được thay đổi
 */
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
