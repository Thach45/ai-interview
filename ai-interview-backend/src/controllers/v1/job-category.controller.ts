import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/apiResponse';
import { JobCategoryService, jobCategoryService } from '../../services/job-category.service';
import { CategoryType } from '@prisma/client';

class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  /**
   * GET /api/v1/admin/categories
   * Lấy cây danh mục 3 tầng đầy đủ
   */
  getTree = asyncHandler(async (req: Request, res: Response) => {
    const tree = await this.jobCategoryService.getTree();
    return sendResponse(res, 200, 'Lấy cây danh mục thành công', tree);
  });

  /**
   * GET /api/v1/admin/categories/flat
   * Lấy danh sách phẳng, filter theo ?type=GROUP|INDUSTRY|POSITION & pagination
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const rawType = req.query.type;
    const type = (Array.isArray(rawType) ? rawType[0] : rawType) as CategoryType | undefined;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate type nếu có truyền
    const validTypes = Object.values(CategoryType);
    if (type && !validTypes.includes(type)) {
      return sendResponse(res, 400, `Type không hợp lệ. Phải là: ${validTypes.join(', ')}`);
    }

    const result = await this.jobCategoryService.getAll(type, page, limit);
    return sendResponse(res, 200, 'Lấy danh sách danh mục thành công', result);
  });

  /**
   * GET /api/v1/admin/categories/:id
   * Lấy 1 danh mục theo id (kèm parent và children)
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params['id'] as string;
    const category = await this.jobCategoryService.getById(id);
    return sendResponse(res, 200, 'Lấy danh mục thành công', category);
  });

  /**
   * POST /api/v1/admin/categories
   * Tạo mới danh mục
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.jobCategoryService.create(req.body);
    return sendResponse(res, 201, 'Tạo danh mục thành công', category);
  });

  /**
   * PUT /api/v1/admin/categories/:id
   * Cập nhật tên danh mục
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params['id'] as string;
    const category = await this.jobCategoryService.update(id, req.body);
    return sendResponse(res, 200, 'Cập nhật danh mục thành công', category);
  });

  /**
   * DELETE /api/v1/admin/categories/:id
   * Xóa danh mục (từ chối nếu còn children)
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params['id'] as string;
    const result = await this.jobCategoryService.delete(id);
    return sendResponse(res, 200, 'Xóa danh mục thành công', result);
  });
}

export const jobCategoryController = new JobCategoryController(jobCategoryService);
