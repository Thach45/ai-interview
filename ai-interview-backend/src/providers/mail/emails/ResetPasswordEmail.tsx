import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  OtpBox,
  BRAND_NAME,
} from './EmailLayout';

interface ResetPasswordEmailProps {
  otp: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  otp,
}) => (
  <EmailLayout preview={`Mã OTP đặt lại mật khẩu ${BRAND_NAME}: ${otp}`}>
    <EmailHeading>Yêu cầu đặt lại mật khẩu</EmailHeading>
    <EmailParagraph>
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản{' '}
      <strong>{BRAND_NAME}</strong> của bạn. Vui lòng dùng mã OTP dưới đây:
    </EmailParagraph>
    <OtpBox
      otp={otp}
      accentColor="#dc2626"
      backgroundColor="#fef6f5"
      border="1px dashed #f3c8c2"
    />
    <EmailParagraph muted>
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc
      liên hệ bộ phận hỗ trợ nếu lo ngại về bảo mật.
    </EmailParagraph>
  </EmailLayout>
);

export default ResetPasswordEmail;
