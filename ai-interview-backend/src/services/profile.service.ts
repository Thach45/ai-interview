import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

export class ProfileService {
  async getUserById(userId: string) {
    return await prisma.user.findUnique({
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
  }

  async updateUser(
    userId: string,
    data: {
      fullName?: string;
      avatarUrl?: string;
      password?: string;
    },
  ) {
    const updateData: any = {};

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName.trim();
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl.trim();
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    updateData.updatedAt = new Date();

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}

export const profileService = new ProfileService();
