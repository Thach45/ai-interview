import { generateOtpTemplate } from '../../utils/generate-template';
import dotenv from 'dotenv';
dotenv.config();

class MailService {
  private readonly emailApiUrl = process.env.URL_EMAIL;

  /**
   * Gửi mã OTP về email người dùng thông qua API bên ngoài
   */
  async sendOtp(email: string, otp: string) {
    try {
      const url = `${this.emailApiUrl}/api/email/send`;
      const content = generateOtpTemplate(otp);
      console.log(this.emailApiUrl);
      console.log(`📧 Đang gửi OTP tới ${email}...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: email,
          content: content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Lỗi khi gửi Email:', errorData);
        return false;
      }

      const data = await response.json();
      console.log('✅ Đã gửi Email thành công:', data);
      return data;
    } catch (error) {
      console.error('💥 Lỗi hệ thống khi gửi Email:', error);
      return false;
    }
  }

  /**
   * Gửi email khôi phục mật khẩu (Placeholder)
   */
  async sendForgotPassword(email: string, _token: string) {
    console.log(`🔗 Đang gửi Email khôi phục mật khẩu tới ${email}`);
    return true;
  }
}

export const mailService = new MailService();
export { MailService };
