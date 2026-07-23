import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Wand2, FileCheck2, Sparkles, Play, XCircle } from 'lucide-react';
import { SplitText } from '../../../shared/animations/SplitText';
import { TiltCard } from '../../../shared/animations/TiltCard';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-5xl aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <Play size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-lg">Đang kết nối luồng Live: {title}</p>
              <p className="text-sm mt-2">Video hướng dẫn đang được biên tập. Tính năng trải nghiệm trực tiếp sẽ sớm mở cho tài khoản của bạn.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CVBuilderShowcase: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="cv-builder" className="relative py-24 md:py-32 overflow-hidden bg-[#fafafa]">
      
      <VideoModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo || ''} />
      
      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="flex-1 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-[11px] font-bold rounded-full mb-6 uppercase tracking-wider"
            >
              <Sparkles size={14} />
              <span>Tính năng mới</span>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-4 tracking-tight"
            >
              Xây dựng CV chuẩn ATS chỉ trong 5 phút
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-[16px] leading-relaxed mb-8"
            >
              Không còn đau đầu với việc thiết kế và căn lề. Công cụ Builder của chúng tôi sẽ tự động sinh ra những mẫu CV chuyên nghiệp, vượt qua mọi hệ thống lọc hồ sơ (ATS) khắt khe nhất.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => setActiveVideo('Xây dựng CV')} 
                className="group flex items-center gap-2 font-bold text-gray-900 hover:text-primary transition-colors"
              >
                <div className="size-10 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Play size={16} className="ml-1" />
                </div>
                Xem Cách Hoạt Động
              </button>
            </motion.div>
            
            {/* Feature List */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-10 grid grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-2">
                <div className="size-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                  <Wand2 size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-[15px]">Thiết kế tự động</h4>
                <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Chọn template, nhập thông tin, có ngay CV đẹp mắt.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="size-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-green-600">
                  <FileCheck2 size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-[15px]">Tối ưu hóa ATS</h4>
                <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Đảm bảo cấu trúc thân thiện với các bộ lọc tự động.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Right Visual (Tilt 3D) */}
          <div className="relative lg:h-[600px] flex items-center justify-center" style={{ perspective: "1000px" }}>
            
            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 z-20 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
            >
              <div className="size-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 font-medium">Điểm ATS</p>
                <p className="text-[16px] font-bold text-gray-900">100/100</p>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-6 z-20 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
            >
              <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Wand2 size={16} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">AI Optimize</p>
              </div>
            </motion.div>

            {/* The 3D Mockup */}
            <TiltCard depth={15} className="w-full max-w-[500px] shadow-2xl rounded-[2rem] border-[8px] border-white/50 bg-white/30 backdrop-blur-3xl overflow-hidden">
              <div className="bg-white w-full h-[500px] rounded-2xl flex flex-col overflow-hidden shadow-inner border border-gray-200/50">
                
                {/* Mockup Topbar */}
                <div className="h-12 border-b border-gray-100 bg-gray-50/80 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-400" />
                    <div className="size-3 rounded-full bg-amber-400" />
                    <div className="size-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="mx-auto w-32 h-4 bg-gray-200/50 rounded-full" />
                  </div>
                </div>

                {/* Mockup Body (Split View) */}
                <div className="flex-1 flex bg-[#f8f9fa]">
                  {/* Sidebar (Form) */}
                  <div className="w-2/5 border-r border-gray-100 bg-white p-4 flex flex-col gap-4">
                    <div className="h-4 w-20 bg-gray-200 rounded-full" />
                    <div className="h-8 w-full bg-gray-100 rounded-lg" />
                    <div className="h-24 w-full bg-gray-100 rounded-lg" />
                    <div className="h-4 w-24 bg-gray-200 rounded-full mt-2" />
                    <div className="h-8 w-full bg-gray-100 rounded-lg" />
                  </div>
                  
                  {/* Main Content (CV Preview) */}
                  <div className="w-3/5 p-4 flex items-center justify-center bg-gray-100">
                    <div className="w-full h-full bg-white rounded shadow-sm p-4 flex flex-col gap-3">
                      <div className="h-6 w-32 bg-gray-300 rounded-full mx-auto" />
                      <div className="h-2 w-20 bg-primary/20 rounded-full mx-auto mb-2" />
                      <div className="flex gap-2">
                        <div className="w-1/3 h-16 bg-gray-100 rounded" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-2 w-full bg-gray-100 rounded-full" />
                          <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                          <div className="h-2 w-4/6 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-gray-100 my-1" />
                      <div className="flex gap-2">
                        <div className="w-1/3 h-16 bg-gray-100 rounded" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-2 w-full bg-gray-100 rounded-full" />
                          <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
