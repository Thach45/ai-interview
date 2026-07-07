import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { AiService, aiService } from '../core/ai.service';
import { creditsService, CreditsService } from '../../shared/services/credits.service';
import dotenv from 'dotenv';
dotenv.config();

const CREDIT_PRICE_PER_ANALYSIS = Number(process.env.CREDIT_PRICE_PER_ANALYSIS);

export class AnalysisCVService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _aiService: AiService,
    private readonly _creditsService: CreditsService,
  ) {}

  /**
   * Quy trình phân tích CV:
   * 1. Lấy dữ liệu văn bản đã trích xuất từ CV và Job
   * 2. Gửi sang AI Service để phân tích
   * 3. Lưu kết quả chi tiết vào database
   */
  async analysisCV(userId: string, cvId: string, jobTemplateId: string) {
    // Xóa bản phân tích cũ nếu có để phân tích lại từ đầu
    const cachedAnalysis = await this.getAnalysisCV(userId, cvId, jobTemplateId);
    if (cachedAnalysis) {
      await this._prisma.cvAnalysis.delete({
        where: { id: cachedAnalysis.id },
      });
    }
    await this._creditsService.checkCredits(userId, CREDIT_PRICE_PER_ANALYSIS);
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

    // 4. Thực hiện Transaction: Lưu kết quả và trừ tiền
    const savedAnalysis = await this._prisma.$transaction(async (tx) => {
      // 4.1 Trừ tiền user
      await this._creditsService.decrementCredits(userId, CREDIT_PRICE_PER_ANALYSIS, tx);

      // 4.2 Lưu kết quả
      return tx.cvAnalysis.create({
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
    });

    return savedAnalysis;
  }

  async getAnalysisCV(userId: string, cvId: string, jobTemplateId: string) {
    const existingAnalysis = await this._prisma.cvAnalysis.findFirst({
      where: {
        userId,
        cvId,
        jobTemplateId,
      },
    });
    if (existingAnalysis) {
      return existingAnalysis;
    }
    return null;
  }
}

// Export singleton instance với các dependencies đã được inject
export const analysisCVService = new AnalysisCVService(prisma, aiService, creditsService);
