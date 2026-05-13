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
}

export const analysisCVController = new AnalysisCVController(analysisCVService);
