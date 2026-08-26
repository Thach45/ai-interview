import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CategoryType } from '@prisma/client';

export class CreateJobCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MinLength(1, { message: 'Tên danh mục không được để trống' })
  name: string;

  @IsEnum(CategoryType, {
    message: 'Type phải là GROUP, INDUSTRY hoặc POSITION',
  })
  type: CategoryType;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? null : value,
  )
  @IsUUID()
  parentId?: string | null;
}

export class UpdateJobCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MinLength(1, { message: 'Tên danh mục không được để trống' })
  name: string;
}
