import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateJobTemplateDto {
  @IsString()
  @IsNotEmpty({ message: 'Title không được để trống' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name không được để trống' })
  companyName: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  salaryRange?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  aiExtractedContext?: any;

  @IsOptional()
  @IsBoolean()
  isHotJob?: boolean;
}

export class UpdateJobTemplateDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  salaryRange?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  aiExtractedContext?: any;

  @IsOptional()
  @IsBoolean()
  isHotJob?: boolean;
}
