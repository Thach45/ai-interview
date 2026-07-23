import { Module } from '@nestjs/common';
import { AdminCvTemplatesController } from './cv-templates.controller';
import { CvTemplatesService } from './cv-templates.service';
import { CvTemplateRepository } from './cv-template.repository';

@Module({
  controllers: [AdminCvTemplatesController],
  providers: [CvTemplatesService, CvTemplateRepository],
  exports: [CvTemplatesService],
})
export class CvTemplatesModule {}
