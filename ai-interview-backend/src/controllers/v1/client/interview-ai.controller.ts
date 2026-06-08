import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  interviewAiService,
  InterviewAiService,
} from '../../../services/client/interview-ai.service';
import { sendResponse } from '../../../utils/apiResponse';
import { AppException } from '../../../exceptions';

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
}

export const interviewAIController = new InterviewAIController(interviewAiService);
