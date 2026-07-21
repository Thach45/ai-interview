import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import { builderCvService, BuilderCvService } from '../../../services/client/builder-cv.service';
import { AppException } from '../../../exceptions';

export class BuilderCvController {
  constructor(private readonly _builderCvService: BuilderCvService) {}

  // ===================== CV TEMPLATES =====================

  /**
   * Lấy danh sách template CV
   */
  getTemplates = asyncHandler(async (_req: Request, res: Response) => {
    const templates = await this._builderCvService.getTemplates();
    return sendResponse(res, 200, 'Lấy danh sách template thành công', templates);
  });

  /**
   * Lấy chi tiết template CV
   */
  getTemplateById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const template = await this._builderCvService.getTemplateById(id as string);
    return sendResponse(res, 200, 'Lấy thông tin template thành công', template);
  });

  // ===================== BUILDER CV =====================

  /**
   * Lưu / Cập nhật CV Builder
   * Body: { id?: string, templateId: string, title: string, cvData: string, renderedHtml: string }
   */
  saveCv = asyncHandler(async (req: Request, res: Response) => {
    const { id, templateId, title, cvData, renderedHtml } = req.body;

    if (!templateId || !title || !cvData || !renderedHtml) {
      throw new AppException('Thiếu thông tin bắt buộc (templateId, title, cvData, renderedHtml)', 400);
    }

    const result = await this._builderCvService.saveCv(req.user!.id, {
      id: id || undefined,
      templateId,
      title,
      cvData,
      renderedHtml,
    });

    return sendResponse(res, id ? 200 : 201, id ? 'Cập nhật CV thành công' : 'Lưu CV thành công', result);
  });

  /**
   * Lấy danh sách CV Builder của user
   */
  getMyCvs = asyncHandler(async (req: Request, res: Response) => {
    const cvs = await this._builderCvService.getMyCvs(req.user!.id);
    return sendResponse(res, 200, 'Lấy danh sách CV Builder thành công', cvs);
  });

  /**
   * Lấy chi tiết CV Builder (kèm template HTML/CSS)
   */
  getCvById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const cv = await this._builderCvService.getCvById(req.user!.id, id as string);
    return sendResponse(res, 200, 'Lấy thông tin CV Builder thành công', cv);
  });

  /**
   * Xoá CV Builder
   */
  deleteCv = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this._builderCvService.deleteCv(req.user!.id, id as string);
    return sendResponse(res, 200, result.message, result);
  });

  /**
   * Export CV Builder ra PDF
   * Body: { html?: string } — nếu không truyền html thì dùng renderedHtml đã lưu
   */
  exportPdf = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { html } = req.body;

    const pdfBuffer = await this._builderCvService.exportPdf(req.user!.id, id as string, html || undefined);

    // Set headers cho file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cv-builder-${id}.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  });
}

export const builderCvController = new BuilderCvController(builderCvService);
