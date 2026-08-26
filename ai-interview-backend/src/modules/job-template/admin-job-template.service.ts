import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExperienceLevel } from '@prisma/client';
import { NotFoundException } from '../../common/exceptions/AppException';
import {
  CreateJobTemplateDto,
  UpdateJobTemplateDto,
} from './dto/job-template.dto';
import { JobTemplateService } from './job-template.service';

import { JobTemplateRepository } from './job-template.repository';

@Injectable()
export class AdminJobTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobTemplateService: JobTemplateService,
    private readonly jobTemplateRepository: JobTemplateRepository,
  ) {}

  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryIds?: string[];
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
    isRemote?: boolean;
    salaryRange?: string;
  }) {
    return this.jobTemplateService.getAll(params);
  }

  async getById(id: string) {
    return this.jobTemplateService.getById(id);
  }

  /**
   * Tao moi Job Template
   */
  async create(dto: CreateJobTemplateDto) {
    return this.jobTemplateRepository.create({
      data: {
        title: dto.title,
        companyName: dto.companyName,
        companyLogo: dto.companyLogo,
        location: dto.location,
        salaryRange: dto.salaryRange,
        employmentType: dto.employmentType,
        experienceLevel: dto.experienceLevel ?? ExperienceLevel.JUNIOR,
        isRemote: dto.isRemote ?? false,
        categoryId: dto.categoryId || null,
        responsibilities: dto.responsibilities ?? '',
        requirements: dto.requirements ?? '',
        benefits: dto.benefits ?? '',
        aiExtractedContext: dto.aiExtractedContext ?? '',
        isHotJob: dto.isHotJob ?? false,
      },
    });
  }

  /**
   * Cap nhat Job Template
   */
  async update(id: string, dto: UpdateJobTemplateDto) {
    const existing = await this.jobTemplateRepository.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy mẫu JD');
    }

    return this.jobTemplateRepository.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.companyName !== undefined && { companyName: dto.companyName }),
        ...(dto.companyLogo !== undefined && { companyLogo: dto.companyLogo }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.salaryRange !== undefined && { salaryRange: dto.salaryRange }),
        ...(dto.employmentType !== undefined && {
          employmentType: dto.employmentType,
        }),
        ...(dto.experienceLevel !== undefined && {
          experienceLevel: dto.experienceLevel,
        }),
        ...(dto.isRemote !== undefined && { isRemote: dto.isRemote }),
        ...(dto.categoryId !== undefined && {
          categoryId: dto.categoryId || null,
        }),
        ...(dto.responsibilities !== undefined && {
          responsibilities: dto.responsibilities,
        }),
        ...(dto.requirements !== undefined && {
          requirements: dto.requirements,
        }),
        ...(dto.benefits !== undefined && { benefits: dto.benefits }),
        ...(dto.aiExtractedContext !== undefined && {
          aiExtractedContext: dto.aiExtractedContext,
        }),
        ...(dto.isHotJob !== undefined && { isHotJob: dto.isHotJob }),
      },
    });
  }

  /**
   * Xoa Job Template
   */
  async delete(id: string) {
    const existing = await this.jobTemplateRepository.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy mẫu JD');
    }

    await this.jobTemplateRepository.delete({ where: { id } });

    return { deleted: true, id };
  }
}
