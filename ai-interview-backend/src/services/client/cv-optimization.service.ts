import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { AiService, aiService } from '../core/ai.service';
import { NotFoundException } from '../../exceptions';

export class CvOptimizationService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _aiService: AiService,
  ) {}

  async optimizeCV(userId: string, analysisId: string) {
    // 1. Kiểm tra xem bản phân tích này đã được tối ưu chưa (Caching)
    const existingOptimizedCv = await this._prisma.optimizedCv.findUnique({
      where: {
        cvAnalysisId: analysisId,
      },
    });

    if (existingOptimizedCv) {
      return existingOptimizedCv;
    }

    // 2. Lấy thông tin bản phân tích
    const analysis = await this._prisma.cvAnalysis.findUnique({
      where: {
        id: analysisId,
        userId: userId, // Đảm bảo đúng chủ sở hữu
      },
      include: {
        cv: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException('Không tìm thấy bản phân tích CV hoặc bạn không có quyền truy cập');
    }

    // 3. Gọi AI phân tích (Truyền CV gốc, từ khóa thiếu và đề xuất)
    const aiResult = await this._aiService.optimizeCV(
      analysis.cv.contentExtracted,
      analysis.missingKeywords,
      analysis.improvementSuggestions
    );

    // 4. Lưu kết quả vào DB
    const savedOptimizedCv = await this._prisma.optimizedCv.create({
      data: {
        userId: userId,
        cvAnalysisId: analysisId,
        optimizedData: aiResult.optimizedData,
        modifications: aiResult.modifications,
      },
    });

    return savedOptimizedCv;
  }
}

export const cvOptimizationService = new CvOptimizationService(prisma, aiService);
