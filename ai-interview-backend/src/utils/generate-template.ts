/**
 * Tạo mẫu HTML cho Email OTP chuyên nghiệp
 */
export const generateOtpTemplate = (otp: string, brandName: string = 'AI Interview') => {
  const primaryColor = '#5645d4'; // Màu thương hiệu chính

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác thực mã OTP</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <div style="font-size: 28px; font-weight: 800; color: ${primaryColor}; letter-spacing: -1px; margin-bottom: 8px;">
                    ${brandName}
                  </div>
                  <div style="height: 4px; width: 40px; background-color: ${primaryColor}; margin: 0 auto; border-radius: 2px;"></div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px 40px 40px;">
                  <h1 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0;">Xác nhận mã OTP của bạn</h1>
                  <p style="font-size: 15px; line-height: 24px; color: #64748b; margin: 0 0 32px 0;">
                    Chào bạn, cảm ơn bạn đã lựa chọn <strong>${brandName}</strong>. Để hoàn tất việc xác thực, vui lòng sử dụng mã OTP dưới đây:
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background-color: #f1f5f9; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 36px; font-weight: 800; color: ${primaryColor}; letter-spacing: 8px; margin-bottom: 8px;">
                      ${otp}
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">Mã có hiệu lực trong 5 phút</div>
                  </div>
                  
                  <p style="font-size: 14px; line-height: 22px; color: #94a3b8; margin: 0;">
                    Nếu bạn không yêu cầu mã này, bạn có thể an tâm bỏ qua email này. Có thể ai đó đã nhập nhầm địa chỉ email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                  <div style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">
                    &copy; 2026 ${brandName}. All rights reserved.
                  </div>
                  <div style="font-size: 12px; color: #cbd5e1;">
                    Bạn nhận được email này vì đã đăng ký tài khoản trên hệ thống của chúng tôi.
                  </div>
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 24px; text-align: center;">
              <a href="#" style="font-size: 12px; color: #94a3b8; text-decoration: none; margin: 0 10px;">Website</a>
              <a href="#" style="font-size: 12px; color: #94a3b8; text-decoration: none; margin: 0 10px;">Hỗ trợ</a>
              <a href="#" style="font-size: 12px; color: #94a3b8; text-decoration: none; margin: 0 10px;">Điều khoản</a>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
