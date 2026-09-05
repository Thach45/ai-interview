import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
} from '../../../common/exceptions/AppException';
import puppeteer from 'puppeteer';
import { SaveCvDto } from './dto/cv-builder.dto';

import { UserCvRepository } from './cv-builder.repository';
import { CvAnalysisRepository } from '../analysis/cv-analysis.repository';
import { CvTemplateRepository } from '../templates/cv-template.repository';
import { toPrismaJson } from '../../../common/validation/jsonb-validation.util';

@Injectable()
export class CvBuilderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userCvRepository: UserCvRepository,
    private readonly cvAnalysisRepository: CvAnalysisRepository,
    private readonly cvTemplateRepository: CvTemplateRepository,
  ) {}

  // ===================== CV TEMPLATES (Client) =====================

  /**
   * Lay danh sach template CV dang hoat dong
   */
  async getTemplates() {
    return this.cvTemplateRepository.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lay chi tiet template CV
   */
  async getTemplateById(id: string) {
    const template = await this.cvTemplateRepository.findFirst({
      where: { id, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(
        'Không tìm thấy mẫu CV hoặc mẫu không hoạt động',
      );
    }

    return template;
  }

  // ===================== BUILDER CV =====================

  /**
   * Luu hoac cap nhat CV tu Builder
   */
  async saveCv(userId: string, dto: SaveCvDto) {
    const { id, templateId, title, cvData, renderedHtml } = dto;

    // Kiem tra template co ton tai khong
    const template = await this.cvTemplateRepository.findUnique({
      where: { id: templateId },
    });

    if (!template || !template.isActive) {
      throw new NotFoundException(
        'Không tìm thấy mẫu CV hoặc mẫu không hoạt động',
      );
    }

    if (id) {
      // Update CV da ton tai (kiem tra quyen so huu)
      const existing = await this.userCvRepository.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new NotFoundException(
          'Không tìm thấy CV Builder hoặc bạn không có quyền chỉnh sửa',
        );
      }

      return this.userCvRepository.update({
        where: { id },
        data: {
          title,
          cvData: toPrismaJson(cvData),
          renderedHtml,
          templateId,
        },
      });
    }

    // Tao moi
    return this.userCvRepository.create({
      data: {
        userId,
        templateId,
        title,
        cvData: toPrismaJson(cvData),
        renderedHtml,
      },
    });
  }

  /**
   * Lay danh sach CV Builder cua user
   */
  async getMyCvs(userId: string) {
    return this.userCvRepository.findMany({
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
   * Lay chi tiet CV Builder (kem template de render lai)
   */
  async getCvById(userId: string, id: string) {
    const cv = await this.userCvRepository.findFirst({
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
      throw new NotFoundException(
        'Không tìm thấy CV Builder hoặc bạn không có quyền truy cập',
      );
    }

    return cv;
  }

  /**
   * Lay chi tiet CV cong khai (khong can xac thuc)
   */
  async getPublicCvById(id: string) {
    const cv = await this.userCvRepository.findFirst({
      where: { id },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            htmlStructure: true,
            cssStyles: true,
          },
        },
      },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy CV');
    }

    return cv;
  }

  /**
   * Xoa CV Builder
   */
  async deleteCv(userId: string, id: string) {
    const cv = await this.userCvRepository.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundException(
        'Không tìm thấy CV Builder hoặc bạn không có quyền xoá',
      );
    }

    // Tim tat ca cac bai phan tich (CvAnalysis) cua CV nay
    const analyses = await this.cvAnalysisRepository.findMany({
      where: { cvId: id },
      select: { id: true },
    });
    const analysisIds = analyses.map((a: any) => a.id);

    // Ngat lien ket cvAnalysisId cua cac CV toi uu tro den cac bai phan tich nay
    if (analysisIds.length > 0) {
      await this.userCvRepository.updateMany({
        where: { cvAnalysisId: { in: analysisIds } },
        data: { cvAnalysisId: null },
      });
    }

    await this.userCvRepository.delete({ where: { id } });
    return { message: 'Xoá CV Builder thành công' };
  }

  /**
   * Export CV Builder ra PDF su dung Puppeteer
   */
  async exportPdf(userId: string, id: string, html?: string): Promise<Buffer> {
    const cv = await this.userCvRepository.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundException(
        'Không tìm thấy CV Builder hoặc bạn không có quyền truy cập',
      );
    }

    const finalHtml = html || cv.renderedHtml;

    if (!finalHtml) {
      throw new BadRequestException('CV chưa có nội dung HTML để xuất PDF');
    }

    // Render PDF bang Puppeteer
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

      // Luu lai renderedHtml neu co html moi duoc truyen vao
      if (html) {
        await this.userCvRepository.update({
          where: { id },
          data: { renderedHtml: html },
        });
      }

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
