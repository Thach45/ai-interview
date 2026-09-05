import { Controller, Get, Post, Param, Body, Query, Res } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../../common/types/jwt.type';
import { AnalysisCvService } from './analysis-cv.service';
import { CvOptimizerService } from './cv-optimizer.service';
import {
  AnalyzeCvWithTemplateDto,
  AnalyzeCvWithExternalJobDto,
} from './dto/analysis-cv.dto';
import { OptimizeCvDto, ExportPdfDto } from './dto/cv-optimization.dto';

@Controller('analysis-cv')
export class AnalysisCvController {
  constructor(
    private readonly analysisCvService: AnalysisCvService,
    private readonly cvOptimizerService: CvOptimizerService,
    @InjectQueue('analysisCvQueue') private readonly analysisCvQueue: Queue,
    @InjectQueue('optimizeCvQueue') private readonly optimizeCvQueue: Queue,
  ) {}

  /**
   * POST /analysis-cv/analyze/template
   * Phân tích CV dựa trên Job Template có sẵn.
   * Đẩy tác vụ vào Queue chạy ngầm.
   */
  @Post('analyze/template')
  async analyzeCvWithTemplate(
    @CurrentUser() user: TokenPayload,
    @Body() dto: AnalyzeCvWithTemplateDto,
  ) {
    const job = await this.analysisCvQueue.add('analyze-cv-job', {
      userId: user.id,
      cvId: dto.cvId,
      jobTemplateId: dto.jobTemplateId,
    });

    return { jobId: job.id };
  }

  /**
   * POST /analysis-cv/analyze/external
   * Phân tích CV dựa trên mô tả công việc bên ngoài.
   * Đẩy tác vụ vào Queue chạy ngầm.
   */
  @Post('analyze/external')
  async analyzeCvWithExternalJob(
    @CurrentUser() user: TokenPayload,
    @Body() dto: AnalyzeCvWithExternalJobDto,
  ) {
    const job = await this.analysisCvQueue.add('analyze-cv-job', {
      userId: user.id,
      cvId: dto.cvId,
      externalJobDescription: dto.externalJobDescription,
    });

    return { jobId: job.id };
  }

  /**
   * GET /analysis-cv/result
   * Lấy kết quả phân tích CV mới nhất.
   */
  @Get('result')
  async getAnalysisCV(@CurrentUser() user: TokenPayload) {
    return this.analysisCvService.getAnalysisCV(user.id);
  }

  /**
   * GET /analysis-cv/history
   * Lấy lịch sử phân tích CV.
   */
  @Get('history')
  async getHistoryAnalysisCvResult(@CurrentUser() user: TokenPayload) {
    return this.analysisCvService.getHistoryAnalysisCvResult(user.id);
  }

  /**
   * GET /analysis-cv/:id
   * Lấy chi tiết một kết quả phân tích CV theo ID.
   */
  @Get(':id')
  async getAnalysisCvById(
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
  ) {
    return this.analysisCvService.getAnalysisCvById(id, user.id);
  }

  /**
   * POST /analysis-cv/optimize
   * Tối ưu CV dựa trên kết quả phân tích.
   * Đẩy tác vụ vào Queue chạy ngầm.
   */
  @Post('optimize')
  async optimizeCV(
    @CurrentUser() user: TokenPayload,
    @Body() dto: OptimizeCvDto,
  ) {
    const job = await this.optimizeCvQueue.add('optimize-cv-job', {
      userId: user.id,
      analysisId: dto.analysisId,
      templateId: dto.templateId,
    });

    return { jobId: job.id };
  }

  /**
   * GET /analysis-cv/optimized/:analysisId
   * Lấy CV đã tối ưu theo analysisId.
   */
  @Get('optimized/:analysisId')
  async getOptimizedCv(
    @CurrentUser() user: TokenPayload,
    @Param('analysisId') analysisId: string,
  ) {
    return this.cvOptimizerService.getOptimizedCv(user.id, analysisId);
  }

  /**
   * POST /analysis-cv/export-pdf
   * Xuất CV đã tối ưu ra PDF.
   */
  @Post('export-pdf')
  async exportPdf(
    @CurrentUser() user: TokenPayload,
    @Body() dto: ExportPdfDto,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.cvOptimizerService.exportPdf(
      user.id,
      dto.analysisId,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="CV_Optimized.pdf"',
    );
    res.send(pdfBuffer);
  }
}
