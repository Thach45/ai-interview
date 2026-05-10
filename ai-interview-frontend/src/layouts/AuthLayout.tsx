import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  image: string;
  title: string;
  subtitle: string;
  isReverse?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, image, title, subtitle }) => {
  return (
    <div className="h-screen w-full flex bg-white font-sans selection:bg-primary/20 overflow-hidden relative">
      {/* Global Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-unified" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#000" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-unified)" />
        </svg>
      </div>

      {/* Decorative Dots */}
      <div className="absolute top-[10%] left-[5%] size-3 bg-[#e6e0f5] rounded-full blur-[1px]" />
      <div className="absolute bottom-[15%] right-[10%] size-4 bg-[#fef7d6] rounded-full blur-[1px]" />
      <div className="absolute top-[40%] right-[30%] size-2 bg-[#d9f3e1] rounded-full blur-[1px]" />

      <div className="flex w-full h-full">
        {/* Left Side: 60% Hero Area */}
        <div className="hidden lg:flex w-[60%] flex-col items-center justify-center p-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xl"
          >
            <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] scale-90" />
              <img 
                src={image} 
                alt="Hero" 
                className="relative z-10 w-full h-auto max-h-[50vh] object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.1)] group-hover:translate-y-[-10px] transition-transform duration-700"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-extrabold text-[#1a1a1a] tracking-tighter leading-[1.05]">
                {title}
              </h2>
              <p className="text-[#5d5b54] text-[19px] leading-relaxed max-w-sm opacity-80">
                {subtitle}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: 40% Form Area */}
        <div className="w-full lg:w-[40%] flex items-center justify-center p-8 md:p-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-[380px] flex flex-col h-full justify-center"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-14 group shrink-0">
              <div className="size-9 bg-[#5645d4] rounded-[8px] flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-white text-[22px]">cognition</span>
              </div>
              <span className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">AI Interview.</span>
            </Link>

            <div className="flex-1 flex flex-col justify-center">
              {children}
            </div>

            <div className="mt-16 pt-6 border-t border-[#ede9e4] text-[13px] text-[#a4a097]">
              &copy; 2024 AI Interview Platform.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
