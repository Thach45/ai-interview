import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { Role } from '@prisma/client';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { AdminJobCategoryService } from './admin-job-category.service';
import {
  CreateJobCategoryDto,
  UpdateJobCategoryDto,
} from './dto/job-category.dto';

@Controller('admin/categories')
@HasRole(Role.ADMIN)
export class AdminJobCategoryController {
  constructor(
    private readonly adminJobCategoryService: AdminJobCategoryService,
  ) {}

  /**
   * GET /admin/categories -> Cay danh muc 3 tang
   */
  @Get()
  async getTree() {
    return this.adminJobCategoryService.getTree();
  }

  /**
   * GET /admin/categories/flat -> Danh sach phang
   */
  @Get('flat')
  async getAll(
    @Query('type') type?: CategoryType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminJobCategoryService.getAll(
      type,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  /**
   * GET /admin/categories/:id -> Chi tiet 1 danh muc
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.adminJobCategoryService.getById(id);
  }

  /**
   * POST /admin/categories -> Tao moi danh muc
   */
  @Post()
  async create(@Body() dto: CreateJobCategoryDto) {
    return this.adminJobCategoryService.create(dto);
  }

  /**
   * PUT /admin/categories/:id -> Cap nhat danh muc
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateJobCategoryDto) {
    return this.adminJobCategoryService.update(id, dto);
  }

  /**
   * DELETE /admin/categories/:id -> Xoa danh muc
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminJobCategoryService.delete(id);
  }
}
