import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  interviewAiService,
  InterviewAiService,
} from '../../../services/client/interview-ai.service';
import { sendResponse } from '../../../utils/apiResponse';

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
    const cvId = req.query.cvId as string;
    const interviewSession = await this.interviewAiService.getInterviewSession(req.user!.id, cvId);
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
}

export const interviewAIController = new InterviewAIController(interviewAiService);
