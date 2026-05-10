import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { AuthService, authService } from '../../services/auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/apiResponse';
import { toUserResponseDTO } from '../../mappers/user.mapper';

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

  sendOTP = asyncHandler(async (req: Request, res: Response) => {
    const otp = await this.authService.sendOtp(req.body.email);
    return sendResponse(res, 200, 'OTP sent successfully', otp);
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.verifyOtp(req.body.email, req.body.otp);
    return sendResponse(res, 200, 'OTP verified successfully');
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
    };

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
    return sendResponse(res, 200, 'Token refreshed successfully');
  });

  /**
   * Đăng xuất
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    // Gọi service nếu cần xử lý nghiệp vụ (như blacklist token, tracking...)
    // await this.authService.logout(req.user?.id);

    // Xóa cookie chứa refreshToken
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sendResponse(res, 200, 'User logged out successfully');
  });
}

// Khởi tạo và tiêm (Inject) instance vào Controller
export const authController = new AuthController(authService);
