'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FileText,
  Mic,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Tải CV & Dán JD',
    description: 'AI tự động quét điểm thiếu sót và tối ưu độ khớp với vị trí mong muốn.',
    badge: 'Chuẩn hoá ATS',
    preview: (
      <div className="flex h-36 w-full flex-col justify-between rounded-xl bg-gray-50 p-3.5 border border-gray-100 transition-colors group-hover:border-primary/20 group-hover:bg-primary/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText size={15} />
            </span>
            <span className="text-xs font-semibold text-gray-900">CV_Senior.pdf</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 size={12} /> 92% Match
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Kỹ năng & Kinh nghiệm</span>
            <span className="font-semibold text-gray-900">Khớp hoàn toàn</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div className="h-full w-[92%] rounded-full bg-primary" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
          <Sparkles size={12} />
          <span>Đã tối ưu 3 từ khóa chính</span>
        </div>
      </div>
    ),
  },
  {
    step: '02',
    title: 'Luyện Phỏng Vấn AI',
    description: 'Thực hành trả lời câu hỏi chuyên sâu bằng giọng nói hoặc văn bản.',
    badge: 'Mô phỏng thực tế',
    preview: (
      <div className="flex h-36 w-full flex-col justify-between rounded-xl bg-gray-50 p-3.5 border border-gray-100 transition-colors group-hover:border-primary/20 group-hover:bg-primary/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-xs">
              AI
            </span>
            <span className="text-xs font-semibold text-gray-900">Interviewer Live</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Giọng nói
          </span>
        </div>

        {/* Audio Equalizer Bars */}
        <div className="flex items-center justify-center gap-1 py-1">
          {[10, 20, 36, 16, 42, 28, 18, 38, 24, 12, 32, 20, 40, 22, 12, 28, 16, 34, 14, 8].map(
            (h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-primary/70"
                style={{ height: `${h}px` }}
              />
            )
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Volume2 size={12} className="text-primary" /> Đang lắng nghe...
          </span>
          <span className="font-semibold text-gray-800">Câu 03/08</span>
        </div>
      </div>
    ),
  },
  {
    step: '03',
    title: 'Nhận Điểm & Sửa Lỗi',
    description: 'Xem báo cáo chi tiết và gợi ý chỉnh sửa cụ thể để tự tin nhận offer.',
    badge: 'Báo cáo chuyên sâu',
    preview: (
      <div className="flex h-36 w-full flex-col justify-between rounded-xl bg-gray-50 p-3.5 border border-gray-100 transition-colors group-hover:border-primary/20 group-hover:bg-primary/[0.02]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-900">Kết quả tổng quan</span>
          <span className="text-lg font-bold tracking-tight text-primary">
            95<span className="text-xs text-gray-400 font-normal">/100</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
          <div className="rounded bg-white p-1.5 border border-gray-100">
            <p className="text-gray-500">Kỹ thuật</p>
            <p className="font-semibold text-gray-900">95/100</p>
          </div>
          <div className="rounded bg-white p-1.5 border border-gray-100">
            <p className="text-gray-500">Giao tiếp</p>
            <p className="font-semibold text-gray-900">92/100</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
          <Trophy size={12} />
          <span>Sẵn sàng ứng tuyển thực tế</span>
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-24 border-b border-gray-200 bg-white px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Minimal Clean Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            Quy trình tinh gọn
          </span>
          <h2
            id="how-it-works-heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl"
          >
            Đơn giản. Liền mạch. Hiệu quả.
          </h2>
          <p className="mt-3 text-base text-gray-600">
            3 bước chuẩn bị từ hồ sơ đến kỹ năng phỏng vấn trong vài phút.
          </p>
        </div>

        {/* 3 Clean Connected Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((item, index) => (
            <motion.div
              key={item.step}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              {/* Visual Preview Box */}
              <div>{item.preview}</div>

              {/* Text Info */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-primary">
                    BƯỚC {item.step}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-950 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick CTA Bottom Link */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-pressed transition-colors"
          >
            <span>Bắt đầu trải nghiệm ngay</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
