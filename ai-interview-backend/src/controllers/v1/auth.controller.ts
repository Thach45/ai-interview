import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { AuthService, authService } from '../../services/auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/apiResponse';
import { toUserResponseDTO } from '../../mappers/user.mapper';
import { TokenPayload } from '../../types/jwt.type';

dotenv.config();

class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Đăng ký tài khoản mới
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    return sendResponse(res, 201, 'User registered successfully', toUserResponseDTO(user));
  });

  /**
   * Gửi OTP xác thực
   */
  sendOTP = asyncHandler(async (req: Request, res: Response) => {
    const otp = await this.authService.sendOtp(req.body.email);
    return sendResponse(res, 200, 'OTP sent successfully', otp);
  });

  /**
   * Xác thực mã OTP
   */
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.verifyOtp(req.body.email, req.body.otp);
    return sendResponse(res, 200, 'OTP verified successfully');
  });

  /**
   * Gửi lại mã OTP
   */
  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.sendOtp(email);
    return sendResponse(res, 200, 'Mã OTP mới đã được gửi');
  });

  /**
   * Đăng nhập
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.login(req.body);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerifyAt: user.emailVerifiedAt,
      status: user.status,
    } as TokenPayload;

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sendResponse(res, 200, 'User logged in successfully', {
      user: toUserResponseDTO(user),
      accessToken,
      refreshToken,
    });
  });

  /**
   * Làm mới token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    // Logic refresh token sẽ được bổ sung sau
    return sendResponse(res, 200, 'Token refreshed successfully');
  });

  /**
   * Đăng xuất
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sendResponse(res, 200, 'User logged out successfully');
  });

  /**
   * Yêu cầu quên mật khẩu - gửi OTP về email
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body.email);
    return sendResponse(res, 200, 'Mã OTP đã được gửi đến email của bạn');
  });

  /**
   * Đặt lại mật khẩu với mã OTP
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body);
    return sendResponse(res, 200, 'Mật khẩu đã được cập nhật thành công');
  });
}

export const authController = new AuthController(authService);
