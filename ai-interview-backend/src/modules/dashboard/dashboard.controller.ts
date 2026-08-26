import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard.dto';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /admin/dashboard - Lay thong tin tong quan Dashboard
   */
  @Get()
  async getDashboardStats(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getDashboardStats(query);
  }
}
