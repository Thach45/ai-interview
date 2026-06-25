import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import puppeteer from 'puppeteer';
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
      await page.setContent(html, { waitUntil: 'networkidle0' });

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
}

export const cvOptimizationService = new CvOptimizationService(prisma, aiService);
