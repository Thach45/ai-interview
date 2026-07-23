import { Module } from '@nestjs/common';
import { AdminTransactionController } from './admin-transaction.controller';
import { AdminTransactionService } from './admin-transaction.service';

import { TransactionRepository } from './repositories/transaction.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [AdminTransactionController],
  providers: [AdminTransactionService, TransactionRepository, UserRepository],
  exports: [AdminTransactionService],
})
export class TransactionModule {}
