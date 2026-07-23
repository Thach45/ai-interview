import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryType } from '@prisma/client';
import { NotFoundException } from '../../common/exceptions/AppException';
import { toJobCategoryResponseDTO } from '../../common/mappers/job-category.mapper';

import { JobCategoryRepository } from './job-category.repository';

@Injectable()
export class JobCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobCategoryRepository: JobCategoryRepository,
  ) {}

  /**
   * Lay toan bo cay danh muc 3 tang:
   * GROUP -> INDUSTRY (children) -> POSITION (children)
   */
  async getTree() {
    const groups = await this.jobCategoryRepository.findMany({
      where: { type: CategoryType.GROUP },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return groups.map((item) => toJobCategoryResponseDTO(item as any));
  }

  /**
   * Lay danh sach phang (flat list), ho tro phan trang va filter
   */
  async getAll(type?: CategoryType, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.jobCategoryRepository.findMany({
        where: type ? { type } : undefined,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { parent: true },
      }),
      this.jobCategoryRepository.count({
        where: type ? { type } : undefined,
      }),
    ]);

    return {
      data: categories.map((item) => toJobCategoryResponseDTO(item as any)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lay 1 danh muc theo id
   */
  async getById(id: string) {
    const category = await this.jobCategoryRepository.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return toJobCategoryResponseDTO(category);
  }
}
