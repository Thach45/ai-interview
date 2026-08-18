import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { label: 'Ứng viên tin dùng', value: 50000, suffix: '+' },
  { label: 'Lượt phỏng vấn đã thực hiện', value: 120000, suffix: '+' },
  { label: 'CV được phân tích', value: 250000, suffix: '+' },
  { label: 'Công ty công nghệ', value: 500, suffix: '+' },
];

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const startTime = performance.now();
    let frameId = 0;

    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * value));
        frameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString('en-US')}</span>;
};

export const StatsSection: React.FC = () => (
  <section className="border-b border-gray-200 bg-white py-16 sm:py-20">
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-gray-200">
        {STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col items-center text-center lg:px-8"
          >
            <div className="mb-2 text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              <AnimatedCounter value={stat.value} />{stat.suffix}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
