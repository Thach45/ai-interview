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
}

// Khởi tạo instance duy nhất
export const userService = new UserService(prisma, uploadService);
