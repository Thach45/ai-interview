import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard.dto';

@Controller('admin/dashboard')
@HasRole(Role.ADMIN)
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
