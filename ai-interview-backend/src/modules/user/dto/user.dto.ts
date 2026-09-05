import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  IsArray,
  ArrayUnique,
  IsEnum,
} from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class AdminCreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  roleCodes?: string[];

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditsBalance?: number;
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  roleCodes?: string[];

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditsBalance?: number;
}
