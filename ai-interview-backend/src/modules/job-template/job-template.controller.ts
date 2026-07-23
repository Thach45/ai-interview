import { Controller, Get, Param, Query } from '@nestjs/common';
import { JobTemplateService } from './job-template.service';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { Role } from '@prisma/client';

@Controller('job-templates')
@HasRole(Role.CANDIDATE, Role.ADMIN)
export class JobTemplateController {
  constructor(private readonly jobTemplateService: JobTemplateService) {}

  /**
   * GET /job-templates -> Danh sach JD (co filter, phan trang)
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
    return this.jobTemplateService.getAll({
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
   * GET /job-templates/:id -> Chi tiet JD
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.jobTemplateService.getById(id);
  }
}
