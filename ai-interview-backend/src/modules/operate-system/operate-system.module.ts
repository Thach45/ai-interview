import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OperateSystemController } from './operate-system.controller';
import { OperateSystemService } from './operate-system.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'analysisCvQueue' },
      { name: 'optimizeCvQueue' },
      { name: 'interviewTimerQueue' },
      { name: 'interviewAnalysisQueue' },
      { name: 'emailQueue' },
      { name: 'notificationQueue' },
    ),
  ],
  controllers: [OperateSystemController],
  providers: [OperateSystemService],
})
export class OperateSystemModule {}
