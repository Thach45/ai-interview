import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import "./globals.css";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: "AI Interview - Nền tảng phỏng vấn AI thông minh",
    template: "%s | AI Interview",
  },
  description:
    "Nền tảng phỏng vấn AI thông minh - Luyện tập phỏng vấn, tạo CV chuyên nghiệp và tìm việc làm phù hợp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
