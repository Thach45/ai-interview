const BRAND_NAME = 'AI Interview';
const PRIMARY_COLOR = '#5645d4';

const baseLayout = (content: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <div style="font-size: 28px; font-weight: 800; color: ${PRIMARY_COLOR}; letter-spacing: -1px; margin-bottom: 8px;">
                  ${BRAND_NAME}
                </div>
                <div style="height: 4px; width: 40px; background-color: ${PRIMARY_COLOR}; margin: 0 auto; border-radius: 2px;"></div>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 20px 40px 40px 40px;">
                ${content}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                <div style="font-size: 13px; color: #94a3b8;">&copy; 2026 ${BRAND_NAME}. All rights reserved.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

const otpBox = (otp: string, accentColor: string = PRIMARY_COLOR) => `
  <div style="background-color: #f1f5f9; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px;">
    <div style="font-size: 36px; font-weight: 800; color: ${accentColor}; letter-spacing: 8px; margin-bottom: 8px;">
      ${otp}
    </div>
    <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">Mã có hiệu lực trong 5 phút</div>
  </div>
`;

/**
 * Template email gửi OTP xác thực tài khoản
 */
export const verifyAccountTemplate = (otp: string): string => {
  const content = `
    <h1 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0;">Xác nhận mã OTP của bạn</h1>
    <p style="font-size: 15px; line-height: 24px; color: #64748b; margin: 0 0 32px 0;">
      Chào bạn, cảm ơn đã chọn <strong>${BRAND_NAME}</strong>. Để hoàn tất việc xác thực, vui lòng dùng mã OTP dưới đây:
    </p>
    ${otpBox(otp)}
    <p style="font-size: 14px; line-height: 22px; color: #94a3b8; margin: 0;">
      Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.
    </p>
  `;
  return baseLayout(content);
};

/**
 * Template email gửi OTP đặt lại mật khẩu
 */
export const resetPasswordTemplate = (otp: string): string => {
  const content = `
    <h1 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0;">Yêu cầu đặt lại mật khẩu</h1>
    <p style="font-size: 15px; line-height: 24px; color: #64748b; margin: 0 0 32px 0;">
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${BRAND_NAME}</strong> của bạn. Vui lòng dùng mã OTP dưới đây:
    </p>
    <div style="background-color: #fef2f2; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 32px; border: 1px dashed #fecaca;">
      <div style="font-size: 36px; font-weight: 800; color: #dc2626; letter-spacing: 8px; margin-bottom: 8px;">
        ${otp}
      </div>
      <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">Mã có hiệu lực trong 5 phút</div>
    </div>
    <p style="font-size: 14px; line-height: 22px; color: #94a3b8; margin: 0;">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ bộ phận hỗ trợ nếu lo ngại về bảo mật.
    </p>
  `;
  return baseLayout(content);
};
