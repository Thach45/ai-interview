import { InterviewSession, PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';

import { SetupInterviewBody } from '../../validations/interview-ai.validation';
import { aiService } from '../core/ai.service';
import { BadRequestException, NotFoundException } from '../../exceptions';
import { creditsService } from '../../shared/services/credits.service';

const CHAT_HISTORY_WINDOW_SIZE = 8;

export class InterviewAiService {
  constructor(private readonly prismaClient: PrismaClient) {}

  /**
   * Tạo phiên phỏng vấn mới (Interview Session)
   * 1. Xác thực người dùng và kiểm tra số dư credit
   * 2. Lấy dữ liệu CV và mô tả công việc (JD)
   * 3. Sinh câu hỏi cốt lõi (Core Questions) có cấu trúc bằng Gemini AI
   * 4. Khấu trừ 1 credit của người dùng và tạo phiên trong DB thông qua Transaction
   */
  async createInterviewSession(userId: string, body: SetupInterviewBody) {
    // 0 caching
    const existingSession = await this.prismaClient.interviewSession.findFirst({
      where: { userId, cvId: body.cvId },
    });

    if (existingSession) {
      return existingSession;
    }

    // 1. Kiểm tra số dư lượt phỏng vấn (creditsBalance) của user bằng Shared Service
    await creditsService.checkCredits(userId);

    // 2. Lấy nội dung CV để làm ngữ cảnh cho AI
    const cv = await this.prismaClient.userCv.findUnique({
      where: { id: body.cvId },
    });

    if (!cv) {
      throw new NotFoundException('Không tìm thấy hồ sơ CV tương ứng');
    }

    // 3. Lấy nội dung JD (Job Description) từ Template hoặc Custom Text tự điền
    let jdText = '';
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
      await creditsService.decrementCredits(userId, tx);

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

  async getInterviewSession(userId: string, cvId: string): Promise<InterviewSession> {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { userId, cvId },
      orderBy: { createdAt: 'desc' },
    });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }
    return session;
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
    let jdText = '';
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
  async sendChatMessage(userId: string, sessionId: string, messageContent: string) {
    const session = await this.prismaClient.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { cv: true },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phỏng vấn');
    }

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
    let jdText = '';
    if (session.jobTemplateId) {
      const template = await this.prismaClient.jobTemplate.findUnique({
        where: { id: session.jobTemplateId },
      });
      jdText = template?.aiExtractedContext || '';
    } else {
      jdText = session.customJdText || '';
    }

    const cvText = session.cv?.contentExtracted || '';

    // 3. Gọi AI phản hồi
    const aiResponse = await aiService.chatInterview({
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
    });

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

    return {
      message: botMessage,
      currentQuestionIndex: nextQuestionIndex,
      status: newStatus,
    };
  }
}

export const interviewAiService = new InterviewAiService(prisma);
