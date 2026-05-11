import { verifyAccountTemplate, resetPasswordTemplate } from '../../utils/mail.template';
import dotenv from 'dotenv';
dotenv.config();

class MailService {
  private readonly emailApiUrl = process.env.URL_EMAIL;

  private async sendEmail(recipientEmail: string, content: string): Promise<boolean> {
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

  /**
   * Gửi mã OTP xác thực tài khoản
   */
  async sendVerifyAccountOtp(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Đang gửi OTP xác thực tài khoản tới ${email}...`);
    const content = verifyAccountTemplate(otp);
    return this.sendEmail(email, content);
  }

  /**
   * Gửi mã OTP đặt lại mật khẩu
   */
  async sendResetPasswordOtp(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Đang gửi OTP đặt lại mật khẩu tới ${email}...`);
    const content = resetPasswordTemplate(otp);
    return this.sendEmail(email, content);
  }
}

export const mailService = new MailService();
export { MailService };
