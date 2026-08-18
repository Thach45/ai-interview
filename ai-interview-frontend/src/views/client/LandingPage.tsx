'use client';

import Link from 'next/link';
import { ArrowRight, Mic, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { LandingHeader } from '../../features/landing-page/components/LandingHeader';
import { FeatureMockups } from '../../features/landing-page/components/FeatureMockups';
import { StatsSection } from '../../features/landing-page/components/StatsSection';
import { PricingSection } from '../../features/landing-page/components/PricingSection';
import { TestimonialSection } from '../../features/landing-page/components/TestimonialSection';
import { HowItWorksSection } from '../../features/landing-page/components/HowItWorksSection';
import { UseCasesSection } from '../../features/landing-page/components/UseCasesSection';
import { FAQSection } from '../../features/landing-page/components/FAQSection';
import { CTASection } from '../../features/landing-page/components/CTASection';
import { Footer } from '../../components/layout/Footer';
import { PurchaseNotification } from '../../features/landing-page/components/PurchaseNotification';
import TextType from '../../shared/animations/TextType';

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-gray-600"><span>{label}</span><span className="font-medium text-gray-950">{value}</span></div>
      <div className="mt-1.5 h-1 rounded-full bg-gray-200"><div className="h-full w-[85%] rounded-full bg-black" /></div>
    </div>
  );
}

export function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();
  const reveal = prefersReducedMotion
    ? { initial: false, animate: {} }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="landing-theme flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-gray-950">
      <LandingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 px-6 pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <motion.div {...reveal} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <h1 className="mt-7 max-w-[12ch] text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"><span className="block">Luyện tốt hơn.</span><span className="sr-only">Luyện phỏng vấn AI và tối ưu CV theo JD để ứng tuyển tự tin hơn.</span><span aria-hidden="true"><TextType text="Ứng tuyển tự tin hơn." loop={false} initialDelay={180} typingSpeed={42} showCursor cursorClassName="text-ai" className="block min-h-[2.15em] text-ai" /></span></h1>
              <p className="mt-6 max-w-[48ch] text-base leading-7 text-gray-600 sm:text-lg">Tối ưu CV theo vị trí bạn muốn, luyện phỏng vấn với AI và nhận phản hồi cụ thể để chuẩn bị tốt hơn cho cơ hội tiếp theo.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href={isAuthenticated ? '/dashboard' : '/register'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">Bắt đầu miễn phí <ArrowRight size={16} aria-hidden="true" /></Link><a href="#features" className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">Xem cách hoạt động</a></div>
              <div className="mt-10 flex flex-wrap gap-2"><span className="rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">CV Optimization</span><span className="rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">Mock Interview</span><span className="rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">Personalized Feedback</span></div>
            </motion.div>

            <motion.div {...reveal} transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }} className="grid min-h-[420px] grid-cols-[1.24fr_0.76fr] gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm sm:p-4">
              <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5"><div className="flex items-center justify-between border-b border-gray-100 pb-4"><div><p className="text-sm font-medium">Arion Interview</p><p className="mt-1 text-xs text-gray-500">Frontend Engineer</p></div><span className="text-xs font-medium text-emerald-700">● Live</span></div><div className="mt-4 flex flex-1 flex-col justify-between rounded-md bg-gray-50 p-4"><div><div className="flex size-7 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">AI</div><p className="mt-4 max-w-[31ch] text-sm leading-6 text-gray-800">Hãy kể về một dự án bạn đã cải thiện đáng kể trải nghiệm người dùng.</p></div><div className="rounded-md border border-gray-200 bg-white p-3"><p className="text-xs text-gray-400">Câu trả lời của bạn</p><div className="mt-4 flex items-center justify-between"><span className="text-xs text-gray-500">Đang lắng nghe...</span><span className="flex size-9 items-center justify-center rounded-full bg-black text-white"><Mic size={15} /></span></div></div></div></div>
              <aside className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5"><p className="text-xs font-medium text-gray-500">Overall score</p><p className="mt-3 text-4xl font-semibold tracking-tight">85<span className="text-sm text-gray-400">/100</span></p><div className="mt-4 h-1.5 rounded-full bg-gray-200"><div className="h-full w-[85%] rounded-full bg-black" /></div><div className="mt-6 space-y-4"><ScoreRow label="Giao tiếp" value="90" /><ScoreRow label="Kỹ thuật" value="85" /><ScoreRow label="Giải quyết vấn đề" value="80" /><ScoreRow label="Tự tin" value="85" /></div><div className="mt-6 border-t border-gray-100 pt-4"><p className="text-xs font-medium">Feedback</p><p className="mt-2 text-xs leading-5 text-gray-500">Thêm số liệu cụ thể để câu trả lời thuyết phục hơn.</p></div></aside>
            </motion.div>
          </div>
        </section>

        <HowItWorksSection />
        <FeatureMockups />
        <UseCasesSection />
        <StatsSection />
        <TestimonialSection />
        <FAQSection />
        <PricingSection />
      </main>

      <CTASection />
      <Footer />
      <PurchaseNotification />
    </div>
  );
}

export default LandingPage;
