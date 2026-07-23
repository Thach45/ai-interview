import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { JobCategoryModule } from './modules/job-category/job-category.module';
import { JobTemplateModule } from './modules/job-template/job-template.module';
import { CvModule } from './modules/cv-management/uploads/cv.module';
import { CvBuilderModule } from './modules/cv-management/builder/cv-builder.module';
import { CvTemplatesModule } from './modules/cv-management/templates/cv-templates.module';
import { AiModule } from './providers/ai/ai.module';
import { MailModule } from './providers/mail/mail.module';
import { CreditsModule } from './modules/credits/credits.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TtsModule } from './modules/tts/tts.module';
import { InterviewModule } from './modules/interview/interview.module';
import { AnalysisCvModule } from './modules/cv-management/analysis/analysis-cv.module';
import { QueueModule } from './providers/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 15 * 60 * 1000, limit: 1500 },
      { name: 'auth', ttl: 15 * 60 * 1000, limit: 15 },
      { name: 'otp', ttl: 3 * 60 * 1000, limit: 1 },
      { name: 'chat', ttl: 10 * 1000, limit: 3 },
      { name: 'analysis-cv', ttl: 60 * 1000, limit: 2 },
    ]),
    EventEmitterModule.forRoot({
      maxListeners: 100,
    }),
    PrismaModule,
    MailModule,
    CreditsModule,
    AiModule,
    AuthModule,
    JobCategoryModule,
    JobTemplateModule,
    CvModule,
    CvBuilderModule,
    CvTemplatesModule,
    UserModule,
    SubscriptionModule,
    TransactionModule,
    DashboardModule,
    NotificationModule,
    TtsModule,
    InterviewModule,
    AnalysisCvModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards — secure by default, bypass with @IsPublic()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
