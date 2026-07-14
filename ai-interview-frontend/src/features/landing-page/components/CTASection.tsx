import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const customEase = [0.32, 0.72, 0, 1];

export const CTASection: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="bg-white border-t border-gray-100 pt-32 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 1, ease: customEase }}
          className="text-5xl md:text-7xl lg:text-[9rem] font-bold tracking-tighter text-gray-900 mb-12 leading-[0.85]"
        >
          Bắt đầu <br className="hidden md:block"/>hành trình mới.
        </motion.h2>
        
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1 }}>
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="inline-flex group items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-bold text-[17px] shadow-2xl hover:bg-primary-pressed transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] shadow-primary/20">
            Tạo hồ sơ đầu tiên
            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
