import { Request, Response } from 'express';
import { analysisCVService, AnalysisCVService } from '../../../services/client/analysis-cv.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { UnauthorizedException, BadRequestException } from '../../../exceptions';

class AnalysisCVController {
  constructor(private readonly analysisCVService: AnalysisCVService) {}

  analyzeCV = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { cvId, jobDescriptionId } = req.body;
    const result = await this.analysisCVService.analysisCV(userId, cvId, jobDescriptionId);

    return sendResponse(res, 201, 'Phân tích CV thành công', result);
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
}

export const analysisCVController = new AnalysisCVController(analysisCVService);
