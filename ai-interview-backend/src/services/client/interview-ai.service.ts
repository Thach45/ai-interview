import {
  InterviewLanguage,
  InterviewPersona,
  InterviewSession,
  PrismaClient,
} from '@prisma/client';
import prisma from '../../config/prisma';

import { SetupInterviewBody } from '../../validations/interview-ai.validation';
import { AiService, aiService } from '../core/ai.service';
import { BadRequestException, NotFoundException } from '../../exceptions';
import { creditsService } from '../../shared/services/credits.service';
import { googleTtsService, GoogleTtsService } from '../core/google-tts.service';
import { eventEmitter } from '../../utils/eventEmitter';

const CHAT_HISTORY_WINDOW_SIZE = 8;
const CREDIT_PRICE_PER_INTERVIEW = Number(process.env.CREDIT_PRICE_PER_INTERVIEW);

export class InterviewAiService {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly aiService: AiService,
    private readonly googleTtsService: GoogleTtsService,
  ) {}

  /**
   * Tạo phiên phỏng vấn mới (Interview Session)
   * 1. Xác thực người dùng và kiểm tra số dư credit
   * 2. Lấy dữ liệu CV và mô tả công việc (JD)
   * 3. Sinh câu hỏi cốt lõi (Core Questions) có cấu trúc bằng Gemini AI
   * 4. Khấu trừ 1 credit của người dùng và tạo phiên trong DB thông qua Transaction
   */
  async createInterviewSession(userId: string, body: SetupInterviewBody) {
    // 1. Kiểm tra số dư lượt phỏng vấn (creditsBalance) của user bằng Shared Service
    await creditsService.checkCredits(userId, CREDIT_PRICE_PER_INTERVIEW);

    // 2. Lấy nội dung CV để làm ngữ cảnh cho AI
    const cv = await this.prismaClient.userCv.findUnique({
      where: { id: body.cvId },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy hồ sơ CV tương ứng');
    }

    // 3. Lấy nội dung JD (Job Description) từ Template hoặc Custom Text tự điền
    let jdText: string;
    if (body.jobDescriptionId) {
      const template = await this.prismaClient.jobTemplate.findUnique({
        where: { id: body.jobDescriptionId },
      });
      if (!template) {
        throw new NotFoundException('Không tìm thấy mẫu mô tả công việc');
      }
      jdText = template.aiExtractedContext;
    } else {
      jdText = body.customJdText || '';
    }

    // 4. Gọi Gemini AI thông qua AiService để tạo sẵn danh sách câu hỏi chính có cấu trúc (Core Questions)
    const coreQuestions = await aiService.createQuestionForInterview({
      cvText: cv.contentExtracted,
      jdText: jdText,
      position: body.position,
      companyName: body.nameCompany,
      level: body.level,
      language: body.language,
      difficulty: body.difficulty,
      focusSkills: body.focusSkills,
      persona: body.persona,
      duration: body.duration,
    });

    // 5. Thực hiện Transaction: Trừ 1 credit của user và lưu phiên phỏng vấn mới vào DB
    const session = await this.prismaClient.$transaction(async (tx) => {
      // Gọi shared service để trừ 1 credit, truyền tx client vào
      await creditsService.decrementCredits(userId, CREDIT_PRICE_PER_INTERVIEW, tx);

      // Tạo interview session mới
      return tx.interviewSession.create({
        data: {
          userId,
          cvId: body.cvId,
          jobTemplateId: body.jobDescriptionId || null,
          customJdText: body.customJdText || null,
          mode: body.mode,
          level: body.level,
          persona: body.persona,
          language: body.language,
          difficulty: body.difficulty,
          duration: body.duration,
          focusSkills: body.focusSkills,
          companyName: body.nameCompany || null,
          jobTitle: body.position,
          coreQuestions: coreQuestions,
        },
      });
    });

    return session;
  }

  async getInterviewSession(userId: string, sessionId: string): Promise<InterviewSession> {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { userId, id: sessionId },
    });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }
    return session;
  }

  async getInterviewMessages(userId: string, sessionId: string) {
    // Đảm bảo user có quyền xem phiên này
    await this.getInterviewSession(userId, sessionId);

    // Lấy toàn bộ tin nhắn
    const messages = await this.prismaClient.interviewMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  /**
   * Khởi chạy buổi phỏng vấn — sinh lời chào + câu hỏi chủ đề đầu tiên từ AI
   * Idempotent: Nếu đã có tin nhắn, trả về luôn danh sách tin nhắn hiện tại
   */
  async startInterviewSession(userId: string, sessionId: string) {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        cv: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    // Nếu đã có tin nhắn rồi thì trả về luôn (idempotent - tránh tạo trùng)
    if (session.messages.length > 0) {
      return session.messages;
    }

    // Lấy JD
    let jdText: string;
    if (session.jobTemplateId) {
      const template = await this.prismaClient.jobTemplate.findUnique({
        where: { id: session.jobTemplateId },
      });
      jdText = template?.aiExtractedContext || '';
    } else {
      jdText = session.customJdText || '';
    }

    const cvText = session.cv?.contentExtracted || '';
    const coreQuestions = session.coreQuestions as Array<{ title: string; reason: string }>;

    if (!coreQuestions || coreQuestions.length === 0) {
      throw new BadRequestException('Phiên phỏng vấn chưa được cấu hình câu hỏi cốt lõi');
    }

    // Gọi AI sinh lời chào mừng + câu hỏi chủ đề đầu tiên
    const aiResponse = await aiService.chatInterview({
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
      userResponse: '[BẮT ĐẦU PHỎNG VẤN] Tôi đã sẵn sàng, hãy bắt đầu buổi phỏng vấn!',
    });

    // Lưu tin nhắn chào mừng đầu tiên của AI vào DB
    const welcomeMessage = await this.prismaClient.interviewMessage.create({
      data: {
        sessionId,
        role: 'AI',
        content: aiResponse.reply,
        questionIndex: 0,
        isFollowUp: false,
      },
    });

    // Chuyển trạng thái session sang IN_PROGRESS
    await this.prismaClient.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'IN_PROGRESS' },
    });

    return [welcomeMessage];
  }

  /**
   * Xử lý tin nhắn chat của ứng viên gửi lên, gọi AI phản hồi và lưu vào DB
   */
  async sendChatMessage(
    userId: string,
    sessionId: string,
    messageContent: string,
    enableStream: boolean = true,
  ) {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { cv: true },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    return this.generateMessage(session, messageContent, enableStream);
  }

  private async generateMessage(
    session: any,
    messageContent: string,
    enableStream: boolean = true,
  ) {
    const sessionId = session.id;

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Phiên phỏng vấn hiện không trong trạng thái hoạt động');
    }

    // 1. Lưu tin nhắn của ứng viên (USER) vào DB
    await this.prismaClient.interviewMessage.create({
      data: {
        sessionId,
        role: 'USER',
        content: messageContent,
      },
    });

    // 2. Lấy toàn bộ lịch sử tin nhắn (bao gồm message vừa lưu)
    const allMessages = await this.prismaClient.interviewMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    // Sliding window: chỉ gửi các tin nhắn gần nhất vào AI để tránh prompt vượt giới hạn token.
    // Tin nhắn USER mới nhất được truyền riêng qua userResponse nên không nằm trong window này.
    const chatHistory = allMessages
      .slice(0, -1)
      .slice(-CHAT_HISTORY_WINDOW_SIZE)
      .map((msg) => ({
        role: msg.role === 'AI' ? ('bot' as const) : ('user' as const),
        content: msg.content,
      }));

    // Xác định chủ đề hiện tại: đếm số câu hỏi chính (non-follow-up) AI đã đặt
    const aiMainMessages = allMessages.filter((m) => m.role === 'AI' && !m.isFollowUp);
    const currIdx = Math.max(0, aiMainMessages.length - 1);

    const coreQuestions = session.coreQuestions as Array<{ title: string; reason: string }>;

    // Lấy JD
    let jdText: string;
    if (session.jobTemplateId) {
      const template = await this.prismaClient.jobTemplate.findUnique({
        where: { id: session.jobTemplateId },
      });
      jdText = template?.aiExtractedContext || '';
    } else {
      jdText = session.customJdText || '';
    }

    const cvText = session.cv?.contentExtracted || '';

    // 3. Gọi AI phản hồi (kèm callback để bắn SSE stream)
    const aiResponse = await aiService.chatInterview(
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
      enableStream
        ? (chunkText) => {
            // Mỗi khi có text mới, bắn sự kiện stream xuống client
            eventEmitter.emit(`chat_stream_${sessionId}`, chunkText);
          }
        : undefined,
    );

    // 4. Tính toán questionIndex và isFollowUp dựa trên suggestedAction của AI
    let nextQuestionIndex = currIdx;
    let nextIsFollowUp = true;
    let newStatus = session.status;

    if (aiResponse.suggestedAction === 'TRANSITION') {
      if (currIdx + 1 < coreQuestions.length) {
        // Chuyển sang chủ đề tiếp theo
        nextQuestionIndex = currIdx + 1;
        nextIsFollowUp = false;
      } else {
        // Hết bộ câu hỏi -> kết thúc
        newStatus = 'COMPLETED';
      }
    } else if (aiResponse.suggestedAction === 'FINISH') {
      newStatus = 'COMPLETED';
    }

    // 5. Lưu tin nhắn AI mới vào DB
    const botMessage = await this.prismaClient.interviewMessage.create({
      data: {
        sessionId,
        role: 'AI',
        content: aiResponse.reply,
        questionIndex: nextQuestionIndex,
        isFollowUp: nextIsFollowUp,
      },
    });

    // 6. Cập nhật trạng thái session nếu thay đổi
    if (newStatus !== session.status) {
      await this.prismaClient.interviewSession.update({
        where: { id: sessionId },
        data: { status: newStatus },
      });
    }

    // 7. Bắn sự kiện SSE để thông báo có tin nhắn mới cho tất cả các tab
    eventEmitter.emit(`chat_updated_${sessionId}`);

    return {
      message: botMessage,
      currentQuestionIndex: nextQuestionIndex,
      status: newStatus,
    };
  }

  async submitInterviewResult(userId: string, sessionId: string) {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { cv: true },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const allMessages = await this.prismaClient.interviewMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    const chatHistory = allMessages.map((msg) => ({
      role: msg.role === 'AI' ? ('bot' as const) : ('user' as const),
      content: msg.content,
    }));

    let jdText: string;
    if (session.jobTemplateId) {
      const template = await this.prismaClient.jobTemplate.findUnique({
        where: { id: session.jobTemplateId },
      });
      jdText = template?.aiExtractedContext || '';
    } else {
      jdText = session.customJdText || '';
    }

    const cvText = session.cv?.contentExtracted || '';
    const coreQuestions = session.coreQuestions as Array<{ title: string; reason: string }>;
    // cập nhật trạng thái phiên phỏng vấn
    if (session.status !== 'COMPLETED') {
      await this.prismaClient.interviewSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' },
      });
    }
    const interviewResult = await aiService.submitInterviewResult({
      cvText,
      jdText,
      position: session.jobTitle,
      level: session.level,
      language: session.language,
      persona: session.persona,
      chatHistory,
      coreQuestions,
    });

    // Lưu kết quả vào DB (Sử dụng upsert để tránh lỗi nếu user vô tình ấn Nộp nhiều lần)
    const savedResult = await this.prismaClient.interviewResult.upsert({
      where: { sessionId },
      update: {
        generalEvaluation: { set: interviewResult.generalEvaluation },
        overallScore: interviewResult.generalEvaluation.overall.score,
        recommendation: interviewResult.recommendation,
        summary: interviewResult.summary,
        strengths: interviewResult.strengths,
        weaknesses: interviewResult.weaknesses,
        learningPath: interviewResult.learningPath,
        // Chú ý: Upsert không hỗ trợ ghi đè mảng relation trực tiếp.
        // Nhưng vì đây là dữ liệu tĩnh sinh 1 lần, update thường chỉ là ghi đè lại chính nó.
        // Tốt nhất nếu update thì xóa QuestionEvaluation cũ và tạo mới, nhưng để đơn giản ta dùng create
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
          create: interviewResult.questionEvaluations.map((q) => ({
            questionIndex: q.questionIndex,
            questionTitle: q.questionTitle,
            feedback: q.feedback,
            score: q.score,
          })),
        },
      },
      include: {
        questionEvaluations: true,
      },
    });

    return savedResult;
  }

  async getInterviewResult(userId: string, sessionId: string) {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

    const result = await this.prismaClient.interviewResult.findUnique({
      where: { sessionId },
      include: {
        questionEvaluations: {
          orderBy: { questionIndex: 'asc' },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Chưa có báo cáo kết quả cho phiên phỏng vấn này');
    }

    return result;
  }

  async sendChatMessageWithTTS(
    userId: string,
    sessionId: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }
    const language = session.language || InterviewLanguage.VIETNAMESE;
    const persona = session.persona || InterviewPersona.PROFESSIONAL;

    const text = await this.aiService.transcribeAudio(buffer, mimeType, language);
    const responseAI = await this.generateMessage(session, text, false);
    const audioText = responseAI.message.content;
    const audioResponse = await this.googleTtsService.synthesizeSpeech(
      audioText,
      language,
      persona,
    );
    return {
      ...responseAI,
      userText: text,
      audioBase64: audioResponse.toString('base64'),
    };
  }
}

export const interviewAiService = new InterviewAiService(prisma, aiService, googleTtsService);
