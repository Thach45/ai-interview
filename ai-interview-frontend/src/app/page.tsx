import { Metadata } from 'next';
import LandingPage from '@/views/client/LandingPage';

export const metadata: Metadata = {
  title: 'AI Interview - Luyện Tập Phỏng Vấn & Tối Ưu CV Bằng AI',
  description:
    'Nền tảng phỏng vấn AI thông minh. Giúp bạn luyện tập phỏng vấn với bot AI, tối ưu hóa CV vượt qua bộ lọc ATS và tìm kiếm việc làm dễ dàng hơn bao giờ hết.',
  keywords: ['phỏng vấn AI', 'tối ưu CV', 'tạo CV AI', 'luyện phỏng vấn', 'tìm việc làm', 'AI interview', 'vượt qua ATS'],
  openGraph: {
    title: 'AI Interview - Luyện Tập Phỏng Vấn & Tối Ưu CV Bằng AI',
    description: 'Nền tảng phỏng vấn AI thông minh giúp bạn luyện tập phỏng vấn và tối ưu hóa CV vượt qua bộ lọc ATS.',
    url: 'https://ai-interview.com',
    siteName: 'AI Interview',
    images: [
      {
        url: 'https://ai-interview.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Interview Preview',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Interview - Luyện Tập Phỏng Vấn & Tối Ưu CV Bằng AI',
    description: 'Nền tảng phỏng vấn AI thông minh giúp bạn luyện tập phỏng vấn và tối ưu hóa CV vượt qua bộ lọc ATS.',
    images: ['https://ai-interview.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://ai-interview.com',
  },
};

export default function Page() {
  return <LandingPage />;
}
