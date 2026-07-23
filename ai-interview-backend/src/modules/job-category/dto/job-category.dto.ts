import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
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
  @IsString()
  parentId?: string;
}

export class UpdateJobCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MinLength(1, { message: 'Tên danh mục không được để trống' })
  name: string;
}
