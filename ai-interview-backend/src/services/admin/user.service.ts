import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import { UserStatus, Role } from '@prisma/client';
import { BadRequestException, NotFoundException } from '../../exceptions';

export class UserService {
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: Role;
    status?: UserStatus;
    search?: string;
  }) {
    const { page = 1, limit = 10, role, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: any) {
    const { email, password, fullName, role, status, creditsBalance } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: role || Role.CANDIDATE,
        status: status || UserStatus.ACTIVE,
        creditsBalance: creditsBalance !== undefined ? creditsBalance : 3,
        emailVerifiedAt: new Date(), // Admin created users are verified by default?
      },
    });
  }

  async updateUser(id: string, data: any) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}

export const userService = new UserService();
