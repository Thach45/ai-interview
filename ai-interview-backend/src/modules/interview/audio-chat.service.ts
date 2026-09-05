import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InterviewLanguage } from '@prisma/client';
import { AiService } from '../../providers/ai/ai.service';
import { OpenRouterSttService } from '../../providers/ai/openrouter-stt.service';
import { GroqSttService } from '../../providers/ai/groq-stt.service';
import { JobTemplateRepository } from '../job-template/job-template.repository';
import { InterviewSessionRepository } from './repositories/interview-session.repository';
import { InterviewMessageRepository } from './repositories/interview-message.repository';
import { InterviewContextService } from './interview-context.service';
import { InterviewAiService } from './interview-ai.service';

const CHAT_HISTORY_WINDOW_SIZE = 8;

@Injectable()
export class AudioChatService {
  private readonly logger = new Logger(AudioChatService.name);

  constructor(
    private readonly jobTemplateRepository: JobTemplateRepository,
    private readonly interviewSessionRepository: InterviewSessionRepository,
    private readonly interviewMessageRepository: InterviewMessageRepository,
    private readonly aiService: AiService,
    private readonly groqSttService: GroqSttService,
    private readonly openRouterSttService: OpenRouterSttService,
    private readonly eventEmitter: EventEmitter2,
    private readonly interviewContextService: InterviewContextService,
    private readonly interviewAiService: InterviewAiService,
  ) {}

  /**
   * Nhận file audio ghi âm trọn lượt nói, chuyển thành text qua Groq Whisper
   * (fallback sang OpenRouter nếu Groq lỗi) rồi đưa vào pipeline chat chung.
   */
  async processAudio(
    sessionId: string,
    userId: string,
    audioBuffer: Buffer,
    mimeType: string,
  ) {
    const t0 = Date.now();

    const session = await this.interviewSessionRepository.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const prompt = this.buildSttPrompt(session);
    const transcript = await this.transcribeWithFallback(
      audioBuffer,
      mimeType,
      session.language,
      prompt,
    );

    const t1 = Date.now();

    if (!transcript.trim()) {
      throw new BadRequestException(
        'Không nhận diện được giọng nói, vui lòng thử lại',
      );
    }

    this.logger.log(
      `[TIMING] session=${sessionId} stt=${t1 - t0}ms transcript=${JSON.stringify(transcript)}`,
    );

    const responseAI = await this.generateMessage(
      userId,
      session,
      transcript,
      true,
    );

    const t2 = Date.now();

    this.logger.log(
      `[TIMING] session=${sessionId} stt=${t1 - t0}ms llm=${t2 - t1}ms total=${t2 - t0}ms`,
    );

    return {
      ...responseAI,
      userText: transcript,
    };
  }

  /**
   * Groq host Whisper trên phần cứng riêng nên nhanh và ổn định hơn hẳn
   * OpenRouter (đo thực tế: ~0.8s so với 7-48s). Chỉ rơi về OpenRouter
   * khi Groq gặp sự cố (rate limit, downtime...).
   */
  private async transcribeWithFallback(
    audioBuffer: Buffer,
    mimeType: string,
    language: InterviewLanguage,
    prompt?: string,
  ): Promise<string> {
    try {
      return await this.groqSttService.transcribeAudio(
        audioBuffer,
        mimeType,
        language,
        prompt,
      );
    } catch (error) {
      this.logger.warn(
        `Groq STT lỗi, fallback sang OpenRouter: ${error instanceof Error ? error.message : error}`,
      );
      return this.openRouterSttService.transcribeAudio(
        audioBuffer,
        mimeType,
        language,
        prompt,
      );
    }
  }

  public buildSttPrompt(session: {
    jobTitle: string;
    focusSkills: string[];
    coreQuestions: unknown;
  }): string {
    const questionTitles = Array.isArray(session.coreQuestions)
      ? session.coreQuestions
          .map((question) =>
            typeof question === 'object' &&
            question !== null &&
            'title' in question
              ? String(question.title)
              : '',
          )
          .filter(Boolean)
      : [];

    const context = [
      `Interview role: ${session.jobTitle}.`,
      session.focusSkills.length
        ? `Focus skills: ${session.focusSkills.join(', ')}.`
        : '',
      questionTitles.length
        ? `Question topics: ${questionTitles.join('; ')}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return context.slice(0, 600);
  }

  /**
   * Core message generation logic used by audio chat.
   * 1. Save user message
   * 2. Build sliding window chat history (last 8 messages)
   * 3. Call AI with streaming callback for SSE
   * 4. Determine next question index / status transition
   * 5. Save AI response
   * 6. Update session status if transitioning
   * 7. Emit SSE events
   */
  private async generateMessage(
    userId: string,
    session: any,
    messageContent: string,
    enableStream: boolean = true,
  ) {
    const sessionId = session.id;

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException(
        'Phiên phỏng vấn hiện không trong trạng thái hoạt động',
      );
    }

    // 1. Save user message
    await this.interviewMessageRepository.create({
      data: {
        sessionId,
        role: 'USER',
        content: messageContent,
      },
    });

    // 2. Get full message history for sliding window
    const allMessages = await this.interviewMessageRepository.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    // Sliding window: last 8 messages excluding the current user message
    const chatHistory = allMessages
      .slice(0, -1)
      .slice(-CHAT_HISTORY_WINDOW_SIZE)
      .map((msg: any) => ({
        role: msg.role === 'AI' ? ('bot' as const) : ('user' as const),
        content: msg.content,
      }));

    // Determine current question index
    const aiMainMessages = allMessages.filter(
      (m: any) => m.role === 'AI' && !m.isFollowUp,
    );
    const currIdx = Math.max(0, aiMainMessages.length - 1);

    const coreQuestions =
      await this.interviewContextService.getValidatedCoreQuestions(
        session.coreQuestions,
      );

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
      session.cv?.cvData,
    );

    // Stream callback for SSE
    const onStream = enableStream
      ? (chunkText: string) => {
          this.eventEmitter.emit(
            `chat_stream_${userId}_${sessionId}`,
            chunkText,
          );
        }
      : undefined;

    // 3. Call AI for response
    const aiResponse = await this.aiService.chatInterview(
      {
        cvText,
        jdText,
        position: session.jobTitle,
        level: session.level,
        language: session.language,
        persona: session.persona,
        currentQuestion: coreQuestions[currIdx],
        nextQuestion: coreQuestions[currIdx + 1] || null,
        currentQuestionIndex: currIdx + 1,
        totalQuestions: coreQuestions.length,
        chatHistory,
        userResponse: messageContent,
      },
      onStream,
    );

    // 4. Calculate next question index and status
    let nextQuestionIndex = currIdx;
    let nextIsFollowUp = true;
    let newStatus = session.status;

    if (aiResponse.suggestedAction === 'TRANSITION') {
      if (currIdx + 1 < coreQuestions.length) {
        nextQuestionIndex = currIdx + 1;
        nextIsFollowUp = false;
      } else {
        newStatus = 'EVALUATING';
      }
    } else if (aiResponse.suggestedAction === 'FINISH') {
      newStatus = 'EVALUATING';
    }

    // 5. Save AI message
    const botMessage = await this.interviewMessageRepository.create({
      data: {
        sessionId,
        role: 'AI',
        content: aiResponse.reply,
        questionIndex: nextQuestionIndex,
        isFollowUp: nextIsFollowUp,
      },
    });

    // 6. Update session status if changed
    if (newStatus !== session.status) {
      if (newStatus === 'EVALUATING') {
        await this.interviewAiService.initiateInterviewEvaluation(
          userId,
          sessionId,
        );
      } else {
        await this.interviewSessionRepository.update({
          where: { id: sessionId },
          data: { status: newStatus },
        });
      }
    }

    // 7. Emit SSE update event
    this.eventEmitter.emit(`chat_updated_${userId}_${sessionId}`);

    return {
      message: botMessage,
      currentQuestionIndex: nextQuestionIndex,
      status: newStatus,
    };
  }
}
