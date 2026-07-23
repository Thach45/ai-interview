import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
} from '../../common/exceptions/AppException';
import { AdminCreateUserDto, AdminUpdateUserDto } from './dto/user.dto';

import { UserRepository } from './user.repository';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          status: true,
          creditsBalance: true,
          emailVerifiedAt: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.userRepository.count(),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id, {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      status: true,
      creditsBalance: true,
      emailVerifiedAt: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: AdminCreateUserDto) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create(
      {
        email: data.email,
        fullName: data.fullName,
        password: hashedPassword,
        role: data.role,
        status: data.status,
        creditsBalance: data.creditsBalance ?? 0,
      },
      {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        status: true,
        creditsBalance: true,
        emailVerifiedAt: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      },
    );

    return user;
  }

  async updateUser(id: string, data: AdminUpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Record<string, unknown> = {};

    if (data.email !== undefined) {
      const existing = await this.userRepository.findFirst({
        email: data.email,
        id: { not: id },
      });
      if (existing) {
        throw new BadRequestException('Email already in use');
      }
      updateData.email = data.email;
    }
    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }
    if (data.role !== undefined) {
      updateData.role = data.role;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.creditsBalance !== undefined) {
      updateData.creditsBalance = data.creditsBalance;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.userRepository.update(id, updateData, {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      status: true,
      creditsBalance: true,
      emailVerifiedAt: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
    });

    return updated;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}
