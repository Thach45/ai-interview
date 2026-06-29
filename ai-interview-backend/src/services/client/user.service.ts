import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PDFParse } from 'pdf-parse';
import prisma from '../../config/prisma';
import { uploadService, UploadService } from '../../shared/services/upload.service';

/**
 * UserService hợp nhất từ ProfileService và CvService.
 * Quản lý toàn bộ thông tin và tài nguyên liên quan đến người dùng.
 */
export class UserService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _uploadService: UploadService,
  ) {}

  async getUserById(userId: string) {
    return await this._prisma.user.findUnique({
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

    return await this._prisma.user.update({
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
    return await this._prisma.user.findUnique({
      where: { email },
    });
  }

  async uploadCv(userId: string, file: Express.Multer.File, title: string) {
    // 1. Trích xuất văn bản từ PDF
    let contentExtracted = '';
    if (file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      contentExtracted = result.text;
    }

    // 2. Upload file lên cloud thông qua Shared Service
    const fileUrl = await this._uploadService.uploadFile(file, 'cvs');

    // 3. Lưu record vào DB
    return await this._prisma.userCv.create({
      data: {
        userId,
        title: title || file.originalname,
        fileUrl,
        contentExtracted,
      },
    });
  }

  async getMyCvs(userId: string) {
    return await this._prisma.userCv.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboardData(userId: string) {
    // 1. Đếm tổng số phỏng vấn
    const totalInterviews = await this._prisma.interviewSession.count({
      where: { userId },
    });

    // 2. Đếm số phỏng vấn đã hoàn thành
    const completedInterviews = await this._prisma.interviewSession.count({
      where: { userId, status: 'COMPLETED' },
    });

    // 3. Đếm số CV đã phân tích/tải lên
    const totalCvs = await this._prisma.userCv.count({
      where: { userId },
    });

    // 4. Tính điểm trung bình phỏng vấn
    const avgResult = await this._prisma.interviewResult.aggregate({
      where: { session: { userId } },
      _avg: { overallScore: true },
    });
    const averageScore = avgResult._avg.overallScore ? Math.round(avgResult._avg.overallScore) : 0;

    // 5. Lấy xu hướng điểm số (tối đa 7 phiên phỏng vấn đã hoàn thành gần nhất, xếp theo thời gian tăng dần để vẽ biểu đồ)
    const completedSessions = await this._prisma.interviewSession.findMany({
      where: { userId, status: 'COMPLETED' },
      include: { result: true },
      orderBy: { createdAt: 'asc' },
      take: 7,
    });
    const performanceTrend = completedSessions.map((s) => s.result?.overallScore || 0);

    // 6. Lấy hoạt động gần đây (kết hợp CV và phỏng vấn)
    const [recentCvs, recentSessions] = await Promise.all([
      this._prisma.userCv.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this._prisma.interviewSession.findMany({
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

    // Sắp xếp hoạt động theo thời gian giảm dần và lấy 5 hoạt động mới nhất
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const recentActivities = activities.slice(0, 5);

    // 7. Gợi ý việc làm (Job Templates)
    let suggestedJobs = await this._prisma.jobTemplate.findMany({
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
      const fallbackJobs = await this._prisma.jobTemplate.findMany({
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

// Khởi tạo instance duy nhất
export const userService = new UserService(prisma, uploadService);
