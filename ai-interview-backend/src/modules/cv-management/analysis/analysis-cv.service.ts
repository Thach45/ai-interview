import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../../providers/ai/ai.service';
import { CreditsService } from '../../credits/credits.service';
import {
  BadRequestException,
  NotFoundException,
} from '../../../common/exceptions/AppException';
import { sanitizePrompt } from '../../../common/utils/sanitize.util';

import { UserCvRepository } from '../builder/cv-builder.repository';
import { CvAnalysisRepository } from './cv-analysis.repository';
import { JobTemplateRepository } from '../../job-template/job-template.repository';

@Injectable()
export class AnalysisCvService {
  private readonly creditPricePerAnalysis: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly creditsService: CreditsService,
    private readonly userCvRepository: UserCvRepository,
    private readonly cvAnalysisRepository: CvAnalysisRepository,
    private readonly jobTemplateRepository: JobTemplateRepository,
    configService: ConfigService,
  ) {
    this.creditPricePerAnalysis = parseInt(
      configService.get<string>('CREDIT_PRICE_PER_ANALYSIS') || '5',
      10,
    );
  }

  /**
   * Phân tích CV dựa trên Job Template có sẵn trong hệ thống.
   * 1. Lấy dữ liệu văn bản đã trích xuất từ CV và Job
   * 2. Gửi sang AI Service để phân tích
   * 3. Lưu kết quả chi tiết vào database (kèm trừ credit trong transaction)
   */
  async analysisCVByJobTemplateId(
    userId: string,
    cvId: string,
    jobTemplateId: string,
  ) {
    // Tìm bản phân tích cũ nếu có (để update — giữ nguyên ID không vỡ FK)
    const cachedAnalysis = await this.cvAnalysisRepository.findFirst({
      where: { userId, cvId, jobTemplateId },
    });

    // Kiểm tra số dư credit
    await this.creditsService.checkCredits(userId, this.creditPricePerAnalysis);

    // Lấy nội dung CV của người dùng
    const userCv = await this.userCvRepository.findFirst({
      where: { id: cvId, userId },
    });
    if (!userCv) throw new NotFoundException('CV không tồn tại');

    // Lấy nội dung Job Template
    const jobTemplate = await this.jobTemplateRepository.findUnique({
      where: { id: jobTemplateId },
    });
    if (!jobTemplate) throw new NotFoundException('Job Template không tồn tại');

    if (!userCv.cvData || Object.keys(userCv.cvData).length === 0) {
      throw new BadRequestException(
        'Dữ liệu CV gốc đang trống. Xin vui lòng trích xuất dữ liệu CV trước khi phân tích.',
      );
    }

    // Gọi AI phân tích
    const analysisResult = await this.runAnalysis(
      userId,
      cvId,
      jobTemplateId,
      null,
      JSON.stringify(userCv.cvData),
      jobTemplate.aiExtractedContext,
      cachedAnalysis?.id,
    );

    return analysisResult;
  }

  /**
   * Phân tích CV dựa trên mô tả công việc do người dùng cung cấp (bên ngoài).
   * Có áp dụng lọc prompt-injection cho mô tả công việc.
   */
  async analysisCVByExternalJob(
    userId: string,
    cvId: string,
    externalJobDescription: string,
  ) {
    // Lọc prompt-injection
    const sanitizedDescription = sanitizePrompt(externalJobDescription);

    // Kiểm tra số dư credit
    await this.creditsService.checkCredits(userId, this.creditPricePerAnalysis);

    // Lấy nội dung CV của người dùng
    const userCv = await this.userCvRepository.findFirst({
      where: { id: cvId, userId },
    });
    if (!userCv) throw new NotFoundException('CV không tồn tại');

    if (!userCv.cvData || Object.keys(userCv.cvData).length === 0) {
      throw new BadRequestException(
        'Dữ liệu CV gốc đang trống. Xin vui lòng trích xuất dữ liệu CV trước khi phân tích.',
      );
    }

    // Tìm bản phân tích cũ có cùng externalJobDescription
    const cachedAnalysis = await this.cvAnalysisRepository.findFirst({
      where: { userId, cvId, externalJobDescription: sanitizedDescription },
    });

    // Gọi AI phân tích
    const analysisResult = await this.runAnalysis(
      userId,
      cvId,
      null,
      sanitizedDescription,
      JSON.stringify(userCv.cvData),
      sanitizedDescription,
      cachedAnalysis?.id,
    );

    return analysisResult;
  }

  /**
   * Internal: Gọi AI và lưu kết quả vào DB trong một transaction (credit + analysis).
   */
  private async runAnalysis(
    userId: string,
    cvId: string,
    jobTemplateId: string | null,
    externalJobDescription: string | null,
    contentExtracted: string,
    aiExtractedContext: string,
    existingAnalysisId?: string,
  ) {
    const analysisResult = await this.aiService.analysisCV(
      contentExtracted,
      aiExtractedContext,
    );

    // Transaction: Trừ credit + lưu kết quả
    const savedAnalysis = await this.prisma.$transaction(async (tx) => {
      // Trừ credit
      await this.creditsService.decrementCredits(
        userId,
        this.creditPricePerAnalysis,
        tx,
      );

      const dataToSave = {
        userId,
        cvId,
        jobTemplateId,
        externalJobDescription,
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
        // Cập nhật đè bản cũ, giữ nguyên ID để không vỡ liên kết khoá ngoại
        return this.cvAnalysisRepository.update(
          {
            where: { id: existingAnalysisId },
            data: dataToSave,
          },
          tx,
        );
      }

      // Tạo mới
      return this.cvAnalysisRepository.create({ data: dataToSave }, tx);
    });

    return savedAnalysis;
  }

  /**
   * Lấy kết quả phân tích CV mới nhất của người dùng.
   */
  async getAnalysisCV(userId: string) {
    return this.cvAnalysisRepository.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy lịch sử phân tích CV của người dùng.
   */
  async getHistoryAnalysisCvResult(userId: string) {
    const results = await this.cvAnalysisRepository.findMany({
      where: { userId },
      select: {
        id: true,
        matchScore: true,
        createdAt: true,
        externalJobDescription: true,
        cv: { select: { title: true } },
        jobTemplate: { select: { title: true } },
        optimizedCvs: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return results.map((item) => ({
      ...item,
      isOptimized: !!(item as any).optimizedCvs?.[0],
      optimizedCvs: undefined,
    }));
  }

  /**
   * Lấy chi tiết một kết quả phân tích CV theo ID.
   */
  async getAnalysisCvById(id: string, userId: string) {
    const analysis = await this.cvAnalysisRepository.findFirst({
      where: { id, userId },
      include: {
        cv: { select: { title: true } },
        jobTemplate: { select: { title: true } },
      },
    });

    if (!analysis) {
      return null;
    }

    return analysis;
  }
}
