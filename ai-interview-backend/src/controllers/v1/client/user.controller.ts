import { Request, Response } from 'express';
import { userService, UserService } from '../../../services/client/user.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { BadRequestException, UnauthorizedException, NotFoundException } from '../../../exceptions';

/**
 * UserController quản lý toàn bộ logic liên quan đến tài khoản người dùng,
 * bao gồm thông tin cá nhân và quản lý CV.
 */
class UserController {
  constructor(private readonly userService: UserService) {}

  // ==========================
  // PROFILE METHODS
  // ==========================

  /**
   * Lấy thông tin cá nhân hiện tại
   */
  getCurrentProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return sendResponse(res, 200, 'Lấy thông tin cá nhân thành công', user);
  });

  /**
   * Cập nhật thông tin cá nhân
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }

    const { fullName, avatarUrl, password } = req.body;

    // Validation cơ bản
    if (fullName !== undefined && fullName.trim().length === 0) {
      throw new BadRequestException('Họ tên không được để trống');
    }
    if (password && password.length < 8) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự');
    }

    const updated = await this.userService.updateUser(userId, {
      fullName,
      avatarUrl,
      password,
    });

    return sendResponse(res, 200, 'Cập nhật thông tin thành công', updated);
  });

  // ==========================
  // CV METHODS
  // ==========================

  /**
   * Tải CV lên hệ thống
   */
  uploadCv = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }

    const file = req.file;
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file CV (PDF/DOCX)');
    }

    const { title } = req.body;
    const result = await this.userService.uploadCv(userId, file, title);

    return sendResponse(res, 201, 'Tải CV lên thành công', result);
  });

  /**
   * Lấy danh sách CV của người dùng
   */
  getMyCvs = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập');
    }

    const result = await this.userService.getMyCvs(userId);
    return sendResponse(res, 200, 'Lấy danh sách CV thành công', result);
  });
}

// Khởi tạo instance duy nhất
export const userController = new UserController(userService);
