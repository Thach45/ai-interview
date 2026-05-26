import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from './subscription.data';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-[24px] font-extrabold text-text-primary text-center mb-8 tracking-tight">
        Câu hỏi thường gặp
      </h2>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-primary/20 transition-colors"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-[14px] font-semibold text-text-primary pr-4">{item.q}</span>
              <span className={`material-symbols-outlined text-[20px] text-text-tertiary transition-transform duration-300 shrink-0 ${openIdx === idx ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            <AnimatePresence>
              {openIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4 text-[13px] text-text-secondary leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <p className="text-center text-[13px] text-text-tertiary mt-6">
        Không tìm thấy câu trả lời? Liên hệ đội ngũ hỗ trợ của chúng tôi:{' '}
        <a href="mailto:support@x-interview.com" className="text-primary font-semibold hover:underline">
          support@x-interview.com
        </a>
      </p>
    </section>
  );
};
