'use client';

import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CirclePlay,
  FileSearch,
  MessageSquareText,
  Mic,
  Quote,
} from 'lucide-react';
import Link from 'next/link';

type FeatureKind = 'cv' | 'interview' | 'feedback';

interface Feature {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  videoTitle: string;
  reviews: FeatureReview[];
  kind: FeatureKind;
  icon: LucideIcon;
}

interface FeatureReview {
  name: string;
  initials: string;
  role: string;
  company: string;
  quote: string;
}

const FEATURES: Feature[] = [
  {
    eyebrow: '01 · CV Builder & Optimizer',
    title: 'Biến CV thành một hồ sơ dễ được nhìn thấy.',
    description: 'Đối chiếu CV với mô tả công việc, tìm điểm thiếu và chỉnh sửa ngay trong một workspace rõ ràng.',
    cta: 'Tối ưu CV',
    href: '/cv-builder/templates',
    videoTitle: 'Cách tối ưu CV theo JD',
    reviews: [
      { name: 'Minh Trần', initials: 'MT', role: 'Frontend Developer', company: 'Momo', quote: 'Tôi biết chính xác cần sửa gì trước khi gửi hồ sơ.' },
      { name: 'Hà Nguyễn', initials: 'HN', role: 'Product Designer', company: 'Tiki', quote: 'Phần đối chiếu JD giúp CV của tôi tập trung hơn hẳn.' },
    ],
    kind: 'cv',
    icon: FileSearch,
  },
  {
    eyebrow: '02 · AI Mock Interview',
    title: 'Luyện câu trả lời trước khi vào phòng phỏng vấn.',
    description: 'Mô phỏng câu hỏi theo CV và vị trí ứng tuyển. Bạn có thể luyện bằng văn bản hoặc giọng nói.',
    cta: 'Bắt đầu luyện tập',
    href: '/interviews/setup',
    videoTitle: 'Cách bắt đầu một buổi mock interview',
    reviews: [
      { name: 'Anh Lê', initials: 'AL', role: 'Business Analyst', company: 'VNG', quote: 'Phần follow-up khiến buổi luyện tập sát với phỏng vấn thật hơn.' },
      { name: 'Thảo Phạm', initials: 'TP', role: 'Marketing Executive', company: 'Shopee', quote: 'Tôi bớt bị khựng khi gặp câu hỏi tình huống.' },
    ],
    kind: 'interview',
    icon: Mic,
  },
  {
    eyebrow: '03 · Feedback & Coaching',
    title: 'Xem rõ điểm mạnh và việc cần cải thiện tiếp theo.',
    description: 'Sau mỗi buổi luyện tập, nhận một báo cáo ngắn gọn để biến phản hồi thành kế hoạch chuẩn bị cụ thể.',
    cta: 'Xem báo cáo mẫu',
    href: '/interviews/report',
    videoTitle: 'Cách đọc báo cáo phỏng vấn',
    reviews: [
      { name: 'Linh Đỗ', initials: 'LD', role: 'UX Researcher', company: 'NashTech', quote: 'Báo cáo không chỉ chấm điểm mà còn chỉ cho tôi cách trả lời tốt hơn.' },
      { name: 'Hùng Nguyễn', initials: 'HN', role: 'Data Analyst', company: 'Viettel Digital', quote: 'Tôi có thể chọn ngay một việc để cải thiện cho lần luyện tiếp theo.' },
    ],
    kind: 'feedback',
    icon: MessageSquareText,
  },
];

function ProductMockup({ kind }: { kind: FeatureKind }) {
  if (kind === 'cv') {
    return (
      <div className="grid h-full min-h-[390px] grid-cols-[0.86fr_1.14fr] bg-gray-50">
        <div className="border-r border-gray-200 bg-white p-4 sm:p-5">
          <p className="text-xs font-medium text-gray-950">CV của bạn</p>
          <p className="mt-1 text-xs text-gray-500">Frontend Developer</p>
          <div className="mt-6 space-y-3">
            {['Thông tin cá nhân', 'Kinh nghiệm', 'Kỹ năng', 'Dự án'].map((item, index) => (
              <div key={item} className={`rounded-md px-3 py-2 text-xs ${index === 2 ? 'bg-gray-100 font-medium text-gray-950' : 'text-gray-500'}`}>{item}</div>
            ))}
          </div>
          <button className="mt-8 w-full rounded-md bg-primary px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-primary-pressed">Xem trước CV</button>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div><p className="text-sm font-medium text-gray-950">Độ phù hợp với JD</p><p className="mt-1 text-xs text-gray-500">Frontend Engineer · Middle</p></div>
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">82%</span>
          </div>
          <div className="mt-5 space-y-3">
            <MockRow label="React & TypeScript" value="Phù hợp" positive />
            <MockRow label="Docker & CI/CD" value="Cần bổ sung" />
            <MockRow label="System design" value="Cần ví dụ" />
          </div>
          <div className="mt-6 rounded-md border border-gray-200 bg-white p-3">
            <p className="text-xs font-medium text-gray-950">Gợi ý tiếp theo</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">Bổ sung một bullet về pipeline triển khai và tác động đo được trong dự án gần nhất.</p>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'interview') {
    return (
      <div className="flex h-full min-h-[390px] flex-col bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div><p className="text-sm font-medium text-gray-950">Mock interview</p><p className="mt-1 text-xs text-gray-500">Frontend Engineer · Câu 3 / 8</p></div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />Đang luyện tập</span>
        </div>
        <div className="mt-5 flex flex-1 flex-col justify-between rounded-md border border-gray-200 bg-gray-50 p-4">
          <div>
            <div className="flex items-center gap-2"><div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">AI</div><p className="text-xs font-medium text-gray-950">Arion Interviewer</p></div>
            <p className="mt-4 max-w-[32ch] text-sm leading-6 text-gray-800">Hãy kể về một lần bạn phải cân bằng giữa deadline gấp và chất lượng kỹ thuật.</p>
          </div>
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-400">Câu trả lời của bạn</p>
            <div className="mt-4 flex items-center justify-between"><span className="text-xs text-gray-500">Đang lắng nghe...</span><span className="flex size-9 items-center justify-center rounded-full bg-primary text-white"><Mic size={15} /></span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[390px] flex-col bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div><p className="text-sm font-medium text-gray-950">Báo cáo buổi phỏng vấn</p><p className="mt-1 text-xs text-gray-500">Frontend Engineer · Hôm nay</p></div>
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Hoàn thành</span>
      </div>
      <div className="grid flex-1 gap-3 py-5 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Điểm tổng quan</p><p className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">85<span className="text-base text-gray-400">/100</span></p>
          <div className="mt-5 h-1.5 rounded-full bg-gray-200"><div className="h-full w-[85%] rounded-full bg-primary" /></div>
        </div>
        <div className="space-y-3 rounded-md border border-gray-200 p-4">
          <MockRow label="Giao tiếp" value="90" positive />
          <MockRow label="Kỹ thuật" value="85" positive />
          <MockRow label="Tính cụ thể" value="72" />
          <MockRow label="Tự tin" value="84" positive />
        </div>
      </div>
      <div className="rounded-md bg-primary/5 p-3 text-xs leading-5 text-primary">Lần tới, hãy lượng hóa kết quả dự án trước khi mô tả cách bạn triển khai.</div>
    </div>
  );
}

function MockRow({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><span className="text-xs text-gray-600">{label}</span><span className={`rounded-md px-2 py-1 text-[11px] font-medium ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{value}</span></div>;
}

function VideoCard({ feature }: { feature: Feature }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="mt-6 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="flex aspect-[16/7] items-center justify-center bg-gray-950 text-white"><span className="flex size-10 items-center justify-center rounded-full border border-white/30"><CirclePlay size={18} aria-hidden="true" /></span></div>
      <div className="flex items-center gap-3 p-3"><span className="min-w-0 flex-1"><span className="block text-xs font-medium text-gray-950">Video hướng dẫn</span><span className="mt-1 block truncate text-xs text-gray-500">{feature.videoTitle} · 01:20</span></span><ArrowRight size={16} className="shrink-0 text-gray-400" aria-hidden="true" /></div>
    </motion.div>
  );
}

function EvaluationCard({ feature }: { feature: Feature }) {
  return (
    <aside aria-label={`Đánh giá người dùng về ${feature.eyebrow}`} className="grid gap-4 md:grid-cols-2">
      {feature.reviews.map((review) => (
        <article key={review.name} className="flex min-h-[150px] flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Quote size={16} className="text-gray-950" aria-hidden="true" />
          <p className="mt-3 text-xs leading-5 text-gray-600">“{review.quote}”</p>
          <div className="mt-auto flex items-center gap-2.5 pt-4"><span className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">{review.initials}</span><div className="min-w-0"><p className="truncate text-xs font-medium text-gray-950">{review.name}</p><p className="truncate text-[11px] text-gray-500">{review.role} · {review.company}</p></div></div>
        </article>
      ))}
    </aside>
  );
}

export function FeatureMockups() {
  const prefersReducedMotion = useReducedMotion();
  const featureStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !window.matchMedia('(min-width: 1024px)').matches) return;

    const stack = featureStackRef.current;
    if (!stack) return;

    let isSnapping = false;
    let releaseTimer = 0;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8 || isSnapping) return;

      const sections = Array.from(stack.querySelectorAll<HTMLElement>('.feature-snap'));
      const viewportCenter = window.innerHeight / 2;
      const currentIndex = sections.findIndex((section) => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= viewportCenter && bottom >= viewportCenter;
      });
      if (currentIndex < 0) return;

      const currentSection = sections[currentIndex];
      const { top } = currentSection.getBoundingClientRect();
      const direction = event.deltaY > 0 ? 1 : -1;
      const isApproachingSection = (direction > 0 && top > 8 && top < 180)
        || (direction < 0 && top < -8 && top > -180);
      if (!isApproachingSection) return;

      event.preventDefault();
      isSnapping = true;
      currentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      releaseTimer = window.setTimeout(() => {
        isSnapping = false;
      }, 450);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.clearTimeout(releaseTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <section id="features" aria-labelledby="features-title" className="scroll-mt-24 border-b border-gray-200 bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Một nền tảng, ba bước chuẩn bị</p><h2 id="features-title" className="mt-5 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">Mọi thứ bạn cần cho cơ hội tiếp theo.</h2><p className="mt-5 text-base leading-7 text-gray-600">Dùng từng công cụ riêng lẻ, hoặc đi từ CV đến báo cáo trong cùng một hành trình.</p></div>
      </section>

      <div ref={featureStackRef}>
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        return <motion.section key={feature.kind} initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className={`feature-snap flex min-h-[100svh] items-start border-b border-gray-200 px-6 py-16 sm:py-20 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid items-start gap-8 lg:grid-cols-[0.78fr_1.4fr] lg:gap-10">
              <div className="flex flex-col justify-center"><div className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"><Icon size={14} className="text-primary" aria-hidden="true" />{feature.eyebrow}</div><h3 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">{feature.title}</h3><p className="mt-5 text-base leading-7 text-gray-600">{feature.description}</p><Link href={feature.href} className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{feature.cta}<ArrowRight size={16} aria-hidden="true" /></Link><VideoCard feature={feature} /></div>
              <motion.div initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}><div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"><ProductMockup kind={feature.kind} /></div><div className="mt-6"><p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-gray-500">Người dùng nói gì về tính năng này</p><EvaluationCard feature={feature} /></div></motion.div>
            </div>
          </div>
        </motion.section>;
      })}
      </div>
    </>
  );
}
