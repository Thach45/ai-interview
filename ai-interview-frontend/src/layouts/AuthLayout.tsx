'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Mic,
  ArrowRight,
  ShieldCheck,
  Star,
  Quote,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const TESTIMONIALS = [
  {
    name: 'Minh Trần',
    role: 'Frontend Engineer tại Momo',
    quote: 'Phần phỏng vấn follow-up của Arion giúp mình tự tin phản xạ hơn hẳn khi vào vòng phỏng vấn thực tế.',
  },
  {
    name: 'Thu Trang',
    role: 'Product Owner tại VNG',
    quote: 'Chỉ sau 3 buổi luyện tập với AI, mình đã nắm chắc cách cấu trúc câu trả lời theo chuẩn STAR.',
  },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeTestimonial] = useState(0);

  return (
    <main className="h-screen w-full overflow-hidden bg-white font-sans selection:bg-primary/20">
      <div className="grid h-full w-full grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.18fr_0.82fr]">
        
        {/* Left Column: Full-bleed Immersive Studio Panel (Zero-scroll) */}
        <section
          aria-label="Trải nghiệm Arion AI"
          className="relative hidden h-full flex-col justify-between overflow-hidden bg-[#080516] p-8 text-white lg:flex xl:p-10"
        >
          {/* Ambient Lighting Orbs */}
          <div className="pointer-events-none absolute -left-32 -top-32 size-[450px] rounded-full bg-primary/30 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 size-[450px] rounded-full bg-[#7c3aed]/25 blur-[140px]" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:36px_36px]" />

          {/* Top Bar: Brand Logo & Back to Home */}
          <div className="relative z-10 flex shrink-0 items-center justify-between">
            <Link href="/" className="group inline-flex items-center gap-2">
              <img
                src="/logo/logo.png"
                alt="Arion"
                className="h-12 w-auto invert transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            >
              <span>Về trang chủ</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Middle: Live Native AI Interview Simulation Canvas */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-auto max-w-lg py-2"
          >
            {/* Header Eyebrow */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              <Sparkles size={11} className="text-white" />
              <span>Nền tảng phỏng vấn AI hàng đầu</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white xl:text-3xl">
              Luyện phỏng vấn thông minh. Sẵn sàng bứt phá.
            </h1>

            {/* Hardware Glassmorphic Double-Bezel Card */}
            <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.04] p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-xl border border-white/10 bg-[#110c26]/90 p-4">
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white shadow-xs">
                      AI
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Arion Senior Interviewer</p>
                      <p className="text-[10px] text-white/50">Phỏng vấn giả lập chuyên sâu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-medium text-emerald-300">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Voice Session
                  </div>
                </div>

                {/* Simulated AI Question */}
                <div className="mt-2.5 rounded-lg bg-white/[0.04] border border-white/5 p-2.5 text-xs leading-relaxed text-white/90">
                  <span className="font-semibold text-primary block mb-0.5 text-[11px]">Câu hỏi tình huống:</span>
                  &quot;Hãy chia sẻ về một lần bạn xử lý xung đột kỹ thuật trong team khi deadline gấp?&quot;
                </div>

                {/* Audio Equalizer & Mic Feedback */}
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-primary/20 border border-primary/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                      <Mic size={11} />
                    </span>
                    <div>
                      <p className="text-[11px] font-medium text-white">Đang ghi âm câu trả lời</p>
                      <p className="text-[9.5px] text-white/60">Phân tích độ lưu loát & từ khóa STAR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[12, 24, 16, 28, 14, 22, 10, 26, 18, 8].map((h, i) => (
                      <span
                        key={i}
                        className="w-0.5 rounded-full bg-white/90"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Dynamic Stats Row */}
                <div className="mt-2.5 grid grid-cols-3 gap-2 pt-0.5 text-center">
                  <div className="rounded-md bg-white/[0.03] p-1.5 border border-white/5">
                    <p className="text-[9.5px] text-white/50">Độ khớp JD</p>
                    <p className="text-[11px] font-bold text-emerald-300">92%</p>
                  </div>
                  <div className="rounded-md bg-white/[0.03] p-1.5 border border-white/5">
                    <p className="text-[9.5px] text-white/50">Độ tự tin</p>
                    <p className="text-[11px] font-bold text-primary">95/100</p>
                  </div>
                  <div className="rounded-md bg-white/[0.03] p-1.5 border border-white/5">
                    <p className="text-[9.5px] text-white/50">Phản hồi</p>
                    <p className="text-[11px] font-bold text-white">Tức thì</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Mini Pill */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
              <Quote size={15} className="shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-[11px] italic text-white/80 leading-relaxed line-clamp-2">
                  &quot;{TESTIMONIALS[activeTestimonial].quote}&quot;
                </p>
                <p className="mt-1 text-[10.5px] font-semibold text-white">
                  {TESTIMONIALS[activeTestimonial].name}{' '}
                  <span className="font-normal text-white/50">
                    — {TESTIMONIALS[activeTestimonial].role}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Trust & Security Signals */}
          <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Bảo mật dữ liệu 100%</span>
            </div>
            <span className="text-[11px] text-white/40">Chuẩn hóa theo mô hình STAR</span>
          </div>
        </section>

        {/* Right Column: Full-Height Clean Form Container (Zero-scroll on desktop) */}
        <section className="relative flex h-full flex-col justify-between overflow-y-auto lg:overflow-hidden bg-white p-6 sm:px-10 lg:px-12 xl:px-14">
          {/* Mobile Top Brand Header */}
          <div className="flex shrink-0 items-center justify-between lg:hidden">
            <Link href="/">
              <img src="/logo/logo.png" alt="Arion" className="h-10 w-auto" />
            </Link>
            <Link href="/" className="text-xs font-semibold text-primary">
              Về trang chủ
            </Link>
          </div>

          {/* Centered Main Form Body */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.06 }}
            className="my-auto w-full max-w-[390px] self-center py-2"
          >
            {children}
          </motion.div>

          {/* Footer Copyright */}
          <div className="shrink-0 pt-2 text-center text-[11px] text-gray-400">
            © {new Date().getFullYear()} Arion. All rights reserved.
          </div>
        </section>

      </div>
    </main>
  );
};

export default AuthLayout;
