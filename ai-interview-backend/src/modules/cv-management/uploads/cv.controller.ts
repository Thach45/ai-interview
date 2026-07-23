import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../../common/types/jwt.type';
import { CvService } from './cv.service';
import { HasRole } from '../../../common/decorators/has-role.decorator';
import { Role } from '@prisma/client';

@Controller('cvs')
@HasRole(Role.CANDIDATE, Role.ADMIN)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  /**
   * POST /cv/upload -> Tai CV tu file PDF/DOCX
   * Dung multer de xu ly file upload voi field name 'file'
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @CurrentUser() user: TokenPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file CV (PDF/DOCX)');
    }

    const result = await this.cvService.uploadCv(user.id, file, title);
    return result;
  }

  /**
   * GET /cv/my-cvs -> Lay danh sach CV cua user
   */
  @Get('my-cvs')
  async getMyCvs(@CurrentUser() user: TokenPayload) {
    return this.cvService.getMyCvs(user.id);
  }

  /**
   * DELETE /cv/:id -> Xoa CV
   */
  @Delete(':id')
  async deleteCv(@CurrentUser() user: TokenPayload, @Param('id') id: string) {
    return this.cvService.deleteCv(user.id, id);
  }
}
