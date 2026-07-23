import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryType } from '@prisma/client';
import {
  BadRequestException,
  NotFoundException,
} from '../../common/exceptions/AppException';
import { toJobCategoryResponseDTO } from '../../common/mappers/job-category.mapper';
import {
  CreateJobCategoryDto,
  UpdateJobCategoryDto,
} from './dto/job-category.dto';
import { JobCategoryService } from './job-category.service';

import { JobCategoryRepository } from './job-category.repository';

@Injectable()
export class AdminJobCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobCategoryService: JobCategoryService,
    private readonly jobCategoryRepository: JobCategoryRepository,
  ) {}

  async getTree() {
    return this.jobCategoryService.getTree();
  }

  async getAll(type?: CategoryType, page: number = 1, limit: number = 10) {
    return this.jobCategoryService.getAll(type, page, limit);
  }

  async getById(id: string) {
    return this.jobCategoryService.getById(id);
  }

  /**
   * Tao moi danh muc
   */
  async create(dto: CreateJobCategoryDto) {
    const { name, type, parentId } = dto;

    if (parentId) {
      const parent = await this.jobCategoryRepository.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }

      if (
        type === CategoryType.INDUSTRY &&
        parent.type !== CategoryType.GROUP
      ) {
        throw new BadRequestException(
          'Ngành (INDUSTRY) phải thuộc một Nhóm nghề (GROUP)',
        );
      }

      if (
        type === CategoryType.POSITION &&
        parent.type !== CategoryType.INDUSTRY
      ) {
        throw new BadRequestException(
          'Vị trí (POSITION) phải thuộc một Ngành (INDUSTRY)',
        );
      }
    }

    const category = await this.jobCategoryRepository.create({
      data: {
        name,
        type,
        parentId: parentId ?? null,
      },
    });

    return toJobCategoryResponseDTO(category);
  }

  /**
   * Cap nhat ten danh muc
   */
  async update(id: string, dto: UpdateJobCategoryDto) {
    const existing = await this.jobCategoryRepository.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    const category = await this.jobCategoryRepository.update({
      where: { id },
      data: { name: dto.name },
    });

    return toJobCategoryResponseDTO(category);
  }

  /**
   * Xoa danh muc (tu choi neu con children)
   */
  async delete(id: string) {
    const existing = await this.jobCategoryRepository.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if ((existing as any).children.length > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục này vì còn ${(existing as any).children.length} danh mục con. Vui lòng xóa danh mục con trước.`,
      );
    }

    await this.jobCategoryRepository.delete({ where: { id } });

    return { deleted: true, id };
  }
}
