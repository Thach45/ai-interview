import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';
import puppeteer from 'puppeteer';
import { NotFoundException, BadRequestException } from '../../exceptions';
import { UploadService, uploadService } from '../../shared/services/upload.service';
import { AiService, aiService } from '../core/ai.service';
import { PDFParse } from 'pdf-parse';
export class BuilderCvService {
  constructor(
    private readonly _prisma: PrismaClient,
    private readonly _uploadService: UploadService,
    private readonly _aiService: AiService,
  ) {}

  // ===================== CV TEMPLATES =====================

  /**
   * Lấy danh sách template CV đang hoạt động
   */
  async getTemplates() {
    return this._prisma.cvTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy chi tiết template CV
   */
  async getTemplateById(id: string) {
    const template = await this._prisma.cvTemplate.findFirst({
      where: { id, isActive: true },
    });
    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu CV hoặc mẫu không hoạt động');
    }
    return template;
  }

  /**
   * Lưu hoặc cập nhật CV từ Builder
   * - Nếu chưa có id: tạo mới
   * - Nếu có id: cập nhật bản ghi hiện tại (chỉ cho phép sửa của chính user)
   */
  async saveCv(
    userId: string,
    data: {
      id?: string;
      templateId: string;
      title: string;
      cvData: string;
      renderedHtml: string;
    },
  ) {
    const { id, templateId, title, cvData, renderedHtml } = data;

    // Kiểm tra template có tồn tại không
    const template = await this._prisma.cvTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template || !template.isActive) {
      throw new NotFoundException('Không tìm thấy mẫu CV hoặc mẫu không hoạt động');
    }

    if (id) {
      // Update CV đã tồn tại (kiểm tra quyền sở hữu)
      const existing = await this._prisma.userCv.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new NotFoundException('Không tìm thấy CV Builder hoặc bạn không có quyền chỉnh sửa');
      }

      return this._prisma.userCv.update({
        where: { id },
        data: { title, cvData: typeof cvData === 'string' ? JSON.parse(cvData) : cvData, renderedHtml, templateId },
      });
    }

    // Tạo mới
    return this._prisma.userCv.create({
      data: {
        userId,
        templateId,
        title,
        cvData: typeof cvData === 'string' ? JSON.parse(cvData) : cvData,
        renderedHtml,
      },
    });
  }

  /**
   * Upload CV từ PDF/DOCX
   */
  async uploadCv(userId: string, file: Express.Multer.File, title: string) {
    let cvData = null;

    if (file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      const contentExtracted = result.text;

      // Gọi AI trích xuất thông tin
      if (contentExtracted.trim().length > 0) {
        cvData = await this._aiService.extractCvData(contentExtracted);
      }
    }

    // 2. Upload file lên cloud thông qua Shared Service
    const fileUrl = await this._uploadService.uploadFile(file, 'cvs');

    // 3. Lưu record vào DB
    return this._prisma.userCv.create({
      data: {
        userId,
        title: title || file.originalname,
        fileUrl,
        cvData: cvData || ({} as any),
      },
    });
  }

  /**
   * Lấy danh sách CV Builder của user
   */
  async getMyCvs(userId: string) {
    return this._prisma.userCv.findMany({
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
   * Lấy chi tiết CV Builder (kèm template để render lại)
   */
  async getCvById(userId: string, id: string) {
    const cv = await this._prisma.userCv.findFirst({
      where: { id, userId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            htmlStructure: true,
            cssStyles: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV Builder hoặc bạn không có quyền truy cập');
    }

    return cv;
  }

  /**
   * Xoá CV Builder
   */
  async deleteCv(userId: string, id: string) {
    const cv = await this._prisma.userCv.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV Builder hoặc bạn không có quyền xoá');
    }

    await this._prisma.userCv.delete({ where: { id } });
    return { message: 'Xoá CV Builder thành công' };
  }

  /**
   * Export CV Builder ra PDF sử dụng Puppeteer
   * - Nếu không truyền html, dùng renderedHtml đã lưu
   * - Nếu có, render html mới (trường hợp user vừa sửa form)
   */
  async exportPdf(userId: string, id: string, html?: string) {
    const cv = await this._prisma.userCv.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV Builder hoặc bạn không có quyền truy cập');
    }

    const finalHtml = html || cv.renderedHtml;

    if (!finalHtml) {
      throw new BadRequestException('CV chưa có nội dung HTML để xuất PDF');
    }

    // Render PDF bằng Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' as any });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      // Lưu lại renderedHtml nếu có html mới được truyền vào
      if (html) {
        await this._prisma.userCv.update({
          where: { id },
          data: { renderedHtml: html },
        });
      }

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}

export const builderCvService = new BuilderCvService(prisma, uploadService, aiService);
