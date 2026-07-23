import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '../../common/exceptions/AppException';

import { JobTemplateRepository } from './job-template.repository';

@Injectable()
export class JobTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobTemplateRepository: JobTemplateRepository,
  ) {}

  /**
   * Lay danh sach Job Templates (client)
   */
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
    const {
      page = 1,
      limit = 10,
      search,
      categoryIds,
      location,
      employmentType,
      experienceLevel,
      isRemote,
      salaryRange,
    } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [] as any[],
    };

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (categoryIds && categoryIds.length > 0) {
      where.AND.push({
        categoryId: { in: categoryIds },
      });
    }

    if (location) {
      where.AND.push({
        location: { contains: location, mode: 'insensitive' },
      });
    }

    if (employmentType) {
      where.AND.push({ employmentType });
    }

    if (experienceLevel) {
      where.AND.push({ experienceLevel });
    }

    if (isRemote !== undefined) {
      where.AND.push({ isRemote });
    }

    if (salaryRange) {
      where.AND.push({
        salaryRange: { contains: salaryRange, mode: 'insensitive' },
      });
    }

    if (where.AND.length === 0) delete where.AND;

    const [templates, total] = await Promise.all([
      this.jobTemplateRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.jobTemplateRepository.count({ where }),
    ]);

    return {
      data: templates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lay chi tiet 1 Job Template
   */
  async getById(id: string) {
    const template = await this.jobTemplateRepository.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu JD');
    }

    return template;
  }
}
