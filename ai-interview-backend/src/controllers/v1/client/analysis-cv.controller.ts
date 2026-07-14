import { Request, Response } from 'express';
import { analysisCVService, AnalysisCVService } from '../../../services/client/analysis-cv.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { UnauthorizedException, BadRequestException } from '../../../exceptions';
import { analysisCvQueue } from '../../../queues/analysis-cv.queue';

class AnalysisCVController {
  constructor(private readonly analysisCVService: AnalysisCVService) {}

  analyzeCVWithTemplate = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { cvId, jobTemplateId } = req.body;
    const job = await analysisCvQueue.add('analyze-cv-job', {
      userId,
      cvId,
      jobTemplateId,
    });

    return sendResponse(res, 202, 'Đã đưa yêu cầu phân tích vào hàng đợi', { jobId: job.id });
  });

  analyzeCVWithExternalJob = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { cvId, externalJobDescription } = req.body;

    // Đẩy tác vụ vào Queue chạy ngầm
    const job = await analysisCvQueue.add('analyze-cv-job', {
      userId,
      cvId,
      externalJobDescription,
    });

    return sendResponse(res, 202, 'Đã đưa yêu cầu phân tích vào hàng đợi', { jobId: job.id });
  });

  getAnalysisCV = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { cvId, jobTemplateId } = req.query;

    if (!cvId || !jobTemplateId) {
      throw new BadRequestException('Thiếu cvId hoặc jobTemplateId');
    }

    const result = await this.analysisCVService.getAnalysisCV(
      userId,
      cvId as string,
      jobTemplateId as string,
    );

    if (!result) {
      return sendResponse(res, 200, 'Chưa có phân tích cho CV này', null);
    }

    return sendResponse(res, 200, 'Lấy kết quả phân tích thành công', result);
  });
  getHistoryAnalysisCvResult = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const result = await this.analysisCVService.getHistoryAnalysisCvResult(userId);

    if (!result) {
      return sendResponse(res, 200, 'Chưa có phân tích cho CV này', null);
    }

    return sendResponse(res, 200, 'Lấy kết quả phân tích thành công', result);
  });

  getAnalysisCvById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { id } = req.params;
    if (!id) {
      throw new BadRequestException('Thiếu id');
    }

    const result = await this.analysisCVService.getAnalysisCvById((userId as string), (id as string));

    if (!result) {
      return sendResponse(res, 200, 'Không tìm thấy kết quả phân tích', null);
    }

    return sendResponse(res, 200, 'Lấy kết quả phân tích thành công', result);
  });
}

export const analysisCVController = new AnalysisCVController(analysisCVService);
