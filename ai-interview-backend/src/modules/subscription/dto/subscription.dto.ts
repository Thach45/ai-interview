import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsArray,
  Min,
} from 'class-validator';

export class PurchasePackageDto {
  @IsUUID()
  @IsNotEmpty({ message: 'packageId không được để trống' })
  packageId: string;
}

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  credits: number;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  oldPrice?: number;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  credits?: number;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  oldPrice?: number;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
