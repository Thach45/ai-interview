import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException, ForbiddenException } from '../exceptions';

import { TokenPayload as CustomJwtPayload } from '../types/jwt.type';

// Mở rộng interface Request của Express để chứa thông tin user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: any; // Để kiểu any để tránh xung đột với các thư viện khác
    }
  }
}

/**
 * Middleware xác thực người dùng thông qua JWT
 */
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Vui lòng đăng nhập để truy cập');
    }

    const token = authHeader.split(' ')[1];

    // 2. Xác thực token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'secret',
    ) as CustomJwtPayload;

    // 3. Gắn thông tin user vào request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedException('Token đã hết hạn, vui lòng đăng nhập lại'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedException('Token không hợp lệ'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware phân quyền (Role-based)
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedException('Vui lòng đăng nhập'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenException('Bạn không có quyền thực hiện hành động này'));
    }

    next();
  };
};
