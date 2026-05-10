import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../../utils/asyncHandler';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/jwt.constant';

const prisma = new PrismaClient();

export const testLogin = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'candidate@gmail.com' },
    });

    if (!user) {
      return res.status(404).json({ message: 'Test user not found. Run seed first!' });
    }

    // Tạo fake token - dùng 'sub' để match với middleware auth
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Test login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Test login failed' });
  }
};


export const getCurrentProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      creditsBalance: true,
    },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ data: user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { fullName, avatarUrl, password } = req.body as {
    fullName?: string;
    avatarUrl?: string;
    password?: string;
  };

  // Validation
  if (fullName !== undefined && fullName.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid fullName' });
  }
  if (avatarUrl !== undefined && avatarUrl.length === 0) {
    return res.status(400).json({ error: 'Invalid avatarUrl' });
  }
  if (password !== undefined && password.length === 0) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const data: any = {};
  if (fullName !== undefined) data.fullName = fullName.trim();
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl.trim();
  if (password) {
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    data.password = await bcrypt.hash(password, 10);
  }
  data.updatedAt = new Date();

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      creditsBalance: true,
    },
  });

  return res.json({ data: updated });
});
