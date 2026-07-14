import { Request, Response } from 'express';
import {
  cvOptimizationService,
  CvOptimizationService,
} from '../../../services/client/cv-optimization.service';
import { optimizeCvQueue } from '../../../queues/optimize-cv.queue';
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
    
    // Đẩy vào queue thay vì chờ AI xử lý đồng bộ
    const job = await optimizeCvQueue.add('optimize-cv-job', {
      userId,
      analysisId
    });

    return sendResponse(res, 202, 'Đã đưa yêu cầu tối ưu vào hàng đợi', { jobId: job.id });
  });

  getOptimizedCv = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Vui lòng đăng nhập để thực hiện chức năng này');
    }

    const { analysisId } = req.params;
    const result = await this.cvOptimizationService.getOptimizedCv((userId as string), (analysisId as string));

    return sendResponse(res, 200, 'Lấy dữ liệu tối ưu thành công', result);
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
