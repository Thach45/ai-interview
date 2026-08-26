import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { UserCvRepository } from '../builder/cv-builder.repository';
import { CvAnalysisRepository } from '../analysis/cv-analysis.repository';

@Module({
  imports: [
    MulterModule.register({
      // CvService reads the PDF and sends it to Cloudinary from file.buffer.
      // Disk storage only exposes file.path, leaving file.buffer undefined.
      storage: memoryStorage(),
    }),
  ],
  controllers: [CvController],
  providers: [CvService, UserCvRepository, CvAnalysisRepository],
  exports: [CvService],
})
export class CvModule {}
