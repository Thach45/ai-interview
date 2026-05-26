import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';
import {
  JobTemplateService,
  jobTemplateService,
} from '../../../services/admin/job-template.service';

class JobTemplateController {
  constructor(private readonly jobTemplateService: JobTemplateService) {}

  /**
   * GET /api/v1/admin/job-templates
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const categoryIds = req.query.categoryIds as string[];
    const location = req.query.location as string;
    const employmentType = req.query.employmentType as string;
    const experienceLevel = req.query.experienceLevel as string;
    const isRemote =
      req.query.isRemote === 'true' ? true : req.query.isRemote === 'false' ? false : undefined;
    const salaryRange = req.query.salaryRange as string;

    const result = await this.jobTemplateService.getAll({
      page,
      limit,
      search,
      categoryIds,
      location,
      employmentType,
      experienceLevel,
      isRemote,
      salaryRange,
    });
    return sendResponse(res, 200, 'Lấy danh sách mẫu JD thành công', result);
  });

  /**
   * GET /api/v1/admin/job-templates/:id
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params['id'] as string;
    const template = await this.jobTemplateService.getById(id);
    return sendResponse(res, 200, 'Lấy chi tiết mẫu JD thành công', template);
  });

  /**
   * POST /api/v1/admin/job-templates
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const template = await this.jobTemplateService.create(req.body);
    return sendResponse(res, 201, 'Tạo mẫu JD thành công', template);
  });

  /**
   * PUT /api/v1/admin/job-templates/:id
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params['id'] as string;
    const template = await this.jobTemplateService.update(id, req.body);
    return sendResponse(res, 200, 'Cập nhật mẫu JD thành công', template);
  });

  /**
   * DELETE /api/v1/admin/job-templates/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params['id'] as string;
    const result = await this.jobTemplateService.delete(id);
    return sendResponse(res, 200, 'Xóa mẫu JD thành công', result);
  });
}

export const jobTemplateController = new JobTemplateController(jobTemplateService);
