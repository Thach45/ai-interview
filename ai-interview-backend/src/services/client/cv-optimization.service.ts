import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import puppeteer from 'puppeteer';
import { AiService, aiService } from '../core/ai.service';
import { NotFoundException } from '../../exceptions';
import { CreditsService, creditsService } from '../../shared/services/credits.service';
import dotenv from 'dotenv';
dotenv.config();

const CREDIT_PRICE_PER_OPTIMIZATION = Number(process.env.CREDIT_PRICE_PER_OPTIMIZATION);

export class CvOptimizationService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _aiService: AiService,
    private readonly _creditsService: CreditsService,
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
    // 1.1 kiểm tra số dư
    await this._creditsService.checkCredits(userId, CREDIT_PRICE_PER_OPTIMIZATION);

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
      throw new NotFoundException(
        'Không tìm thấy bản phân tích CV hoặc bạn không có quyền truy cập',
      );
    }

    // 3. Gọi AI phân tích (Truyền CV gốc, từ khóa thiếu và đề xuất)
    const aiResult = await this._aiService.optimizeCV(
      analysis.cv.contentExtracted,
      analysis.missingKeywords,
      analysis.improvementSuggestions,
    );

    // 4. Lưu kết quả vào DB và trừ tiền bằng Transaction để đảm bảo tính toàn vẹn
    const savedOptimizedCv = await this._prisma.$transaction(async (tx) => {
      await this._creditsService.decrementCredits(userId, CREDIT_PRICE_PER_OPTIMIZATION, tx);

      const optimizedCv = await tx.optimizedCv.create({
        data: {
          userId: userId,
          cvAnalysisId: analysisId,
          optimizedData: aiResult.optimizedData,
          modifications: aiResult.modifications,
        },
      });

      return optimizedCv;
    });

    return savedOptimizedCv;
  }

  async exportPdf(userId: string, analysisId: string, html: string): Promise<Uint8Array> {
    // 1. Lưu html vào DB (cột finalHtml)
    await this._prisma.optimizedCv.update({
      where: {
        cvAnalysisId: analysisId, // wait, is the id primary key or cvAnalysisId?
      },
      data: {
        finalHtml: html,
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
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

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
    const optimizedCv = await this._prisma.optimizedCv.findUnique({
      where: {
        cvAnalysisId: analysisId,
      },
    });

    if (!optimizedCv || optimizedCv.userId !== userId) {
      throw new NotFoundException('Không tìm thấy dữ liệu CV đã tối ưu');
    }

    return optimizedCv;
  }
}

export const cvOptimizationService = new CvOptimizationService(prisma, aiService, creditsService);
