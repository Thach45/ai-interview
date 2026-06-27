import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  interviewAiService,
  InterviewAiService,
} from '../../../services/client/interview-ai.service';
import { sendResponse } from '../../../utils/apiResponse';
import { AppException } from '../../../exceptions';
import { eventEmitter } from '../../../utils/eventEmitter';

class InterviewAIController {
  constructor(private readonly interviewAiService: InterviewAiService) {}

  setupInterview = asyncHandler(async (req: Request, res: Response) => {
    const interviewSession = await this.interviewAiService.createInterviewSession(
      req.user!.id,
      req.body,
    );
    sendResponse(res, 200, 'Khởi tạo phiên phỏng vấn thành công', interviewSession);
  });

  getInterview = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const interviewSession = await this.interviewAiService.getInterviewSession(
      req.user!.id,
      sessionId,
    );
    sendResponse(res, 200, 'Lấy thông tin phiên phỏng vấn thành công', interviewSession);
  });

  startInterview = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const messages = await this.interviewAiService.startInterviewSession(req.user!.id, sessionId);
    sendResponse(res, 200, 'Bắt đầu buổi phỏng vấn thành công', messages);
  });

  sendChatMessage = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const { message } = req.body;
    const result = await this.interviewAiService.sendChatMessage(req.user!.id, sessionId, message);
    sendResponse(res, 200, 'Phản hồi từ AI thành công', result);
  });

  submitInterviewResult = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const result = await this.interviewAiService.submitInterviewResult(req.user!.id, sessionId);
    sendResponse(res, 200, 'Nộp kết quả phỏng vấn thành công', result);
  });

  getInterviewResult = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const result = await this.interviewAiService.getInterviewResult(req.user!.id, sessionId);
    sendResponse(res, 200, 'Lấy báo cáo kết quả phỏng vấn thành công', result);
  });

  sendChatMessageWithTTS = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    if (!req.file) {
      throw new AppException('Không tìm thấy file âm thanh đính kèm', 400);
    }
    // Gửi file cho Gemini nghe và chép chính tả
    const result = await this.interviewAiService.sendChatMessageWithTTS(
      req.user!.id,
      sessionId,
      req.file.buffer,
      req.file.mimetype,
    );
    sendResponse(res, 200, 'Phản hồi từ AI thành công', result);
  });

  getInterviewMessages = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const messages = await this.interviewAiService.getInterviewMessages(req.user!.id, sessionId);
    sendResponse(res, 200, 'Lấy lịch sử tin nhắn thành công', messages);
  });

  streamInterviewEvents = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.id;

    // Thiết lập headers bắt buộc cho SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const eventName = `chat_updated_${sessionId}`;

    // Callback được gọi khi có sự kiện
    const sendEvent = () => {
      res.write(`data: ${JSON.stringify({ type: 'SYNC_SESSION', sessionId })}\n\n`);
    };

    // Đăng ký lắng nghe
    eventEmitter.on(eventName, sendEvent);

    // Gửi một tin nhắn ping để giữ connection luôn mở
    const keepAlive = setInterval(() => {
      res.write(':\n\n'); // Ký tự comment chuẩn của SSE
    }, 30000);

    // Dọn dẹp khi client ngắt kết nối (tắt tab)
    req.on('close', () => {
      clearInterval(keepAlive);
      eventEmitter.off(eventName, sendEvent);
    });
  });
}

export const interviewAIController = new InterviewAIController(interviewAiService);
