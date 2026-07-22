import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { AiService, aiService } from '../core/ai.service';
import { NotFoundException, BadRequestException } from '../../exceptions';
import { CreditsService, creditsService } from '../../shared/services/credits.service';
import dotenv from 'dotenv';
dotenv.config();

const CREDIT_PRICE_PER_OPTIMIZATION = Number(process.env.CREDIT_PRICE_PER_OPTIMIZATION) || 5;

export class CvOptimizationService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _aiService: AiService,
    private readonly _creditsService: CreditsService,
  ) {}

  async optimizeCV(userId: string, analysisId: string, templateId?: string) {
    // 1. Kiểm tra xem bản phân tích này đã được tối ưu chưa (Caching)
    const existingOptimizedCv = await this._prisma.userCv.findFirst({
      where: {
        cvAnalysisId: analysisId,
      },
    });

    if (existingOptimizedCv) {
      return existingOptimizedCv;
    }
    // 1.1 kiểm tra số dư
    await this._creditsService.checkCredits(userId, CREDIT_PRICE_PER_OPTIMIZATION);

    // 2. Lấy thông tin bản phân tích
    const analysis = await this._prisma.cvAnalysis.findFirst({
      where: {
        id: analysisId,
        userId: userId, // Đảm bảo đúng chủ sở hữu
      },
      include: {
        cv: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException(
        'Không tìm thấy bản phân tích CV hoặc bạn không có quyền truy cập',
      );
    }

    if (!analysis.cv.cvData || Object.keys(analysis.cv.cvData).length === 0) {
      throw new BadRequestException(
        'Dữ liệu CV gốc đang trống. Xin vui lòng trích xuất dữ liệu CV trước khi tối ưu.',
      );
    }

    // 3. Gọi AI phân tích (Truyền CV gốc, từ khóa thiếu và đề xuất)
    const aiResult = await this._aiService.optimizeCV(
      JSON.stringify(analysis.cv.cvData || {}),
      analysis.missingKeywords,
      analysis.improvementSuggestions,
    );

    // 4. Lưu kết quả vào DB và trừ tiền bằng Transaction để đảm bảo tính toàn vẹn
    const savedOptimizedCv = await this._prisma.$transaction(async (tx) => {
      await this._creditsService.decrementCredits(userId, CREDIT_PRICE_PER_OPTIMIZATION, tx);

      const targetTemplateId = templateId || analysis.cv.templateId;
      let renderedHtml: string | null = null;

      if (targetTemplateId) {
        const template = await tx.cvTemplate.findUnique({
          where: { id: targetTemplateId },
        });

        if (template) {
          try {
            const compiled = Handlebars.compile(template.htmlStructure);
            const rawData = aiResult.optimizedData as any;

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
              experiences: (rawData.experiences || []).filter((e: any) => e.company || e.role),
              education: (rawData.education || []).filter((e: any) => e.school),
              projects: (rawData.projects || []).filter((p: any) => p.name),
              hardSkills: (rawData.hardSkills || []).filter((s: any) => s && s.trim()),
              computerSkills: (rawData.computerSkills || []).filter((c: any) => c.name),
              languages: (rawData.languages || []).filter((l: any) => l.name),
              certifications: (rawData.certifications || []).filter((c: any) => c.name),
              activities: (rawData.activities || []).filter((a: any) => a.name),
              references: (rawData.references || []).filter((r: any) => r.name),
            };

            renderedHtml = compiled(templateData);
          } catch (err) {
            console.error('Lỗi compile HTML ở backend khi optimize CV:', err);
          }
        }
      }

      const optimizedCv = await tx.userCv.create({
        data: {
          userId: userId,
          cvAnalysisId: analysisId,
          cvData: aiResult.optimizedData as any,
          aiModifications: aiResult.modifications as any,
          title: analysis.cv.title + ' (Optimized)',
          templateId: targetTemplateId,
          renderedHtml: renderedHtml,
        },
      });

      return { ...optimizedCv, optimizedData: optimizedCv.cvData };
    });

    return savedOptimizedCv;
  }

  async exportPdf(userId: string, analysisId: string, html: string): Promise<Uint8Array> {
    // 1. Lưu html vào DB (cột finalHtml)
    await this._prisma.userCv.updateMany({
      where: {
        cvAnalysisId: analysisId, // wait, is the id primary key or cvAnalysisId?
      },
      data: {
        renderedHtml: html,
      },
    });

    // 2. Chạy Puppeteer để render
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // Đặt content và chờ mạng tĩnh để Tailwind CDN render
      await page.setContent(html, { waitUntil: 'networkidle0' as any });

      // Xuất PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, // Render background colors/images
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  async getOptimizedCv(userId: string, analysisId: string) {
    const optimizedCv = await this._prisma.userCv.findFirst({
      where: {
        cvAnalysisId: analysisId,
      },
    });

    if (!optimizedCv || optimizedCv.userId !== userId) {
      throw new NotFoundException('Không tìm thấy dữ liệu CV đã tối ưu');
    }

    return { ...optimizedCv, optimizedData: optimizedCv.cvData };
  }
}

export const cvOptimizationService = new CvOptimizationService(prisma, aiService, creditsService);
