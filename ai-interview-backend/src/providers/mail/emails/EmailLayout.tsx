import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const BRAND_NAME = 'Arion';
const PRIMARY_COLOR = '#191919';
const AI_ACCENT_COLOR = '#f5a623';
const FRONTEND_URL = (
  process.env.FRONTEND_URL || 'http://localhost:3001'
).replace(/\/+$/, '');
const LOGO_URL =
  'https://res.cloudinary.com/drblblupt/image/upload/v1788533916/ChatGPT_Image_Aug_18_2026_02_37_15_PM_1_b9th1v.png';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  preview,
  children,
}) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f6f5f4',
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <Container
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e5e3df',
        }}
      >
        {/* Header */}
        <Section
          style={{
            padding: '32px 40px',
            textAlign: 'center',
            backgroundColor: '#fafaf9',
            borderBottom: '1px solid #e5e3df',
          }}
        >
          <Img
            src={LOGO_URL}
            alt={BRAND_NAME}
            height="36"
            style={{ margin: '0 auto', display: 'block' }}
          />
        </Section>

        {/* Content */}
        <Section style={{ padding: '40px' }}>{children}</Section>

        <Hr style={{ borderColor: '#e5e3df', margin: 0 }} />

        {/* Footer */}
        <Section style={{ padding: '28px 40px', textAlign: 'center' }}>
          <Text
            style={{
              fontSize: '13px',
              color: '#787671',
              margin: '0 0 8px 0',
            }}
          >
            Nền tảng luyện phỏng vấn &amp; tối ưu CV cùng AI
          </Text>
          <Text style={{ fontSize: '12px', color: '#c8c4be', margin: 0 }}>
            © {new Date().getFullYear()} {BRAND_NAME}. Email này được gửi tự
            động, vui lòng không trả lời trực tiếp.
          </Text>
          <Text
            style={{ fontSize: '12px', color: '#c8c4be', margin: '8px 0 0 0' }}
          >
            <Link href={FRONTEND_URL} style={{ color: '#787671' }}>
              {FRONTEND_URL.replace(/^https?:\/\//, '')}
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface OtpBoxProps {
  otp: string;
  accentColor?: string;
  backgroundColor?: string;
  border?: string;
}

export const OtpBox: React.FC<OtpBoxProps> = ({
  otp,
  accentColor = AI_ACCENT_COLOR,
  backgroundColor = '#fafaf9',
  border = '1px solid #e5e3df',
}) => (
  <Section
    style={{
      backgroundColor,
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      marginBottom: '32px',
      border,
    }}
  >
    <Text
      style={{
        fontSize: '36px',
        fontWeight: 800,
        color: accentColor,
        letterSpacing: '8px',
        margin: '0 0 8px 0',
      }}
    >
      {otp}
    </Text>
    <Text
      style={{
        fontSize: '13px',
        color: '#787671',
        fontWeight: 500,
        margin: 0,
      }}
    >
      Mã có hiệu lực trong 5 phút
    </Text>
  </Section>
);

export const EmailHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text
    style={{
      fontSize: '20px',
      fontWeight: 700,
      color: '#1a1a1a',
      margin: '0 0 16px 0',
    }}
  >
    {children}
  </Text>
);

export const EmailParagraph: React.FC<{
  children: React.ReactNode;
  muted?: boolean;
}> = ({ children, muted = false }) => (
  <Text
    style={{
      fontSize: muted ? '14px' : '15px',
      lineHeight: muted ? '22px' : '24px',
      color: muted ? '#787671' : '#5d5b54',
      margin: muted ? 0 : '0 0 32px 0',
      whiteSpace: 'pre-wrap',
    }}
  >
    {children}
  </Text>
);

export { BRAND_NAME, PRIMARY_COLOR, AI_ACCENT_COLOR };
