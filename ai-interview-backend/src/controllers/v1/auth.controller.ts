import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { BadRequestException, UnauthorizedException, ForbiddenException } from '../../exceptions';
import * as userService from '../../services/auth.service';
import { asyncHandler } from '../../utils/asyncHandler';

dotenv.config();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  const existEmail = await userService.findUserByEmail(email);
  if (existEmail) {
    throw new BadRequestException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userService.createUser({
    email,
    password: hashedPassword,
    role: role || 'user',
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const auth = await userService.findUserByEmail(email);

  if (!auth || !(await bcrypt.compare(password, auth.password))) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = {
    id: auth._id,
    email: auth.email,
    role: auth.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    data: {
      email: auth.email,
      role: auth.role,
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;

  if (!token) {
    throw new UnauthorizedException('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN as string) as any;
    const payload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (_err) {
    throw new ForbiddenException('Invalid or expired refresh token');
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
});
