import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../../common/types/jwt.type';
import { CvBuilderService } from './cv-builder.service';
import { SaveCvDto, ExportPdfDto } from './dto/cv-builder.dto';
import { HasRole } from '../../../common/decorators/has-role.decorator';
import { IsPublic } from '../../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@Controller('cv-builder')
@HasRole(Role.CANDIDATE, Role.ADMIN)
export class CvBuilderController {
  constructor(private readonly cvBuilderService: CvBuilderService) {}

  // ===================== CV TEMPLATES (Client) =====================

  /**
   * GET /cv-builder/templates -> Danh sach template CV
   */
  @Get('templates')
  async getTemplates() {
    return this.cvBuilderService.getTemplates();
  }

  /**
   * GET /cv-builder/templates/:id -> Chi tiet template CV
   */
  @Get('templates/:id')
  async getTemplateById(@Param('id') id: string) {
    return this.cvBuilderService.getTemplateById(id);
  }

  // ===================== BUILDER CV =====================

  /**
   * GET /cv-builder -> Danh sach CV Builder cua user
   */
  @Get()
  async getMyCvs(@CurrentUser() user: TokenPayload) {
    return this.cvBuilderService.getMyCvs(user.id);
  }

  /**
   * GET /cv-builder/:id -> Chi tiet CV Builder
   */
  @Get(':id')
  async getCvById(@CurrentUser() user: TokenPayload, @Param('id') id: string) {
    return this.cvBuilderService.getCvById(user.id, id);
  }

  /**
   * GET /cv-builder/public/:id -> Chi tiet CV Builder (Public)
   */
  @Get('public/:id')
  @IsPublic()
  async getPublicCvById(@Param('id') id: string) {
    return this.cvBuilderService.getPublicCvById(id);
  }

  /**
   * POST /cv-builder -> Tao moi CV Builder
   */
  @Post()
  async saveCv(@CurrentUser() user: TokenPayload, @Body() dto: SaveCvDto) {
    const result = await this.cvBuilderService.saveCv(user.id, dto);

    return result;
  }

  /**
   * PUT /cv-builder/:id -> Cap nhat CV Builder
   */
  @Put(':id')
  async updateCv(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
    @Body() dto: SaveCvDto,
  ) {
    const result = await this.cvBuilderService.saveCv(user.id, {
      ...dto,
      id,
    });

    return result;
  }

  /**
   * DELETE /cv-builder/:id -> Xoa CV Builder
   */
  @Delete(':id')
  async deleteCv(@CurrentUser() user: TokenPayload, @Param('id') id: string) {
    return this.cvBuilderService.deleteCv(user.id, id);
  }

  /**
   * POST /cv-builder/:id/export-pdf -> Export CV ra PDF
   */
  @Post(':id/export-pdf')
  async exportPdf(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
    @Body() dto: ExportPdfDto,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.cvBuilderService.exportPdf(
      user.id,
      id,
      dto.html,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cv-builder-${id}.pdf"`,
    );
    res.send(pdfBuffer);
  }
}
