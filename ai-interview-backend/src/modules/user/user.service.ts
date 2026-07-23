import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '../../common/exceptions/AppException';
import { UpdateProfileDto } from './dto/user.dto';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId, {
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

  async updateUser(userId: string, data: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Record<string, unknown> = {};

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.userRepository.update(userId, updateData, {
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

  async getDashboardData(userId: string) {
    const totalInterviews = await this.prisma.interviewSession.count({
      where: { userId },
    });

    const completedInterviews = await this.prisma.interviewSession.count({
      where: { userId, status: 'COMPLETED' },
    });

    const totalCvs = await this.prisma.userCv.count({
      where: { userId },
    });

    const avgResult = await this.prisma.interviewResult.aggregate({
      where: { session: { userId } },
      _avg: { overallScore: true },
    });
    const averageScore = avgResult._avg.overallScore
      ? Math.round(avgResult._avg.overallScore)
      : 0;

    const last7Sessions = await this.prisma.interviewSession.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'asc' },
      take: 7,
      include: {
        result: { select: { overallScore: true } },
      },
    });

    const performanceTrend = last7Sessions.map(
      (session) => session.result?.overallScore ?? 0,
    );

    const [recentCvs, recentSessions] = await Promise.all([
      this.prisma.userCv.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.interviewSession.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const activities: any[] = [];
    recentCvs.forEach((cv) => {
      activities.push({
        id: cv.id,
        type: 'CV_UPLOADED',
        description: `Đã tải lên CV: ${cv.title}`,
        createdAt: cv.createdAt,
      });
    });

    recentSessions.forEach((session) => {
      let description = `Bắt đầu phiên phỏng vấn vị trí: ${session.jobTitle}`;
      if (session.status === 'COMPLETED') {
        description = `Đã hoàn thành phỏng vấn vị trí: ${session.jobTitle}`;
      } else if (session.status === 'IN_PROGRESS') {
        description = `Đang phỏng vấn vị trí: ${session.jobTitle}`;
      }
      activities.push({
        id: session.id,
        type: 'INTERVIEW',
        status: session.status,
        description,
        createdAt: session.createdAt,
      });
    });

    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const recentActivities = activities.slice(0, 5);

    let suggestedJobs = await this.prisma.jobTemplate.findMany({
      where: { isHotJob: true },
      take: 3,
      select: {
        id: true,
        title: true,
        companyName: true,
        companyLogo: true,
      },
    });

    if (suggestedJobs.length < 3) {
      const fallbackJobs = await this.prisma.jobTemplate.findMany({
        take: 3 - suggestedJobs.length,
        select: {
          id: true,
          title: true,
          companyName: true,
          companyLogo: true,
        },
      });
      suggestedJobs = [...suggestedJobs, ...fallbackJobs];
    }

    return {
      stats: {
        totalInterviews,
        completedInterviews,
        totalCvs,
        averageScore,
      },
      performanceTrend,
      recentActivities,
      suggestedJobs,
    };
  }
}
