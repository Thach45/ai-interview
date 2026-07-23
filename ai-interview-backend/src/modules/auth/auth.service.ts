import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../providers/mail/mail.service';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '../../common/exceptions/AppException';
import { TokenPayload } from '../../common/types/jwt.type';
import { UserStatus } from '@prisma/client';
import { toUserResponseDTO } from '../../common/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateTokens(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload as any, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
        '15m') as any,
    });
    const refreshToken = this.jwtService.sign(payload as any, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
        '7d') as any,
    });
    return { accessToken, refreshToken };
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
  }) {
    const { email, password, fullName } = userData;

    const existEmail = await this.findUserByEmail(email);
    if (existEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, fullName, password: hashedPassword },
    });

    await this.sendOtp(email);
    return user;
  }

  async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    const user = await this.findUserByEmail(email);

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    if (!user.emailVerifiedAt) {
      throw new BadRequestException('Email chưa được xác thực');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt');
    }

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerifyAt: user.emailVerifiedAt,
      status: user.status,
    };

    const tokens = this.generateTokens(payload);
    return {
      user: toUserResponseDTO(user),
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.findUserById(payload.id);
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Tài khoản không hợp lệ');
      }

      const newPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerifyAt: user.emailVerifiedAt!,
        status: user.status,
      };

      return this.generateTokens(newPayload);
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  logout() {
    return true;
  }

  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.verificationCode.create({
      data: { email, code: otp, expiresAt },
    });

    await this.mailService.sendVerifyAccountOtp(email, otp);
    return otp;
  }

  async verifyOtp(email: string, otp: string) {
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: { email, code: otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!verificationCode) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }
    if (verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    await this.prisma.user.update({
      where: { email },
      data: { emailVerifiedAt: new Date() },
    });

    await this.prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    return true;
  }

  async forgotPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.verificationCode.create({
      data: { email, code: otp, expiresAt },
    });

    await this.mailService.sendResetPasswordOtp(email, otp);
    return true;
  }

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    const { email, otp, newPassword } = data;

    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: { email, code: otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!verificationCode) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }
    if (verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await this.prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    return true;
  }
}
