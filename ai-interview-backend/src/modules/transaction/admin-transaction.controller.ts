import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { AdminTransactionService } from './admin-transaction.service';
import {
  ManualTopupDto,
  UpdateStatusDto,
  TransactionQueryDto,
} from './dto/transaction.dto';

@Controller('admin/transactions')
export class AdminTransactionController {
  constructor(
    private readonly adminTransactionService: AdminTransactionService,
  ) {}

  /**
   * GET /admin/transactions - Lay danh sach giao dich phan trang
   */
  @Get()
  async getTransactions(@Query() query: TransactionQueryDto) {
    return this.adminTransactionService.getTransactions({
      type: query.type,
      status: query.status,
      search: query.search,
      page: query.page || 1,
      limit: query.limit || 10,
    });
  }

  /**
   * GET /admin/transactions/stats - Lay cac chi so thong ke giao dich
   */
  @Get('stats')
  async getStats() {
    return this.adminTransactionService.getStats();
  }

  /**
   * POST /admin/transactions/manual - Admin cap credit thu cong
   */
  @Post('manual')
  async createManual(@Body() dto: ManualTopupDto) {
    const transaction = await this.adminTransactionService.createManual(dto);
    return transaction;
  }

  /**
   * PATCH /admin/transactions/:id/status - Cap nhat trang thai giao dich
   */
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.adminTransactionService.updateStatus(id, dto.status);
  }

  /**
   * DELETE /admin/transactions/:id - Xoa giao dich
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminTransactionService.delete(id);
  }
}
