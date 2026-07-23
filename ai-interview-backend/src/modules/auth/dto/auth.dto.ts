import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Full name is required' })
  fullName: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  passwordConfirmation: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}

export class SendOtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'OTP must be 6 digits' })
  otp: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'OTP must be 6 digits' })
  otp: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  passwordConfirmation: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
