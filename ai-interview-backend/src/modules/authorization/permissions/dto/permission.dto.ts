import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { HttpMethod } from '@prisma/client';

const ENDPOINT_PATH_PATTERN = /^\/[A-Za-z0-9_~:/.-]*$/;

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePermissionDto {
  @IsEnum(HttpMethod)
  method: HttpMethod;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(ENDPOINT_PATH_PATTERN, {
    message:
      'path phải bắt đầu bằng / và chỉ chứa ký tự route hợp lệ, ví dụ /admin/packages/:id',
  })
  path: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  displayName: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsEnum(HttpMethod)
  method?: HttpMethod;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(ENDPOINT_PATH_PATTERN, {
    message:
      'path phải bắt đầu bằng / và chỉ chứa ký tự route hợp lệ, ví dụ /admin/packages/:id',
  })
  path?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  displayName?: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
