import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { IsPublic } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../common/types/jwt.type';
import { SubscriptionService } from './subscription.service';
import { PurchasePackageDto } from './dto/subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * GET /subscriptions/packages - Lay danh sach goi dich vu dang hoat dong
   */
  @IsPublic()
  @Get('packages')
  async getPackages() {
    return this.subscriptionService.getPackages();
  }

  /**
   * POST /subscriptions/purchase - Tao yeu cau mua goi dich vu (sinh QR)
   */
  @Post('purchase')
  async purchasePackage(
    @Body() dto: PurchasePackageDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const paymentInfo = await this.subscriptionService.purchasePackage(
      user.id,
      dto.packageId,
    );
    return paymentInfo;
  }

  /**
   * GET /subscriptions/transactions/:id/status - Lay trang thai giao dich
   */
  @Get('transactions/:id/status')
  async getTransactionStatus(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const transaction = await this.subscriptionService.getTransactionStatus(
      user.id,
      id,
    );
    if (!transaction) {
      return { message: 'Khong tim thay giao dich chuyen khoan' };
    }
    return {
      id: transaction.id,
      status: transaction.status,
      creditsAdded: transaction.creditsAdded,
    };
  }
}
