import * as React from 'react';
import { Section, Text } from '@react-email/components';
import { EmailLayout, EmailHeading, EmailParagraph } from './EmailLayout';

interface NotificationEmailProps {
  title: string;
  message: string;
}

export const NotificationEmail: React.FC<NotificationEmailProps> = ({
  title,
  message,
}) => (
  <EmailLayout preview={title}>
    <EmailHeading>{title}</EmailHeading>
    <EmailParagraph>{message}</EmailParagraph>
    <Section
      style={{
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}
    >
      <Text style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
        Bạn nhận được email này vì đã đăng ký nhận thông báo từ hệ thống của
        chúng tôi.
      </Text>
    </Section>
  </EmailLayout>
);

export default NotificationEmail;
