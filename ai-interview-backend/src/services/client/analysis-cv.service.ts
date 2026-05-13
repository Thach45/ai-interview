import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { AiService, aiService } from '../core/ai.service';

export class AnalysisCVService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _aiService: AiService,
  ) {}

  /**
   * Quy trình phân tích CV:
   * 1. Lấy dữ liệu văn bản đã trích xuất từ CV và Job
   * 2. Gửi sang AI Service để phân tích
   * 3. Lưu kết quả chi tiết vào database
   */
  async analysisCV(userId: string, cvId: string, jobTemplateId: string) {
    // 1. Lấy nội dung CV của người dùng
    const userCv = await this._prisma.userCv.findFirstOrThrow({
      where: {
        id: cvId,
        userId: userId, // Đảm bảo đúng chủ sở hữu
      },
    });

    // 2. Lấy nội dung Job Template
    const jobTemplate = await this._prisma.jobTemplate.findUniqueOrThrow({
      where: {
        id: jobTemplateId,
      },
    });

    // 3. Gọi AI phân tích (Sử dụng các trường content đã trích xuất)
    const analysisResult = await this._aiService.analysisCV(
      userCv.contentExtracted,
      jobTemplate.aiExtractedContext,
    );

    // 4. Lưu kết quả vào bảng CvAnalysis
    const savedAnalysis = await this._prisma.cvAnalysis.create({
      data: {
        userId: userId,
        cvId: cvId,
        jobTemplateId: jobTemplateId,
        matchScore: analysisResult.matchScore,
        summary: analysisResult.summary,
        scoringDetails: analysisResult.scoringDetails,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        skillsAnalysis: analysisResult.skillsAnalysis,
        foundKeywords: analysisResult.foundKeywords,
        missingKeywords: analysisResult.missingKeywords,
        improvementSuggestions: analysisResult.improvementSuggestions,
      },
    });

    return savedAnalysis;
  }
}

// Export singleton instance với các dependencies đã được inject
export const analysisCVService = new AnalysisCVService(prisma, aiService);
