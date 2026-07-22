import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Wand2 } from 'lucide-react';
import { SplitText } from '../../../shared/animations/SplitText';
import { TiltCard } from '../../../shared/animations/TiltCard';
import { VideoModal } from './VideoModal';

export const CVBuilderShowcase: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="cv-builder" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32">
      <VideoModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo || ''} />
      
      {/* Feature: CV Builder */}
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Text Content */}
        <div className="flex-1 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-[11px] font-bold rounded-full mb-6 uppercase tracking-wider"
          >
            <Sparkles size={14} className="text-primary" /> 
            <span>Tính năng mới: Trình tạo CV</span>
          </motion.div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            <SplitText text="Xây dựng CV chuẩn ATS chỉ trong 5 phút" delay={0.1} />
          </h3>
          
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
            transition={{ delay: 0.5 }}
          >
            <button onClick={() => setActiveVideo('Trình tạo CV')} className="group flex items-center gap-2 font-bold text-gray-900 hover:text-primary transition-colors">
               <div className="size-10 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                 <Play size={16} className="ml-1" />
               </div>
               Xem Cách Hoạt Động
            </button>
          </motion.div>
        </div>
        
        {/* Right Visual (Tilt 3D) */}
        <div className="flex-1 w-full relative flex items-center justify-center" style={{ perspective: "1000px" }}>
          
          {/* Floating Badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -top-6 -right-4 z-20 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
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
            className="absolute -bottom-6 -left-4 z-20 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
          >
            <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Wand2 size={16} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">AI Optimize</p>
            </div>
          </motion.div>

          {/* The 3D Mockup */}
          <TiltCard depth={15} className="w-full max-w-[600px] shadow-2xl rounded-[2rem] border-[8px] border-white/50 bg-white/30 backdrop-blur-3xl overflow-hidden">
            <div className="bg-white w-full h-[400px] rounded-2xl flex flex-col overflow-hidden shadow-inner border border-gray-200/50">
              
              {/* Mockup Topbar */}
              <div className="h-8 border-b border-gray-100 bg-gray-50 flex items-center px-4 gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400" />
                <div className="size-2.5 rounded-full bg-amber-400" />
                <div className="size-2.5 rounded-full bg-green-400" />
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
    </section>
  );
};
