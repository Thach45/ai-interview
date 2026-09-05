import * as React from 'react';
import {
  EmailLayout,
  EmailHeading,
  EmailParagraph,
  OtpBox,
  BRAND_NAME,
} from './EmailLayout';

interface VerifyAccountEmailProps {
  otp: string;
}

export const VerifyAccountEmail: React.FC<VerifyAccountEmailProps> = ({
  otp,
}) => (
  <EmailLayout preview={`Mã OTP xác thực tài khoản ${BRAND_NAME}: ${otp}`}>
    <EmailHeading>Xác nhận mã OTP của bạn</EmailHeading>
    <EmailParagraph>
      Chào bạn, cảm ơn đã chọn <strong>{BRAND_NAME}</strong>. Để hoàn tất việc
      xác thực, vui lòng dùng mã OTP dưới đây:
    </EmailParagraph>
    <OtpBox otp={otp} />
    <EmailParagraph muted>
      Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.
    </EmailParagraph>
  </EmailLayout>
);

export default VerifyAccountEmail;
