import prisma from '../../config/prisma';
import { ExperienceLevel } from '@prisma/client';
import { NotFoundException } from '../../exceptions';

export class JobTemplateService {
  /**
   * Lấy toàn bộ danh sách Job Templates
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
    salaryRange?: string; // Sẽ xử lý theo logic range nếu cần
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
      AND: [],
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

    // Logic cho mức lương có thể phức tạp hơn nếu lưu dạng string.
    // Tạm thời nếu truyền salaryRange thì filter theo title/content hoặc match chính xác
    if (salaryRange) {
      where.AND.push({
        salaryRange: { contains: salaryRange, mode: 'insensitive' },
      });
    }

    // Nếu không có filter nào thì xóa AND để query sạch hơn
    if (where.AND.length === 0) delete where.AND;

    const [templates, total] = await Promise.all([
      prisma.jobTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.jobTemplate.count({ where }),
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
   * Lấy chi tiết 1 Job Template
   */
  async getById(id: string) {
    const template = await prisma.jobTemplate.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu JD');
    }

    return template;
  }

  /**
   * Tạo mới Job Template
   */
  async create(data: any) {
    return prisma.jobTemplate.create({
      data: {
        title: data.title,
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        location: data.location,
        salaryRange: data.salaryRange,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel as ExperienceLevel,
        isRemote: data.isRemote || false,
        categoryId: data.categoryId,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        benefits: data.benefits,
        aiExtractedContext: data.aiExtractedContext,
        isHotJob: data.isHotJob || false,
      },
    });
  }

  /**
   * Cập nhật Job Template
   */
  async update(id: string, data: any) {
    const existing = await prisma.jobTemplate.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy mẫu JD');
    }

    return prisma.jobTemplate.update({
      where: { id },
      data: {
        title: data.title,
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        location: data.location,
        salaryRange: data.salaryRange,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel as ExperienceLevel,
        isRemote: data.isRemote,
        categoryId: data.categoryId,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        benefits: data.benefits,
        aiExtractedContext: data.aiExtractedContext,
        isHotJob: data.isHotJob,
      },
    });
  }

  /**
   * Xóa Job Template
   */
  async delete(id: string) {
    const existing = await prisma.jobTemplate.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy mẫu JD');
    }

    await prisma.jobTemplate.delete({ where: { id } });

    return { deleted: true, id };
  }
}

export const jobTemplateService = new JobTemplateService();
