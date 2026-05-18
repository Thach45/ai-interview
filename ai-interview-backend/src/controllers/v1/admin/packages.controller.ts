import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  AdminPackagesService,
  adminPackagesService,
} from '../../../services/admin/packages.service';
import { sendResponse } from '../../../utils/apiResponse';

class PackagesController {
  constructor(private readonly packagesService: AdminPackagesService) {}

  /**
   * Admin: Lấy tất cả các gói dịch vụ
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const packages = await this.packagesService.getAllPackages();
    return sendResponse(res, 200, 'Packages retrieved successfully', packages);
  });

  /**
   * Admin: Lấy gói dịch vụ theo ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const pkg = await this.packagesService.getPackageById(id);
    return sendResponse(res, 200, 'Package retrieved successfully', pkg);
  });

  /**
   * Admin: Tạo gói dịch vụ mới
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const pkg = await this.packagesService.createPackage(req.body);
    return sendResponse(res, 201, 'Package created successfully', pkg);
  });

  /**
   * Admin: Cập nhật gói dịch vụ
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const pkg = await this.packagesService.updatePackage(id, req.body);
    return sendResponse(res, 200, 'Package updated successfully', pkg);
  });

  /**
   * Admin: Xóa gói dịch vụ
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.packagesService.deletePackage(id);
    return sendResponse(res, 200, result.message);
  });
}

export const packagesController = new PackagesController(adminPackagesService);
export default packagesController;
