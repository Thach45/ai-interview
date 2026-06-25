import { Request, Response } from 'express';
import {
  cvOptimizationService,
  CvOptimizationService,
} from '../../../services/client/cv-optimization.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { UnauthorizedException } from '../../../exceptions';

class CvOptimizationController {
  constructor(private readonly cvOptimizationService: CvOptimizationService) {}

  optimizeCV = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { analysisId } = req.body;
    const result = await this.cvOptimizationService.optimizeCV(userId, analysisId);

    return sendResponse(res, 201, 'Tối ưu CV thành công', result);
  });

  exportPdf = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { analysisId, html } = req.body;
    if (!analysisId || !html) {
      return res.status(400).json({ message: 'Thiếu analysisId hoặc html' });
    }

    const pdfBuffer = await this.cvOptimizationService.exportPdf(userId, analysisId, html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="CV_Optimized.pdf"');
    res.send(Buffer.from(pdfBuffer));
  });
}

export const cvOptimizationController = new CvOptimizationController(cvOptimizationService);
