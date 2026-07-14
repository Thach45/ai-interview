import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { NotFoundException } from '../../../exceptions';
import {
  cvTemplateClientService,
  CvTemplateClientService,
} from '../../../services/client/cv-template.service';

export class CvTemplateClientController {
  constructor(private readonly _cvTemplateService: CvTemplateClientService) {}

  getTemplates = asyncHandler(async (req: Request, res: Response) => {
    const templates = await this._cvTemplateService.getTemplates();
    return sendResponse(res, 200, 'Lấy danh sách template thành công', templates);
  });

  getTemplateById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const template = await this._cvTemplateService.getTemplateById((id as string));

    if (!template) {
      throw new NotFoundException('Không tìm thấy template hoặc template không hoạt động');
    }

    return sendResponse(res, 200, 'Lấy thông tin template thành công', template);
  });
}

export const cvTemplateClientController = new CvTemplateClientController(cvTemplateClientService);
