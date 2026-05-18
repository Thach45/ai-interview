import React from 'react';
import { motion } from 'framer-motion';
import type { Testimonial } from './subscription.data';

interface Props {
  items: Testimonial[];
  direction?: 'left' | 'right';
  speed?: number;
}

const StarIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const TestimonialMarquee: React.FC<Props> = ({ items, direction = 'left', speed = 35 }) => {
  const doubled = [...items, ...items];
  const totalWidth = items.length * 380; // approx card width + gap

  return (
    <div className="overflow-hidden relative group py-2">
      {/* Left/Right fade masks */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-5"
        animate={{ x: direction === 'left' ? [0, -totalWidth] : [-totalWidth, 0] }}
        transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: speed, ease: 'linear' } }}
        style={{ willChange: 'transform' }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {doubled.map((t, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[350px] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-default select-none"
            onMouseEnter={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) container.style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) container.style.animationPlayState = 'running';
            }}
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(t.rating)].map((_, i) => <StarIcon key={i} />)}
            </div>

            {/* Content */}
            <p className="text-[13px] text-text-secondary leading-relaxed mb-4 line-clamp-3">
              "{t.content}"
            </p>

            {/* User & Tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[13px] font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-text-primary">{t.name}</p>
                  <p className="text-[11px] text-text-tertiary">{t.role}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${t.tagColor}`}>
                {t.tag}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
