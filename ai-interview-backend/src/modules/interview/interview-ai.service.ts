import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  InterviewLanguage,
  InterviewPersona,
  QuestionEvaluation,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../../providers/ai/ai.service';
import { GoogleTtsService } from '../../providers/ai/google-tts.service';
import { CreditsService } from '../credits/credits.service';
import { SetupInterviewDto } from './dto/interview.dto';
import {
  toPrismaJson,
  validateJsonb,
} from '../../common/validation/jsonb-validation.util';
import {
  CriterionMatchesJsonDto,
  GeneralEvaluationJsonDto,
} from '../../common/validation/jsonb.dto';

import { UserCvRepository } from '../cv-management/builder/cv-builder.repository';
import { JobTemplateRepository } from '../job-template/job-template.repository';
import { InterviewSessionRepository } from './repositories/interview-session.repository';
import { InterviewMessageRepository } from './repositories/interview-message.repository';
import { InterviewResultRepository } from './repositories/interview-result.repository';
import { InterviewContextService } from './interview-context.service';

@Injectable()
export class InterviewAiService {
  private readonly logger = new Logger(InterviewAiService.name);
  private readonly creditPricePerInterview: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly userCvRepository: UserCvRepository,
    private readonly jobTemplateRepository: JobTemplateRepository,
    private readonly interviewSessionRepository: InterviewSessionRepository,
    private readonly interviewMessageRepository: InterviewMessageRepository,
    private readonly interviewResultRepository: InterviewResultRepository,
    private readonly aiService: AiService,
    private readonly googleTtsService: GoogleTtsService,
    private readonly creditsService: CreditsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly interviewContextService: InterviewContextService,
    configService: ConfigService,
    @InjectQueue('interviewTimerQueue')
    private readonly interviewTimerQueue: Queue,
    @InjectQueue('interviewAnalysisQueue')
    private readonly interviewAnalysisQueue: Queue,
  ) {
    this.creditPricePerInterview = parseInt(
      configService.get<string>('CREDIT_PRICE_PER_INTERVIEW') || '1',
      10,
    );
  }

  /**
   * Setup a new interview session with credit check + AI question generation in a Prisma transaction.
   * 1. Validates user credits
   * 2. Fetches CV content
   * 3. Fetches JD (from template or custom text)
   * 4. Generates core questions via AI
   * 5. Deducts credit + creates session in a transaction
   */
  async setupInterview(userId: string, dto: SetupInterviewDto) {
    // 1. Check user credits balance
    await this.creditsService.checkCredits(
      userId,
      this.creditPricePerInterview,
    );

    // 2. Fetch CV data for AI context
    const cv = await this.userCvRepository.findUnique({
      where: { id: dto.cvId, userId },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy hồ sơ CV tương ứng');
    }

    // 3. Fetch JD from template or use custom text
    let jdText: string;
    if (dto.jobTemplateId) {
      const template = await this.jobTemplateRepository.findUnique({
        where: { id: dto.jobTemplateId },
      });
      if (!template) {
        throw new NotFoundException('Không tìm thấy mẫu mô tả công việc');
      }
      jdText = template.aiExtractedContext;
    } else {
      jdText = dto.customJdText || '';
    }

    // 4. Generate core questions via AI
    const cvText = await this.interviewContextService.getValidatedCvText(
      cv.cvData,
    );
    const coreQuestions = await this.aiService.createQuestionForInterview({
      cvText,
      jdText,
      position: dto.jobTitle,
      companyName: dto.companyName,
      level: dto.level,
      language: dto.language,
      difficulty: dto.difficulty,
      focusSkills: dto.focusSkills || [],
      persona: dto.persona,
      duration: dto.duration,
    });
    // 5. Deduct credit + create session in a single Prisma transaction
    const session = await this.prisma.$transaction(async (tx) => {
      await this.creditsService.decrementCredits(
        userId,
        this.creditPricePerInterview,
        tx,
      );

      return this.interviewSessionRepository.create(
        {
          data: {
            userId,
            cvId: dto.cvId,
            jobTemplateId: dto.jobTemplateId || null,
            customJdText: dto.customJdText || null,
            level: dto.level,
            persona: dto.persona,
            language: dto.language,
            difficulty: dto.difficulty,
            duration: dto.duration,
            focusSkills: dto.focusSkills || [],
            companyName: dto.companyName || null,
            jobTitle: dto.jobTitle,
            coreQuestions: toPrismaJson(coreQuestions),
          },
        },
        tx,
      );
    });

    return session;
  }

  /**
   * Get interview session detail with messages.
   */
  async getInterview(sessionId: string, userId: string) {
    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const coreQuestions =
      await this.interviewContextService.getValidatedCoreQuestions(
        session.coreQuestions,
      );
    return { ...session, coreQuestions };
  }

  /**
   * Get interview messages history.
   */
  async getInterviewMessages(sessionId: string, userId: string) {
    await this.getInterview(sessionId, userId);

    const messages = await this.interviewMessageRepository.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  /**
   * Idempotent start: generate greeting + first question via AI, schedule timer queue.
   * If messages already exist, returns them immediately.
   */
  async startInterview(sessionId: string, userId: string) {
    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId, userId },
      include: {
        cv: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    // Idempotent: return existing messages
    if ((session as any).messages.length > 0) {
      return (session as any).messages;
    }

    // Resolve JD text
    let jdText: string;
    if (session.jobTemplateId) {
      const template = await this.jobTemplateRepository.findUnique({
        where: { id: session.jobTemplateId },
      });
      jdText = template?.aiExtractedContext || '';
    } else {
      jdText = session.customJdText || '';
    }

    const cvText = await this.interviewContextService.getValidatedCvText(
      (session as any).cv?.cvData,
    );
    const coreQuestions =
      await this.interviewContextService.getValidatedCoreQuestions(
        session.coreQuestions,
      );

    // Generate greeting + first question via AI
    const aiResponse = await this.aiService.chatInterview({
      cvText,
      jdText,
      position: session.jobTitle,
      level: session.level,
      language: session.language,
      persona: session.persona,
      currentQuestion: coreQuestions[0],
      nextQuestion: coreQuestions[1] || null,
      currentQuestionIndex: 1,
      totalQuestions: coreQuestions.length,
      chatHistory: [],
      userResponse:
        '[BẮT ĐẦU PHỎNG VẤN] Tôi đã sẵn sàng, hãy bắt đầu buổi phỏng vấn!',
    });

    // Save welcome message
    const welcomeMessage = await this.interviewMessageRepository.create({
      data: {
        sessionId,
        role: 'AI',
        content: aiResponse.reply,
        questionIndex: 0,
        isFollowUp: false,
      },
    });

    // Update session status to IN_PROGRESS
    await this.interviewSessionRepository.update({
      where: { id: sessionId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    // Schedule timeout timer
    const delayMs = session.duration * 60 * 1000;
    await this.interviewTimerQueue.add(
      'timeout_check',
      { sessionId, userId },
      {
        delay: delayMs,
        jobId: `timeout_${sessionId}`,
      },
    );

    return [welcomeMessage];
  }

  /**
   * Submit interview for evaluation. Triggers the analysis queue.
   */
  async submitInterview(sessionId: string, userId: string) {
    return this.initiateInterviewEvaluation(userId, sessionId);
  }

  /**
   * Initiate evaluation: set status to EVALUATING, cancel timer, push to analysis queue.
   */
  async initiateInterviewEvaluation(userId: string, sessionId: string) {
    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    // Already completed or evaluating — skip
    if (session.status === 'COMPLETED' || session.status === 'EVALUATING') {
      return { status: session.status };
    }

    // 1. Update status to EVALUATING
    await this.interviewSessionRepository.update({
      where: { id: sessionId },
      data: { status: 'EVALUATING' },
    });

    // 2. Cancel the timeout timer
    const jobId = `timeout_${sessionId}`;
    try {
      await this.interviewTimerQueue.remove(jobId);
      this.logger.log(
        `[Timer] Đã hủy hẹn giờ cho session ${sessionId} để chuyển sang chấm điểm.`,
      );
    } catch (error) {
      this.logger.log(
        `[Timer] Không có job hẹn giờ ${jobId} hoặc lỗi khi hủy: ${error}`,
      );
    }

    // 3. Push evaluation job to analysis queue
    await this.interviewAnalysisQueue.add(
      'analysis',
      { sessionId, userId },
      { jobId: `analysis_${sessionId}` },
    );

    // 4. Emit update event for SSE
    this.eventEmitter.emit(`chat_updated_${userId}_${sessionId}`);

    return { status: 'EVALUATING' };
  }

  /**
   * Get interview evaluation result.
   */
  async getInterviewResult(sessionId: string, userId: string) {
    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const result = await this.interviewResultRepository.findUnique({
      where: { sessionId },
      include: {
        session: {
          select: {
            coreQuestions: true,
          },
        },
        questionEvaluations: {
          orderBy: { questionIndex: 'asc' },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(
        'Chưa có báo cáo kết quả cho phiên phỏng vấn này',
      );
    }

    const resultWithDetails = result as typeof result & {
      session: { coreQuestions: unknown };
      questionEvaluations: QuestionEvaluation[];
    };

    const generalEvaluation = await validateJsonb(
      GeneralEvaluationJsonDto,
      resultWithDetails.generalEvaluation,
      'Đánh giá tổng quan trong database',
    );
    const coreQuestions =
      await this.interviewContextService.getValidatedCoreQuestions(
        resultWithDetails.session.coreQuestions,
      );
    const questionEvaluations = await Promise.all(
      resultWithDetails.questionEvaluations.map(async (evaluation) => {
        const criteriaMatches = await validateJsonb(
          CriterionMatchesJsonDto,
          { matches: evaluation.criteriaMatches },
          'Chi tiết tiêu chí chấm điểm trong database',
        );
        return { ...evaluation, criteriaMatches: criteriaMatches.matches };
      }),
    );

    return {
      ...resultWithDetails,
      generalEvaluation,
      session: { ...resultWithDetails.session, coreQuestions },
      questionEvaluations,
    };
  }

  /**
   * Submit interview result — called by the analysis queue processor.
   * Calls AI evaluation, saves result with upsert, updates status to COMPLETED.
   */
  async submitInterviewResult(userId: string, sessionId: string) {
    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId, userId },
      include: { cv: true },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const allMessages = await this.interviewMessageRepository.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    const chatHistory = allMessages.map((msg: any) => ({
      role: msg.role === 'AI' ? ('bot' as const) : ('user' as const),
      content: msg.content,
    }));

    let jdText: string;
    if (session.jobTemplateId) {
      const template = await this.jobTemplateRepository.findUnique({
        where: { id: session.jobTemplateId },
      });
      jdText = template?.aiExtractedContext || '';
    } else {
      jdText = session.customJdText || '';
    }

    const cvText = await this.interviewContextService.getValidatedCvText(
      (session as any).cv?.cvData,
    );
    const coreQuestions =
      await this.interviewContextService.getValidatedCoreQuestions(
        session.coreQuestions,
      );

    const interviewResult = await this.aiService.submitInterviewResult({
      cvText,
      jdText,
      position: session.jobTitle,
      level: session.level,
      language: session.language,
      persona: session.persona,
      chatHistory,
      coreQuestions,
    });

    // Save result using upsert to handle double-submit gracefully
    const savedResult = await this.interviewResultRepository.upsert({
      where: { sessionId },
      update: {
        generalEvaluation: interviewResult.generalEvaluation,
        overallScore: interviewResult.generalEvaluation.overall.score,
        recommendation: interviewResult.recommendation,
        summary: interviewResult.summary,
        strengths: interviewResult.strengths,
        weaknesses: interviewResult.weaknesses,
        learningPath: interviewResult.learningPath,
      },
      create: {
        sessionId,
        generalEvaluation: interviewResult.generalEvaluation,
        overallScore: interviewResult.generalEvaluation.overall.score,
        recommendation: interviewResult.recommendation,
        summary: interviewResult.summary,
        strengths: interviewResult.strengths,
        weaknesses: interviewResult.weaknesses,
        learningPath: interviewResult.learningPath,
        questionEvaluations: {
          create: interviewResult.questionEvaluations.map((q: any) => ({
            questionIndex: q.questionIndex,
            questionTitle: q.questionTitle,
            feedback: q.feedback,
            score: q.score,
            criteriaMatches:
              q.criteriaMatches?.map((c: any) => ({
                criterionId: c.criterionId,
                partialCredit: c.partialCredit,
                evidence: c.evidence,
              })) || [],
          })),
        },
      },
      include: {
        questionEvaluations: true,
      },
    });

    // Update session status to COMPLETED
    await this.interviewSessionRepository.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });

    return savedResult;
  }

  /**
   * Synthesize TTS audio for a given text.
   */
  async synthesizeTTS(sessionId: string, text: string) {
    const t0 = Date.now();

    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const language = session.language || InterviewLanguage.VIETNAMESE;
    const persona = session.persona || InterviewPersona.PROFESSIONAL;

    const audioResponse = await this.googleTtsService.synthesizeSpeech(
      text,
      language,
      persona,
    );

    this.logger.log(
      `[TIMING] session=${sessionId} tts=${Date.now() - t0}ms chars=${text.length}`,
    );

    return {
      audioBase64: audioResponse.toString('base64'),
    };
  }
}
