import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '../../../common/exceptions/AppException';
import {
  CreateCvTemplateDto,
  UpdateCvTemplateDto,
} from './dto/cv-template.dto';

import { CvTemplateRepository } from './cv-template.repository';

@Injectable()
export class CvTemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cvTemplateRepository: CvTemplateRepository,
  ) {}

  /**
   * Lay danh sach tat ca CV templates (admin: bao gom ca khong active)
   */
  async getTemplates() {
    return this.cvTemplateRepository.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lay chi tiet CV template
   */
  async getTemplateById(id: string) {
    const template = await this.cvTemplateRepository.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy template');
    }

    return template;
  }

  /**
   * Tao moi CV template
   */
  async create(dto: CreateCvTemplateDto) {
    return this.cvTemplateRepository.create({
      data: {
        name: dto.name,
        thumbnailUrl: dto.thumbnailUrl ?? '',
        htmlStructure: dto.htmlStructure ?? '',
        cssStyles: dto.cssStyles,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  /**
   * Cap nhat CV template
   */
  async update(id: string, dto: UpdateCvTemplateDto) {
    const existing = await this.cvTemplateRepository.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy template để cập nhật');
    }

    return this.cvTemplateRepository.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.thumbnailUrl !== undefined && {
          thumbnailUrl: dto.thumbnailUrl,
        }),
        ...(dto.htmlStructure !== undefined && {
          htmlStructure: dto.htmlStructure,
        }),
        ...(dto.cssStyles !== undefined && { cssStyles: dto.cssStyles }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  /**
   * Xoa CV template
   */
  async delete(id: string) {
    const existing = await this.cvTemplateRepository.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy template để xóa');
    }

    await this.cvTemplateRepository.delete({
      where: { id },
    });

    return { message: 'Xóa template thành công' };
  }
}
