import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { JobCategoryService } from './job-category.service';

@Controller('categories')
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  /**
   * GET /categories -> Cay danh muc 3 tang
   */
  @Get()
  async getTree() {
    return this.jobCategoryService.getTree();
  }

  /**
   * GET /categories/flat -> Danh sach phang, filter theo ?type=GROUP|INDUSTRY|POSITION & pagination
   */
  @Get('flat')
  async getAll(
    @Query('type') type?: CategoryType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const validTypes = Object.values(CategoryType);
    if (type && !validTypes.includes(type)) {
      throw new Error(`Type không hợp lệ. Phải là: ${validTypes.join(', ')}`);
    }

    return this.jobCategoryService.getAll(
      type,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  /**
   * GET /categories/:id -> Chi tiet 1 danh muc
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.jobCategoryService.getById(id);
  }
}
