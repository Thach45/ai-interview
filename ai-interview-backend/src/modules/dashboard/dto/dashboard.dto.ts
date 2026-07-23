import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { DashboardDateRange } from '../enums/dashboard.enum';

export class DashboardQueryDto {
  @IsOptional()
  @IsEnum(DashboardDateRange, { message: 'dateRange khong hop le' })
  dateRange?: DashboardDateRange;

  @IsOptional()
  @IsDateString({}, { message: 'startDate khong hop le' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate khong hop le' })
  endDate?: string;
}
