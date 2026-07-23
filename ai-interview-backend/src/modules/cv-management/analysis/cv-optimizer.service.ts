import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { PrismaService } from '../../../prisma/prisma.service';
import { AiService } from '../../../providers/ai/ai.service';
import { CreditsService } from '../../credits/credits.service';
import {
  BadRequestException,
  NotFoundException,
} from '../../../common/exceptions/AppException';

import { UserCvRepository } from '../builder/cv-builder.repository';
import { CvAnalysisRepository } from './cv-analysis.repository';
import { CvTemplateRepository } from '../templates/cv-template.repository';

@Injectable()
export class CvOptimizerService {
  private readonly creditPricePerOptimization: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly creditsService: CreditsService,
    private readonly userCvRepository: UserCvRepository,
    private readonly cvAnalysisRepository: CvAnalysisRepository,
    private readonly cvTemplateRepository: CvTemplateRepository,
    configService: ConfigService,
  ) {
    this.creditPricePerOptimization = parseInt(
      configService.get<string>('CREDIT_PRICE_PER_OPTIMIZATION') || '5',
      10,
    );
  }

  /**
   * Tối ưu CV dựa trên kết quả phân tích (missing keywords, improvement suggestions).
   * 1. Kiểm tra cache — nếu đã tối ưu thì trả về luôn
   * 2. Kiểm tra số dư credit
   * 3. Lấy thông tin bản phân tích + CV gốc
   * 4. Gọi AI để tối ưu CV
   * 5. Transaction: trừ credit + lưu CV đã tối ưu (kèm render HTML template nếu có)
   */
  async optimizeCV(userId: string, analysisId: string, templateId?: string) {
    // Kiểm tra xem bản phân tích này đã được tối ưu chưa (caching)
    const existingOptimizedCv = await this.userCvRepository.findFirst({
      where: { cvAnalysisId: analysisId },
    });

    if (existingOptimizedCv) {
      return existingOptimizedCv;
    }

    // Kiểm tra số dư credit
    await this.creditsService.checkCredits(
      userId,
      this.creditPricePerOptimization,
    );

    // Lấy thông tin bản phân tích
    const analysis = await this.cvAnalysisRepository.findFirst({
      where: { id: analysisId, userId },
      include: { cv: true },
    });

    if (!analysis) {
      throw new NotFoundException(
        'Không tìm thấy bản phân tích CV hoặc bạn không có quyền truy cập',
      );
    }

    if (
      !(analysis as any).cv.cvData ||
      Object.keys((analysis as any).cv.cvData).length === 0
    ) {
      throw new BadRequestException(
        'Dữ liệu CV gốc đang trống. Xin vui lòng trích xuất dữ liệu CV trước khi tối ưu.',
      );
    }

    // Gọi AI tối ưu
    const aiResult = await this.aiService.optimizeCV(
      JSON.stringify((analysis as any).cv.cvData),
      analysis.missingKeywords,
      analysis.improvementSuggestions,
    );

    // Transaction: Trừ credit + lưu CV đã tối ưu
    const savedOptimizedCv = await this.prisma.$transaction(async (tx) => {
      await this.creditsService.decrementCredits(
        userId,
        this.creditPricePerOptimization,
        tx,
      );

      const targetTemplateId = templateId || (analysis as any).cv.templateId;
      let renderedHtml: string | null = null;

      // Render HTML từ template nếu có
      if (targetTemplateId) {
        const template = await this.cvTemplateRepository.findUnique(
          { where: { id: targetTemplateId } },
          tx,
        );

        if (template) {
          try {
            const compiled = Handlebars.compile(template.htmlStructure);
            const rawData = aiResult.optimizedData;

            const templateData = {
              fullName: rawData.fullName || 'Họ và tên',
              jobTitle: rawData.jobTitle || 'Vị trí ứng tuyển',
              objective: rawData.objective || '',
              cssStyles: '',
              contact: {
                address: rawData.contact?.address || '',
                phone: rawData.contact?.phone || '',
                email: rawData.contact?.email || '',
                birthday: rawData.contact?.birthday || '',
              },
              experiences: (rawData.experiences || []).filter(
                (e: any) => e.company || e.role,
              ),
              education: (rawData.education || []).filter((e: any) => e.school),
              projects: (rawData.projects || []).filter((p: any) => p.name),
              hardSkills: (rawData.hardSkills || []).filter(
                (s: any) => s && s.trim(),
              ),
              computerSkills: (rawData.computerSkills || []).filter(
                (c: any) => c.name,
              ),
              languages: (rawData.languages || []).filter((l: any) => l.name),
              certifications: (rawData.certifications || []).filter(
                (c: any) => c.name,
              ),
              activities: (rawData.activities || []).filter((a: any) => a.name),
              references: (rawData.references || []).filter((r: any) => r.name),
            };

            renderedHtml = compiled(templateData);
          } catch (err) {
            console.error('Lỗi compile HTML ở backend khi optimize CV:', err);
          }
        }
      }

      const optimizedCv = await this.userCvRepository.create(
        {
          data: {
            userId,
            cvAnalysisId: analysisId,
            cvData: aiResult.optimizedData,
            aiModifications: aiResult.modifications,
            title: (analysis as any).cv.title + ' (Optimized)',
            templateId: targetTemplateId,
            renderedHtml,
          },
        },
        tx,
      );

      return { ...optimizedCv, optimizedData: optimizedCv.cvData };
    });

    return savedOptimizedCv;
  }

  /**
   * Lấy CV đã tối ưu theo analysisId.
   */
  async getOptimizedCv(userId: string, analysisId: string) {
    const optimizedCv = await this.userCvRepository.findFirst({
      where: { cvAnalysisId: analysisId },
    });

    if (!optimizedCv || optimizedCv.userId !== userId) {
      throw new NotFoundException('Không tìm thấy dữ liệu CV đã tối ưu');
    }

    return { ...optimizedCv, optimizedData: optimizedCv.cvData };
  }

  /**
   * Xuất CV đã tối ưu ra PDF sử dụng Puppeteer.
   */
  async exportPdf(userId: string, analysisId: string): Promise<Buffer> {
    // Lấy CV đã tối ưu
    const optimizedCv = await this.userCvRepository.findFirst({
      where: { cvAnalysisId: analysisId },
    });

    if (!optimizedCv || optimizedCv.userId !== userId) {
      throw new NotFoundException(
        'Không tìm thấy dữ liệu CV đã tối ưu hoặc bạn không có quyền truy cập',
      );
    }

    if (!optimizedCv.renderedHtml) {
      throw new BadRequestException('CV chưa có nội dung HTML để xuất PDF');
    }

    // Render PDF bằng Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(optimizedCv.renderedHtml, {
        waitUntil: 'networkidle0' as any,
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
