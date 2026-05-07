import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedException, ForbiddenException } from '../exceptions';

// Extend Express Request type to include user property
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['token'];

  if (!token) {
    return next(new UnauthorizedException());
  }

  const tokenString = Array.isArray(token) ? token[0] : token;
  const parts = tokenString.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    // Support original format if needed, but standard is Bearer
    // If it's just the token without Bearer, split(" ")[1] would fail
  }

  const accessToken = parts[1] || parts[0]; // Fallback to raw if Bearer is missing

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string, (err, user) => {
    if (err) {
      return next(new ForbiddenException('Invalid or expired token'));
    }
    req.user = user;
    next();
  });
};

export const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['token'];

  if (!token) {
    return next(new UnauthorizedException());
  }

  const tokenString = Array.isArray(token) ? token[0] : token;
  const parts = tokenString.split(' ');
  const accessToken = parts[1] || parts[0];

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string, (err, user) => {
    if (err) {
      return next(new ForbiddenException('Invalid or expired token'));
    }
    req.user = user;
    if (req.user.role !== 'admin') {
      return next(new ForbiddenException('Admin privileges required'));
    }
    next();
  });
};
