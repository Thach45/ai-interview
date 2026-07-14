import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { label: 'Ứng viên tin dùng', value: 50000, suffix: '+' },
  { label: 'Lượt phỏng vấn đã thực hiện', value: 120000, suffix: '+' },
  { label: 'CV được phân tích', value: 250000, suffix: '+' },
  { label: 'Công ty công nghệ', value: 500, suffix: '+' },
];

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      const updateCounter = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
          setCount(Math.floor(easeProgress * value));
          requestAnimationFrame(updateCounter);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(updateCounter);
    }
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString('en-US')}</span>;
};

export const StatsSection: React.FC = () => {
  return (
    <section className="py-24 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-x divide-transparent lg:divide-gray-100">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center text-center lg:px-6"
            >
              <div className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 mb-2">
                <AnimatedCounter value={stat.value} />{stat.suffix}
              </div>
              <div className="text-[13px] font-medium text-gray-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
