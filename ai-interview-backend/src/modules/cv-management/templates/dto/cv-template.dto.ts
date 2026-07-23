import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCvTemplateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  htmlStructure?: string;

  @IsOptional()
  @IsString()
  cssStyles?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCvTemplateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  htmlStructure?: string;

  @IsOptional()
  @IsString()
  cssStyles?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
