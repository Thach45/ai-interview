/**
 * Tạo mẫu HTML cho Email OTP
 */
export const generateOtpTemplate = (
  otp: string,
  brandName: string = 'AI Interview',
  address: string = 'TP. Hồ Chí Minh, Việt Nam',
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
      <h2 style="color: #5645d4; text-align: center;">Xác thực tài khoản ${brandName}</h2>
      <p>Chào bạn,</p>
      <p>Mã OTP của bạn là: <strong style="font-size: 24px; color: #5645d4;">${otp}</strong></p>
      <p>Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #888; text-align: center;">
        ${brandName} - ${address}
      </p>
    </div>
  `;
};
