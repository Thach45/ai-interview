import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '../exceptions';

import { mailService as _mailService, MailService } from '../shared/services/mail.service';
import { UserStatus } from '@prisma/client';

export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async register(userData: any) {
    const { email, password, fullName } = userData;

    const existEmail = await this.findUserByEmail(email);
    if (existEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        fullName: fullName,
        password: hashedPassword,
      },
    });

    // Tự động gửi OTP ngay sau khi tạo tài khoản thành công
    await this.sendOtp(email);

    return user;
  }

  async login(credentials: any) {
    const { email, password } = credentials;
    const user = await this.findUserByEmail(email);

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.emailVerifiedAt) {
      throw new BadRequestException('Email not verified');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User is not active');
    }

    return user;
  }

  async logout(_userId?: string) {
    // Hiện tại ứng dụng sử dụng stateless JWT, không lưu token trong database.
    // Nếu sau này có cơ chế blacklist token hoặc lưu session, ta sẽ xử lý ở đây.
    return true;
  }

  async sendOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    });

    // Gọi MailService để gửi email thực tế
    await this.mailService.sendOtp(email, otp);

    return otp;
  }
  async verifyOtp(email: string, otp: string) {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: { email, code: otp },
      orderBy: { createdAt: 'desc' }, // Lấy mã mới nhất
    });

    if (!verificationCode) {
      throw new BadRequestException('Invalid OTP');
    }
    if (verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Expired OTP');
    }

    // Cập nhật trạng thái xác thực của người dùng
    await prisma.user.update({
      where: { email },
      data: { emailVerifiedAt: new Date() },
    });

    // Xóa mã OTP đã sử dụng
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    return true;
  }
}

export const authService = new AuthService(_mailService);
