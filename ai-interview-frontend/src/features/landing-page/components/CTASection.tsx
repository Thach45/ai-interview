import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const customEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="border-t border-gray-200 bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: customEase }}
          className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl md:text-6xl"
        >
          Khởi đầu sự nghiệp <br className="hidden md:block"/>mơ ước hôm nay.
        </motion.h2>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1 }}>
          <Link href={isAuthenticated ? "/dashboard" : "/register"} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Tạo hồ sơ đầu tiên
            <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
