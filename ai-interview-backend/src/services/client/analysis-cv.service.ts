import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import { AiService, aiService } from '../core/ai.service';
import { creditsService, CreditsService } from '../../shared/services/credits.service';
import dotenv from 'dotenv';
dotenv.config();

const CREDIT_PRICE_PER_ANALYSIS = Number(process.env.CREDIT_PRICE_PER_ANALYSIS) || 5;

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
  async analysisCVByJobTemplateId(userId: string, cvId: string, jobTemplateId: string) {
    // Tìm bản phân tích cũ nếu có
    const cachedAnalysis = await this.getAnalysisCV(userId, cvId, jobTemplateId);

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

    if (!userCv.cvData || Object.keys(userCv.cvData).length === 0) {
      throw new Error(
        'Dữ liệu CV gốc đang trống. Xin vui lòng trích xuất dữ liệu CV trước khi phân tích.',
      );
    }

    // 3. Gọi AI phân tích (Sử dụng các trường content đã trích xuất)
    const analysisResult = await this.analysisCV(
      userId,
      cvId,
      jobTemplateId,
      null,
      JSON.stringify(userCv.cvData || {}),
      jobTemplate.aiExtractedContext,
      cachedAnalysis?.id,
    );
    return analysisResult;
  }
  async analysisCVByExternalJob(userId: string, cvId: string, externalJobDescription: string) {
    await this._creditsService.checkCredits(userId, CREDIT_PRICE_PER_ANALYSIS);
    // 1. Lấy nội dung CV của người dùng
    const userCv = await this._prisma.userCv.findFirstOrThrow({
      where: {
        id: cvId,
        userId: userId, // Đảm bảo đúng chủ sở hữu
      },
    });

    if (!userCv.cvData || Object.keys(userCv.cvData).length === 0) {
      throw new Error(
        'Dữ liệu CV gốc đang trống. Xin vui lòng trích xuất dữ liệu CV trước khi phân tích.',
      );
    }

    // Tìm bản phân tích cũ nếu có
    const cachedAnalysis = await this._prisma.cvAnalysis.findFirst({
      where: {
        userId,
        cvId,
        externalJobDescription,
      },
    });
    console.log(userCv.cvData);
    // 3. Gọi AI phân tích (Sử dụng các trường content đã trích xuất)
    const analysisResult = await this.analysisCV(
      userId,
      cvId,
      null, // jobTemplateId is null
      externalJobDescription, // externalJobDescription
      JSON.stringify(userCv.cvData || {}),
      externalJobDescription,
      cachedAnalysis?.id,
    );
    console.log(analysisResult);
    return analysisResult;
  }
  async analysisCV(
    userId: string,
    cvId: string,
    jobTemplateId: string | null,
    externalJobDescription: string | null,
    contentExtracted: string,
    aiExtractedContext: string,
    existingAnalysisId?: string,
  ) {
    const analysisResult = await this._aiService.analysisCV(contentExtracted, aiExtractedContext);

    // 4. Thực hiện Transaction: Lưu kết quả và trừ tiền
    const savedAnalysis = await this._prisma.$transaction(async (tx) => {
      // 4.1 Trừ tiền user
      await this._creditsService.decrementCredits(userId, CREDIT_PRICE_PER_ANALYSIS, tx);

      // 4.2 Lưu kết quả hoặc Cập nhật
      const dataToSave = {
        userId,
        cvId,
        jobTemplateId: jobTemplateId,
        externalJobDescription: externalJobDescription,
        matchScore: analysisResult.matchScore,
        summary: analysisResult.summary,
        scoringDetails: analysisResult.scoringDetails,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        skillsAnalysis: analysisResult.skillsAnalysis,
        foundKeywords: analysisResult.foundKeywords,
        missingKeywords: analysisResult.missingKeywords,
        improvementSuggestions: analysisResult.improvementSuggestions,
      };

      if (existingAnalysisId) {
        // PA3: Cập nhật đè bản cũ, giữ nguyên ID để không vỡ liên kết khóa ngoại
        const updated = await tx.cvAnalysis.update({
          where: { id: existingAnalysisId },
          data: dataToSave,
        });
        return updated;
      } else {
        // Tạo mới
        const created = await tx.cvAnalysis.create({
          data: dataToSave,
        });
        return created;
      }
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

  async getHistoryAnalysisCvResult(userId: string) {
    const existingAnalysis = await this._prisma.cvAnalysis.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        matchScore: true,
        createdAt: true,
        externalJobDescription: true,
        cv: { select: { title: true } },
        jobTemplate: { select: { title: true } },
        optimizedCvs: { select: { id: true } },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
    if (existingAnalysis) {
      return existingAnalysis.map((item) => ({
        ...item,
        isOptimized: !!item.optimizedCvs?.[0],
        optimizedCvs: undefined,
      }));
    }
    return null;
  }

  async getAnalysisCvById(userId: string, id: string) {
    const analysis = await this._prisma.cvAnalysis.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        cv: { select: { title: true } },
        jobTemplate: { select: { title: true } },
      },
    });
    return analysis;
  }
}

// Export singleton instance với các dependencies đã được inject
export const analysisCVService = new AnalysisCVService(prisma, aiService, creditsService);
