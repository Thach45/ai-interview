import { Metadata } from 'next';
import LandingPage from '@/views/client/LandingPage';
import { FAQ_ITEMS } from '@/features/landing-page/content/seoContent';

const siteUrl = 'https://arionxai.com';

export const metadata: Metadata = {
  title: 'Arion - Luyện Tập Phỏng Vấn & Tối Ưu CV Bằng AI',
  description:
    'Luyện phỏng vấn với AI, tối ưu CV theo JD và nhận phản hồi cụ thể để chuẩn bị tự tin hơn cho cơ hội nghề nghiệp tiếp theo.',
  keywords: ['Arion', 'phỏng vấn AI', 'tối ưu CV', 'tạo CV AI', 'luyện phỏng vấn', 'tìm việc làm', 'vượt qua ATS'],
  openGraph: {
    title: 'Arion - Luyện Tập Phỏng Vấn & Tối Ưu CV Bằng AI',
    description: 'Luyện phỏng vấn với AI, tối ưu CV theo JD và nhận phản hồi cụ thể cho hành trình ứng tuyển của bạn.',
    url: siteUrl,
    siteName: 'Arion',
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Arion — Luyện phỏng vấn AI và tối ưu CV theo JD',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arion - Luyện Tập Phỏng Vấn & Tối Ưu CV Bằng AI',
    description: 'Luyện phỏng vấn với AI, tối ưu CV theo JD và nhận phản hồi cụ thể cho hành trình ứng tuyển của bạn.',
    images: [`${siteUrl}/opengraph-image`],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function Page() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Arion',
        url: siteUrl,
        logo: `${siteUrl}/logo/logo.png`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Arion',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        description: 'Nền tảng giúp người dùng luyện phỏng vấn với AI và tối ưu CV theo mô tả công việc.',
        featureList: ['Luyện phỏng vấn AI', 'Tối ưu CV theo JD', 'Phản hồi cá nhân hóa'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LandingPage />
    </>
  );
}
