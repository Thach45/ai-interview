import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { AdminSubscriptionController } from './admin-subscription.controller';

import { SubscriptionPackageRepository } from './repositories/subscription-package.repository';
import { TransactionRepository } from '../transaction/repositories/transaction.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [SubscriptionController, AdminSubscriptionController],
  providers: [
    SubscriptionService,
    SubscriptionPackageRepository,
    TransactionRepository,
    UserRepository,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
