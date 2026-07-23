import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: 'emailQueue' })],
  providers: [MailService, EmailProcessor],
  exports: [MailService],
})
export class MailModule {}
