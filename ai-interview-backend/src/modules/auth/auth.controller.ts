import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { IsPublic } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import {
  BadRequestException,
  UnauthorizedException,
} from '../../common/exceptions/AppException';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 15, ttl: 900000 } })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return user;
  }

  @Post('login')
  @Throttle({ default: { limit: 15, ttl: 900000 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return { message: 'No refresh token provided' };
    }

    try {
      const tokens = await this.authService.refreshToken(token);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      return tokens;
    } catch {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    await this.authService.logout();
    return true;
  }

  @Post('send-otp')
  @Throttle({ default: { limit: 1, ttl: 180000 } })
  async sendOtp(@Body() dto: SendOtpDto) {
    const otp = await this.authService.sendOtp(dto.email);
    return otp;
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto.email, dto.otp);
    return true;
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: SendOtpDto) {
    await this.authService.sendOtp(dto.email);
    return true;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return true;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }
    await this.authService.resetPassword({
      email: dto.email,
      otp: dto.otp,
      newPassword: dto.newPassword,
    });
    return true;
  }
}
