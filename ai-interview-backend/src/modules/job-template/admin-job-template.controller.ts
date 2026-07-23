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
import { Role } from '@prisma/client';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { AdminJobTemplateService } from './admin-job-template.service';
import {
  CreateJobTemplateDto,
  UpdateJobTemplateDto,
} from './dto/job-template.dto';

@Controller('admin/job-templates')
@HasRole(Role.ADMIN)
export class AdminJobTemplateController {
  constructor(
    private readonly adminJobTemplateService: AdminJobTemplateService,
  ) {}

  /**
   * GET /admin/job-templates -> Danh sach JD
   */
  @Get()
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryIds') categoryIds?: string[],
    @Query('location') location?: string,
    @Query('employmentType') employmentType?: string,
    @Query('experienceLevel') experienceLevel?: string,
    @Query('isRemote') isRemote?: string,
    @Query('salaryRange') salaryRange?: string,
  ) {
    return this.adminJobTemplateService.getAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      categoryIds,
      location,
      employmentType,
      experienceLevel,
      isRemote:
        isRemote === 'true' ? true : isRemote === 'false' ? false : undefined,
      salaryRange,
    });
  }

  /**
   * GET /admin/job-templates/:id -> Chi tiet JD
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.adminJobTemplateService.getById(id);
  }

  /**
   * POST /admin/job-templates -> Tao moi JD
   */
  @Post()
  async create(@Body() dto: CreateJobTemplateDto) {
    return this.adminJobTemplateService.create(dto);
  }

  /**
   * PUT /admin/job-templates/:id -> Cap nhat JD
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateJobTemplateDto) {
    return this.adminJobTemplateService.update(id, dto);
  }

  /**
   * DELETE /admin/job-templates/:id -> Xoa JD
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminJobTemplateService.delete(id);
  }
}
