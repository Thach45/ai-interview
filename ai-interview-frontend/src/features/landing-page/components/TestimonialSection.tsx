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
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 text-gray-900 text-[11px] font-bold rounded-full mb-6 uppercase tracking-[0.1em] border border-gray-200">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            Cộng đồng
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-4">
            Được tin tưởng bởi hàng nghìn ứng viên
          </h2>
          <p className="text-[17px] text-gray-500 font-medium">
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
