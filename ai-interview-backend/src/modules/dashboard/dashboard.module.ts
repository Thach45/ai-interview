import { Module } from '@nestjs/common';
import { AdminDashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TransactionRepository } from '../transaction/repositories/transaction.repository';
import { UserRepository } from '../user/user.repository';
import { InterviewSessionRepository } from '../interview/repositories/interview-session.repository';
import { InterviewMessageRepository } from '../interview/repositories/interview-message.repository';

@Module({
  controllers: [AdminDashboardController],
  providers: [
    DashboardService,
    TransactionRepository,
    UserRepository,
    InterviewSessionRepository,
    InterviewMessageRepository,
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
