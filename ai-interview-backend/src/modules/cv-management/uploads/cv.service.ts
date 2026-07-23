import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../../providers/ai/ai.service';
import { NotFoundException } from '../../../common/exceptions/AppException';
import { v2 as cloudinary } from 'cloudinary';
import { PDFParse } from 'pdf-parse';

import { UserCvRepository } from '../builder/cv-builder.repository';
import { CvAnalysisRepository } from '../analysis/cv-analysis.repository';

@Injectable()
export class CvService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly userCvRepository: UserCvRepository,
    private readonly cvAnalysisRepository: CvAnalysisRepository,
  ) {}

  /**
   * Tai CV tu file PDF/DOCX
   */
  async uploadCv(userId: string, file: Express.Multer.File, title?: string) {
    let cvData = null;

    if (file.mimetype === 'application/pdf') {
      const parser = new (PDFParse as any)(file.buffer);
      const result = await parser.getText();
      const contentExtracted: string = result.text;

      if (contentExtracted.trim().length > 0) {
        cvData = await this.aiService.extractCvData(contentExtracted);
      }
    }

    // Upload file len Cloudinary
    const fileUrl = await this.uploadToCloudinary(file, 'cvs');

    // Luu record vao DB
    return this.userCvRepository.create({
      data: {
        userId,
        title: title || file.originalname,
        fileUrl,
        cvData: cvData || ({} as any),
      },
    });
  }

  /**
   * Lay danh sach CV Builder cua user
   */
  async getMyCvs(userId: string) {
    return this.userCvRepository.findMany({
      where: { userId },
      include: {
        template: {
          select: { id: true, name: true, thumbnailUrl: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Xoa CV Builder
   */
  async deleteCv(userId: string, id: string) {
    const cv = await this.userCvRepository.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundException(
        'Không tìm thấy CV Builder hoặc bạn không có quyền xoá',
      );
    }

    // Tìm tất cả các bài phân tích (CvAnalysis) của CV này
    const analyses = await this.cvAnalysisRepository.findMany({
      where: { cvId: id },
      select: { id: true },
    });
    const analysisIds = analyses.map((a) => a.id);

    // Ngắt liên kết cvAnalysisId của các CV tối ưu trỏ đến các bài phân tích này
    if (analysisIds.length > 0) {
      await this.userCvRepository.updateMany({
        where: { cvAnalysisId: { in: analysisIds } },
        data: { cvAnalysisId: null },
      });
    }

    await this.userCvRepository.delete({ where: { id } });
    return { message: 'Xoá CV Builder thành công' };
  }

  /**
   * Upload file len Cloudinary
   */
  private async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `ai-interview/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(new Error('Không thể tải file lên Cloudinary.'));
          } else {
            resolve(result?.secure_url || '');
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}
