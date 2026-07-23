import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { TransactionType, PaymentStatus } from '@prisma/client';

export class ManualTopupDto {
  @IsString()
  @IsNotEmpty({ message: 'userEmail không được để trống' })
  userEmail: string;

  @IsNumber()
  @Min(0, { message: 'creditsAdded phải lớn hơn hoặc bằng 0' })
  creditsAdded: number;

  @IsEnum(TransactionType, { message: 'type không hợp lệ' })
  type: TransactionType;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateStatusDto {
  @IsEnum(PaymentStatus, { message: 'status không hợp lệ' })
  status: PaymentStatus;
}

export class TransactionQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
