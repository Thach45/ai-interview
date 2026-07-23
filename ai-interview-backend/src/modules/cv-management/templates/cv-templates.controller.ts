import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { HasRole } from '../../../common/decorators/has-role.decorator';
import { CvTemplatesService } from './cv-templates.service';
import {
  CreateCvTemplateDto,
  UpdateCvTemplateDto,
} from './dto/cv-template.dto';

@Controller('admin/cv-templates')
@HasRole(Role.ADMIN)
export class AdminCvTemplatesController {
  constructor(private readonly cvTemplatesService: CvTemplatesService) {}

  /**
   * GET /admin/cv-templates -> Danh sach CV templates
   */
  @Get()
  async getTemplates() {
    return this.cvTemplatesService.getTemplates();
  }

  /**
   * GET /admin/cv-templates/:id -> Chi tiet CV template
   */
  @Get(':id')
  async getTemplateById(@Param('id') id: string) {
    return this.cvTemplatesService.getTemplateById(id);
  }

  /**
   * POST /admin/cv-templates -> Tao moi CV template
   */
  @Post()
  async create(@Body() dto: CreateCvTemplateDto) {
    return this.cvTemplatesService.create(dto);
  }

  /**
   * PUT /admin/cv-templates/:id -> Cap nhat CV template
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCvTemplateDto) {
    return this.cvTemplatesService.update(id, dto);
  }

  /**
   * DELETE /admin/cv-templates/:id -> Xoa CV template
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.cvTemplatesService.delete(id);
  }
}
