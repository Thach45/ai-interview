import { Module } from '@nestjs/common';
import { JobCategoryController } from './job-category.controller';
import { AdminJobCategoryController } from './admin-job-category.controller';
import { JobCategoryService } from './job-category.service';
import { AdminJobCategoryService } from './admin-job-category.service';
import { JobCategoryRepository } from './job-category.repository';

@Module({
  controllers: [JobCategoryController, AdminJobCategoryController],
  providers: [
    JobCategoryService,
    AdminJobCategoryService,
    JobCategoryRepository,
  ],
  exports: [JobCategoryService, AdminJobCategoryService, JobCategoryRepository],
})
export class JobCategoryModule {}
