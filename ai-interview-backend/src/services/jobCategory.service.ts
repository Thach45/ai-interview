import prisma from '../config/prisma';
import { CategoryType } from '@prisma/client';
import { BadRequestException, NotFoundException } from '../exceptions';

export class JobCategoryService {
  /**
   * Lấy toàn bộ cây danh mục 3 tầng:
   * GROUP → INDUSTRY (children) → POSITION (children)
   */
  async getTree() {
    const groups = await prisma.jobCategory.findMany({
      where: { type: CategoryType.GROUP },
      include: {
        children: {
          include: {
            children: true, // POSITION
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return groups;
  }

  /**
   * Lấy danh sách phẳng (flat list), hỗ trợ phân trang và filter
   */
  async getAll(type?: CategoryType, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.jobCategory.findMany({
        where: type ? { type } : undefined,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { parent: true },
      }),
      prisma.jobCategory.count({
        where: type ? { type } : undefined,
      }),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy 1 danh mục theo id
   */
  async getById(id: string) {
    const category = await prisma.jobCategory.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  /**
   * Tạo mới danh mục
   * Validate: parent phải đúng tầng theo CategoryType
   */
  async create(data: { name: string; type: CategoryType; parentId?: string }) {
    const { name, type, parentId } = data;

    // Validate parent type phù hợp với type con
    if (parentId) {
      const parent = await prisma.jobCategory.findUnique({ where: { id: parentId } });

      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }

      // INDUSTRY phải có parent là GROUP
      if (type === CategoryType.INDUSTRY && parent.type !== CategoryType.GROUP) {
        throw new BadRequestException('Ngành (INDUSTRY) phải thuộc một Nhóm nghề (GROUP)');
      }

      // POSITION phải có parent là INDUSTRY
      if (type === CategoryType.POSITION && parent.type !== CategoryType.INDUSTRY) {
        throw new BadRequestException('Vị trí (POSITION) phải thuộc một Ngành (INDUSTRY)');
      }
    }

    return prisma.jobCategory.create({
      data: {
        name,
        type,
        parentId: parentId ?? null,
      },
    });
  }

  /**
   * Cập nhật tên danh mục (không cho phép đổi type hoặc parentId)
   */
  async update(id: string, data: { name: string }) {
    const existing = await prisma.jobCategory.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return prisma.jobCategory.update({
      where: { id },
      data: { name: data.name },
    });
  }

  /**
   * Xóa danh mục — từ chối nếu còn children
   */
  async delete(id: string) {
    const existing = await prisma.jobCategory.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (existing.children.length > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục này vì còn ${existing.children.length} danh mục con. Vui lòng xóa danh mục con trước.`,
      );
    }

    await prisma.jobCategory.delete({ where: { id } });

    return { deleted: true, id };
  }
}

export const jobCategoryService = new JobCategoryService();
