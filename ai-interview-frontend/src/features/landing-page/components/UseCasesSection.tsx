'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  GraduationCap,
  BriefcaseBusiness,
  TrendingUp,
  Sparkles,
  Check,
  ArrowUpRight,
  FileCode,
  ArrowRightLeft,
  Crown,
} from 'lucide-react';

interface UseCase {
  id: string;
  badge: string;
  title: string;
  roleSubtitle: string;
  goal: string;
  icon: React.ElementType;
  isPopular?: boolean;
  features: string[];
  tags: string[];
  ctaText: string;
  ctaHref: string;
  widget: React.ReactNode;
}

const USE_CASES: UseCase[] = [
  {
    id: 'fresher',
    badge: 'Khởi đầu',
    title: 'Sinh viên & Fresher',
    roleSubtitle: 'Chuẩn bị bước vào thị trường',
    goal: 'Tự tin giới thiệu bản thân, làm nổi bật đồ án tốt nghiệp và tạo ấn tượng ban đầu tốt.',
    icon: GraduationCap,
    features: [
      'Gợi ý cấu trúc trả lời cho người chưa có kinh nghiệm',
      'Cách đưa đồ án vào CV chuẩn tác phong thực tế',
      'Luyện phản xạ bớt hồi hộp khi vào phỏng vấn thật',
    ],
    tags: ['Fresher', 'Thực tập sinh', 'Mới tốt nghiệp'],
    ctaText: 'Bắt đầu khởi đầu',
    ctaHref: '/register',
    widget: (
      <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 text-xs transition-colors group-hover:border-primary/20 group-hover:bg-primary/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium text-gray-800">
            <FileCode size={14} className="text-primary" />
            <span>Do_An_Tot_Nghiep.pdf</span>
          </div>
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">
            Chuẩn hóa CV
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
          <span className="text-[11px] text-gray-500">Mức độ tự tin</span>
          <span className="text-[11px] font-bold text-gray-900">90% · Đạt chuẩn</span>
        </div>
      </div>
    ),
  },
  {
    id: 'career-switcher',
    badge: 'Bước ngoặt',
    title: 'Chuyển việc & Đổi ngành',
    roleSubtitle: 'Chinh phục cơ hội mới',
    goal: 'Khớp nối kinh nghiệm cũ với JD mới và giải thích lý do chuyển đổi thuyết phục.',
    icon: BriefcaseBusiness,
    isPopular: true,
    features: [
      'Làm nổi bật kỹ năng chuyển giao (Transferable Skills)',
      'Tự động so khớp độ tương thích CV với JD ngành mới',
      'Kịch bản trả lời câu hỏi lý do đổi định hướng nghề',
    ],
    tags: ['Chuyển ngành', 'Mid-level', 'Cơ hội mới'],
    ctaText: 'Tối ưu chuyển đổi',
    ctaHref: '/register',
    widget: (
      <div className="flex flex-col justify-between rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium text-gray-900">
            <ArrowRightLeft size={13} className="text-primary" />
            <span>Kinh nghiệm cũ ➔ Vị trí mới</span>
          </div>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10.5px] font-bold text-primary">
            85% Kỹ năng khớp
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 border border-primary/10 shadow-2xs">
          <span className="text-[11px] text-gray-600">Câu hỏi lý do đổi ngành</span>
          <span className="text-[11px] font-bold text-emerald-700">Đã có kịch bản</span>
        </div>
      </div>
    ),
  },
  {
    id: 'senior-lead',
    badge: 'Bứt phá',
    title: 'Senior & Thăng tiến',
    roleSubtitle: 'Vươn tới vị trí quản lý',
    goal: 'Nâng tầm câu trả lời với tư duy chiến lược, quản trị và giải quyết bài toán quy mô lớn.',
    icon: TrendingUp,
    features: [
      'Phỏng vấn chuyên sâu System Design & Leadership',
      'Định lượng kết quả và tác động kinh doanh theo STAR',
      'Xử lý tình huống quản trị và điều phối đội ngũ',
    ],
    tags: ['Senior', 'Team Lead', 'Quản lý'],
    ctaText: 'Nâng tầm vị thế',
    ctaHref: '/register',
    widget: (
      <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 text-xs transition-colors group-hover:border-primary/20 group-hover:bg-primary/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium text-gray-800">
            <Crown size={14} className="text-amber-500" />
            <span>Leadership & System</span>
          </div>
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
            Đánh giá 95/100
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 border border-gray-100 shadow-2xs">
          <span className="text-[11px] text-gray-500">Tư duy chiến lược</span>
          <span className="text-[11px] font-bold text-gray-900">Sẵn sàng Lead</span>
        </div>
      </div>
    ),
  },
];

export function UseCasesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className="scroll-mt-24 border-b border-gray-200 bg-gray-50/60 px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Minimal Clean Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            Dành cho bạn
          </span>
          <h2
            id="use-cases-heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl"
          >
            Đồng hành trên mọi nấc thang sự nghiệp.
          </h2>
          <p className="mt-2.5 text-base text-gray-600">
            Kịch bản luyện tập được cá nhân hóa theo từng mục tiêu ứng tuyển.
          </p>
        </div>

        {/* 3 Native UI Persona Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {USE_CASES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex flex-col justify-between rounded-2xl bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                  item.isPopular
                    ? 'border-2 border-primary shadow-xl shadow-primary/10'
                    : 'border border-gray-200 shadow-xs hover:border-primary/40 hover:shadow-md'
                }`}
              >
                {/* Popular Highlight Badge */}
                {item.isPopular && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                      <Sparkles size={11} />
                      Phổ biến nhất
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon & Category Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                        item.isPopular
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Goal */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold tracking-tight text-gray-950 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">{item.roleSubtitle}</p>
                    <p className="mt-2.5 text-xs leading-relaxed text-gray-600">{item.goal}</p>
                  </div>

                  {/* Native Interactive Micro-Widget */}
                  <div className="mt-5">{item.widget}</div>

                  {/* Feature Checklist */}
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span className="leading-snug text-[11.5px]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Tags & CTA Link */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-gray-50 border border-gray-100 px-2 py-0.5 text-[10.5px] font-medium text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={item.ctaHref}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
                      item.isPopular
                        ? 'bg-primary text-white hover:bg-primary-pressed shadow-sm'
                        : 'bg-gray-50 text-gray-800 border border-gray-200 hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                  >
                    <span>{item.ctaText}</span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UseCasesSection;
