import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  verifyAccountTemplate,
  resetPasswordTemplate,
  notificationTemplate,
} from '../../common/utils/mail.template';

@Injectable()
export class MailService {
  private readonly emailApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.emailApiUrl = this.configService.get<string>('URL_EMAIL') || '';
  }

  private async sendEmail(
    recipientEmail: string,
    content: string,
  ): Promise<boolean> {
    try {
      const url = `${this.emailApiUrl}/api/email/send`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Lỗi khi gửi Email:', errorData);
        return false;
      }

      const data = await response.json();
      console.log('✅ Đã gửi Email thành công:', data);
      return true;
    } catch (error) {
      console.error('💥 Lỗi hệ thống khi gửi Email:', error);
      return false;
    }
  }

  async sendVerifyAccountOtp(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Đang gửi OTP xác thực tài khoản tới ${email}...`);
    const content = verifyAccountTemplate(otp);
    return this.sendEmail(email, content);
  }

  async sendResetPasswordOtp(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Đang gửi OTP đặt lại mật khẩu tới ${email}...`);
    const content = resetPasswordTemplate(otp);
    return this.sendEmail(email, content);
  }

  async sendNotificationEmail(
    email: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    console.log(`📧 Đang gửi thông báo tới ${email}...`);
    const content = notificationTemplate(title, message);
    return this.sendEmail(email, content);
  }

  async sendBillEmail(
    email: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    console.log(`📧 Đang gửi thông báo tới ${email}...`);
    const content = notificationTemplate(title, message);
    return this.sendEmail(email, content);
  }
}
