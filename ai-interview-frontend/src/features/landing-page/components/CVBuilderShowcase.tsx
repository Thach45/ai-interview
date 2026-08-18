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
    <section id="cv-builder" className="border-y border-gray-200 bg-gray-50 py-20 sm:py-24">
      
      <VideoModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo || ''} />
      
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="flex-1 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              <Sparkles size={14} />
              <span>Tính năng mới</span>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-semibold tracking-tight text-gray-950"
            >
              Xây dựng CV chuẩn ATS chỉ trong 5 phút
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-7 mt-4 text-base leading-7 text-gray-600"
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
                className="group inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex size-7 items-center justify-center rounded-sm bg-gray-100 text-primary">
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
                <div className="flex size-10 items-center justify-center rounded-md border border-gray-200 bg-white text-primary">
                  <Wand2 size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-[15px]">Thiết kế tự động</h4>
                <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Chọn template, nhập thông tin, có ngay CV đẹp mắt.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex size-10 items-center justify-center rounded-md border border-gray-200 bg-white text-green-600">
                  <FileCheck2 size={20} />
                </div>
                <h4 className="font-bold text-gray-900 text-[15px]">Tối ưu hóa ATS</h4>
                <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Đảm bảo cấu trúc thân thiện với các bộ lọc tự động.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Right Visual (Tilt 3D) */}
          <div className="relative flex items-center justify-center lg:h-[520px]">
            
            {/* Floating Badges */}
            <div className="absolute -right-3 -top-3 z-20 flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="size-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 font-medium">Điểm ATS</p>
                <p className="text-[16px] font-bold text-gray-900">100/100</p>
              </div>
            </div>
            
            <div className="absolute -bottom-3 -left-3 z-20 flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Wand2 size={16} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">AI Optimize</p>
              </div>
            </div>

            {/* The 3D Mockup */}
            <TiltCard depth={0} className="w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex h-[500px] w-full flex-col overflow-hidden bg-white">
                
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
