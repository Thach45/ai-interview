import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { UserCvRepository } from '../builder/cv-builder.repository';
import { CvAnalysisRepository } from '../analysis/cv-analysis.repository';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CvController],
  providers: [CvService, UserCvRepository, CvAnalysisRepository],
  exports: [CvService],
})
export class CvModule {}
