import { dashboardService, DashboardService } from '../../../services/admin/dashboard.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { Request, Response } from 'express';
import { GetDashboardStatsQuery } from '../../../validations/dashboard-admin.validation';
import { sendResponse } from '../../../utils/apiResponse';

class DashboardAdminController {
  constructor(private readonly service: DashboardService) {}
  getDashboardAdmin = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.service.getDashboardStats(
      req.query as unknown as GetDashboardStatsQuery,
    );

    return sendResponse(res, 200, 'Lấy thông tin tổng quan thành công', stats);
  });
}

export const dashboardAdminController = new DashboardAdminController(dashboardService);
