import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { InterviewController } from './interview.controller';
import { InterviewAiService } from './interview-ai.service';
import { AudioChatService } from './audio-chat.service';
import { InterviewContextService } from './interview-context.service';
import { InterviewAnalysisProcessor } from './interview-analysis.processor';
import { InterviewTimerProcessor } from './interview-timer.processor';
import { UserCvRepository } from '../cv-management/builder/cv-builder.repository';
import { JobTemplateRepository } from '../job-template/job-template.repository';
import { InterviewSessionRepository } from './repositories/interview-session.repository';
import { InterviewMessageRepository } from './repositories/interview-message.repository';
import { InterviewResultRepository } from './repositories/interview-result.repository';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'interviewTimerQueue' },
      { name: 'interviewAnalysisQueue' },
    ),
    NotificationModule,
  ],
  controllers: [InterviewController],
  providers: [
    InterviewAiService,
    AudioChatService,
    InterviewContextService,
    InterviewAnalysisProcessor,
    InterviewTimerProcessor,
    UserCvRepository,
    JobTemplateRepository,
    InterviewSessionRepository,
    InterviewMessageRepository,
    InterviewResultRepository,
  ],
  exports: [InterviewAiService],
})
export class InterviewModule {}
