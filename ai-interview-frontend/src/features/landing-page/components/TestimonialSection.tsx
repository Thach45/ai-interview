import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialMarquee } from '../../subscription/TestimonialMarquee';
import { TESTIMONIALS } from '../../subscription/subscription.data';

const customEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: customEase } }
};

export const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-24 overflow-hidden border-t border-gray-200 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="mb-14 text-center"
        >
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            Cộng đồng
          </span>
          <h2 id="testimonials-heading" className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
            Được tin tưởng bởi hàng nghìn ứng viên
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Lắng nghe câu chuyện thành công từ những người đã chinh phục được công việc mơ ước.
          </p>
        </motion.div>

        {/* Marquee Rows */}
        <div className="flex flex-col gap-6">
          <TestimonialMarquee items={TESTIMONIALS.slice(0, 5)} direction="left" speed={30} />
          <TestimonialMarquee items={TESTIMONIALS.slice(5)} direction="right" speed={35} />
        </div>
      </div>
    </section>
  );
};
