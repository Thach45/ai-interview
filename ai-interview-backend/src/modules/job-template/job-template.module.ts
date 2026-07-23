import { Module } from '@nestjs/common';
import { JobTemplateController } from './job-template.controller';
import { AdminJobTemplateController } from './admin-job-template.controller';
import { JobTemplateService } from './job-template.service';
import { AdminJobTemplateService } from './admin-job-template.service';
import { JobTemplateRepository } from './job-template.repository';

@Module({
  controllers: [JobTemplateController, AdminJobTemplateController],
  providers: [
    JobTemplateService,
    AdminJobTemplateService,
    JobTemplateRepository,
  ],
  exports: [JobTemplateService, AdminJobTemplateService, JobTemplateRepository],
})
export class JobTemplateModule {}
