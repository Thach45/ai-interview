import { Module } from '@nestjs/common';
import { CvBuilderController } from './cv-builder.controller';
import { CvBuilderService } from './cv-builder.service';

import { UserCvRepository } from './cv-builder.repository';
import { CvAnalysisRepository } from '../analysis/cv-analysis.repository';
import { CvTemplateRepository } from '../templates/cv-template.repository';

@Module({
  controllers: [CvBuilderController],
  providers: [
    CvBuilderService,
    UserCvRepository,
    CvAnalysisRepository,
    CvTemplateRepository,
  ],
  exports: [CvBuilderService],
})
export class CvBuilderModule {}
