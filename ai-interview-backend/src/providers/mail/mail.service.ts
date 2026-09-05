import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as React from 'react';
import { VerifyAccountEmail } from './emails/VerifyAccountEmail';
import { ResetPasswordEmail } from './emails/ResetPasswordEmail';
import { NotificationEmail } from './emails/NotificationEmail';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY') || '';
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || '';
  }

  private async sendEmail(
    recipientEmail: string,
    subject: string,
    react: React.ReactElement,
  ): Promise<boolean> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: recipientEmail,
        subject,
        react,
      });

      if (error) {
        console.error('❌ Lỗi khi gửi Email:', error);
        return false;
      }

      console.log('✅ Đã gửi Email thành công:', data);
      return true;
    } catch (error) {
      console.error('💥 Lỗi hệ thống khi gửi Email:', error);
      return false;
    }
  }

  async sendVerifyAccountOtp(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Đang gửi OTP xác thực tài khoản tới ${email}...`);
    return this.sendEmail(
      email,
      'Xác thực tài khoản Arion',
      React.createElement(VerifyAccountEmail, { otp }),
    );
  }

  async sendResetPasswordOtp(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Đang gửi OTP đặt lại mật khẩu tới ${email}...`);
    return this.sendEmail(
      email,
      'Đặt lại mật khẩu Arion',
      React.createElement(ResetPasswordEmail, { otp }),
    );
  }

  async sendNotificationEmail(
    email: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    console.log(`📧 Đang gửi thông báo tới ${email}...`);
    return this.sendEmail(
      email,
      title,
      React.createElement(NotificationEmail, { title, message }),
    );
  }

  async sendBillEmail(
    email: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    console.log(`📧 Đang gửi thông báo tới ${email}...`);
    return this.sendEmail(
      email,
      title,
      React.createElement(NotificationEmail, { title, message }),
    );
  }
}
