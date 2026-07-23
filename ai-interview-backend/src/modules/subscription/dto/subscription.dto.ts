import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class PurchasePackageDto {
  @IsString()
  @IsNotEmpty({ message: 'packageId không được để trống' })
  packageId: string;
}

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  credits: number;

  @IsNumber()
  durationDays: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsNumber()
  @IsOptional()
  durationDays?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
