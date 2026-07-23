import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { AdminNotificationController } from './admin-notification.controller';
import { NotificationService } from './notification.service';
import { AdminNotificationService } from './admin-notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './notification.processor';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [BullModule.registerQueue({ name: 'notificationQueue' })],
  controllers: [NotificationController, AdminNotificationController],
  providers: [
    NotificationService,
    AdminNotificationService,
    NotificationProcessor,
    NotificationRepository,
  ],
  exports: [
    NotificationService,
    AdminNotificationService,
    NotificationRepository,
  ],
})
export class NotificationModule {}
