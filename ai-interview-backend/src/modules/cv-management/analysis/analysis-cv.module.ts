import { Module } from '@nestjs/common';
import { NotificationModule } from '../../notification/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisCvController } from './analysis-cv.controller';
import { AnalysisCvService } from './analysis-cv.service';
import { CvOptimizerService } from './cv-optimizer.service';
import { AnalysisCvProcessor } from './analysis-cv.processor';
import { OptimizeCvProcessor } from './optimize-cv.processor';

import { UserCvRepository } from '../builder/cv-builder.repository';
import { CvAnalysisRepository } from './cv-analysis.repository';
import { CvTemplateRepository } from '../templates/cv-template.repository';
import { JobTemplateRepository } from '../../job-template/job-template.repository';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'analysisCvQueue' },
      { name: 'optimizeCvQueue' },
    ),
    NotificationModule,
  ],
  controllers: [AnalysisCvController],
  providers: [
    AnalysisCvService,
    CvOptimizerService,
    AnalysisCvProcessor,
    OptimizeCvProcessor,
    UserCvRepository,
    CvAnalysisRepository,
    CvTemplateRepository,
    JobTemplateRepository,
  ],
  exports: [AnalysisCvService, CvOptimizerService],
})
export class AnalysisCvModule {}
