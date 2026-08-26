import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { AdminNotificationService } from './admin-notification.service';
import { SendNotificationDto } from './dto/notification.dto';

@Controller('admin/notifications')
export class AdminNotificationController {
  constructor(
    private readonly adminNotificationService: AdminNotificationService,
  ) {}

  /**
   * GET /admin/notifications -> Danh sach thong bao toan he thong
   */
  @Get()
  async getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminNotificationService.getAllNotifications(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  /**
   * POST /admin/notifications/send -> Gui thong bao (tat ca hoac ca nhan)
   */
  @Post('send')
  async send(@Body() dto: SendNotificationDto) {
    return this.adminNotificationService.send(dto);
  }

  /**
   * DELETE /admin/notifications/:id -> Xoa thong bao
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.adminNotificationService.delete(id);
    return { message: 'Da thu hoi thong bao' };
  }
}
