'use client';

import React from 'react';
import Link from 'next/link';
import { Check, FileText, MessageSquareText, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  image: string;
  title: string;
  subtitle: string;
  isReverse?: boolean;
}

const PRODUCT_ITEMS = [
  { label: 'Arion Interview', icon: MessageSquareText, selected: true },
  { label: 'Arion CV Optimizer', icon: FileText },
  { label: 'Arion Coaching', icon: Sparkles },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-[100svh] bg-white p-0 font-sans selection:bg-black/10 lg:bg-gray-100 lg:p-px">
      <div className="grid min-h-[100svh] overflow-hidden bg-white lg:grid-cols-[minmax(0,1.7fr)_minmax(430px,1fr)] lg:rounded-[28px]">
        <section aria-label="Giới thiệu Arion" className="relative hidden overflow-hidden bg-[#050505] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_70%_45%,rgba(255,255,255,0.12),transparent_0%,transparent_45%),linear-gradient(120deg,transparent_35%,rgba(255,255,255,0.035)_50%,transparent_60%)]" />
          <div className="absolute -bottom-24 -left-[15%] h-[66%] w-[130%] opacity-30 [background:repeating-radial-gradient(ellipse_at_45%_100%,transparent_0,transparent_18px,rgba(255,255,255,0.25)_19px,transparent_20px)]" />
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: [0.86, 1, 0.9], y: [0, -4, 0] }}
            transition={prefersReducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-[65%] top-[50%] z-[1] aspect-square w-[min(34vw,380px)] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute inset-[24%] rounded-full bg-white/20 blur-3xl" />
            {/* <div className="relative size-full" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.12) 28%, black 72%, black 100%)', maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.12) 28%, black 72%, black 100%)' }}>
              <img src="/logo/arion-auth-horse.png" alt="" className="size-full object-contain drop-shadow-[0_0_22px_rgba(255,255,255,0.4)]" />
            </div> */}
          </motion.div>
          <svg aria-hidden="true" viewBox="0 0 520 620" className="pointer-events-none absolute left-[65%] top-[50%] z-[1] h-[min(82vh,780px)] w-auto -translate-x-1/2 -translate-y-1/2 overflow-visible">
            <path d="M260 22 500 560H20L260 22Z" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.4" />
            <path d="M260 135 405 460H115L260 135Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
            <path d="M260 205 340 385H180L260 205Z" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
            <motion.path d="M260 22 500 560H20L260 22Z" fill="none" stroke="#050505" strokeWidth="3.5" strokeDasharray="110 260" initial={{ strokeDashoffset: 0 }} animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -370] }} transition={prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'linear' }} />
            <motion.path d="M260 135 405 460H115L260 135Z" fill="none" stroke="#050505" strokeWidth="3" strokeDasharray="78 190" initial={{ strokeDashoffset: -90 }} animate={prefersReducedMotion ? undefined : { strokeDashoffset: [-90, -360] }} transition={prefersReducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: 'linear' }} />
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="inline-flex"><img src="/logo/logo.png" alt="Arion" className="h-16 w-auto invert" /></Link>

          </div>

          <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 mt-auto max-w-xl pb-10 xl:pb-16">

            <h1 className="mt-8 text-5xl font-semibold leading-[1.06] tracking-tight xl:text-6xl">Chạm gần hơn tới cơ hội.</h1>
            <p className="mt-7 max-w-[34ch] text-base leading-7 text-white/65">Arion giúp bạn xây CV rõ ràng hơn, luyện phỏng vấn sát thực tế và tiến bộ ở từng bước chuẩn bị.</p>

            <div className="mt-10 grid max-w-2xl gap-4 xl:grid-cols-[1.2fr_0.9fr]">
              <div className="rounded-2xl border border-white/20 bg-white/[0.06] p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs"><span className="inline-flex items-center gap-2 font-medium"><span className="flex size-7 items-center justify-center rounded-full border border-white/30"><Sparkles size={13} /></span>Arion Interview</span><span className="text-emerald-300">● Live&nbsp;&nbsp;10:24</span></div>
                <div className="mt-5 rounded-xl bg-white/[0.09] p-4 text-sm leading-6 text-white/90">Kể về một dự án thử thách mà bạn từng giải quyết.</div>
                <div className="mt-5 flex h-10 items-center gap-1 overflow-hidden" aria-hidden="true">{Array.from({ length: 45 }, (_, index) => <span key={index} className="w-0.5 flex-1 rounded-full bg-white/70" style={{ height: `${18 + ((index * 17) % 70)}%` }} />)}</div>
              </div>
              <div className="flex flex-col justify-center gap-3">
                {PRODUCT_ITEMS.map(({ icon: Icon, label, selected }) => <div key={label} className={`flex items-center gap-3 rounded-full border px-4 py-3 text-sm ${selected ? 'border-white/40 bg-white/10 text-white' : 'border-white/15 text-white/70'}`}><Icon size={16} aria-hidden="true" /><span className="flex-1">{label}</span>{selected ? <Check size={16} aria-hidden="true" /> : null}</div>)}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-12 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 opacity-40 [background:repeating-radial-gradient(ellipse_at_45%_120%,transparent_0,transparent_12px,rgba(17,24,39,0.16)_13px,transparent_14px)]" />
          <motion.div initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.1 }} className="relative z-10 w-full max-w-[430px]">
            <Link href="/" className="mb-16 inline-flex lg:hidden"><img src="/logo/logo.png" alt="Arion" className="h-14 w-auto" /></Link>
            {children}
            <p className="mt-14 text-center text-xs text-gray-400">© {new Date().getFullYear()} Arion. All rights reserved.</p>
          </motion.div>
        </section>
      </div>
    </main>
  );
};
