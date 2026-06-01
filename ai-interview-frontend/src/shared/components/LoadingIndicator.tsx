import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';

export type LoadingIndicatorType = 'normal' | 'ai';

interface LoadingIndicatorProps {
  type?: LoadingIndicatorType;
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
  aiSteps: string[];
}

const DEFAULT_AI_STEPS = [
  "Đang khởi tạo Engine AI...",
  "Đang thu thập và phân tích dữ liệu lịch sử hội thoại...",
  "Đánh giá ngữ nghĩa và độ chính xác của câu trả lời...",
  "Phân tích đa chiều: Kiến thức, Tư duy, Sự tự tin...",
  "Đang so sánh với khung năng lực chuẩn của vị trí...",
  "Tổng hợp nhận xét và chấm điểm từng câu hỏi...",
  "Xây dựng lộ trình cải thiện cá nhân hóa...",
  "Đang hoàn thiện báo cáo cuối cùng..."
];

const AiLoadingView = ({ title, subtitle, steps }: { title?: string, subtitle?: string, steps: string[] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Tự động tăng progress bar mượt mà
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) return 95; // Dừng lại ở 95% đợi API trả về
        return p + 0.5;
      });
    }, 100);

    // Thay đổi câu step mock sau mỗi khoảng thời gian
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
      
      {/* Icon Area */}
      <div className="relative mb-10 flex justify-center">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] animate-pulse w-32 h-32 m-auto"></div>
        
        {/* Central Icon */}
        <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-primary/10 border border-primary/20 z-10">
          <BrainCircuit size={64} className="text-primary animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <Sparkles size={24} className="text-amber-400 animate-spin-slow" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        
        {/* Orbiting particles (CSS only approach using rotation) */}
        <div className="absolute inset-0 animate-spin w-40 h-40 m-auto z-0" style={{ animationDuration: '8s' }}>
           <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
        </div>
        <div className="absolute inset-0 animate-spin w-48 h-48 m-auto z-0" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
           <div className="absolute bottom-0 right-1/2 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
        </div>
      </div>

      {/* Main Text */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight text-center">
        {title || 'AI đang xử lý dữ liệu'}
      </h2>
      <p className="text-gray-500 font-medium max-w-md text-center mb-10 text-[15px]">
        {subtitle || 'Vui lòng không đóng trình duyệt trong quá trình này.'}
      </p>

      {/* Progress Bar Area */}
      <div className="w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
        
        {/* Current Step Display */}
        <div className="flex items-center gap-3 h-8">
          <Loader2 size={20} className="text-primary animate-spin shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[15px] font-semibold text-gray-800 line-clamp-1"
            >
              {steps[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>

        {/* Previous Steps (Checkmarks) */}
        <div className="mt-2 space-y-2 h-[72px] overflow-hidden opacity-60">
          <AnimatePresence>
            {[...Array(currentStep)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="text-[13px] text-gray-500 truncate">{steps[i]}</span>
              </motion.div>
            )).reverse().slice(0, 2)} {/* Chỉ show 2 step hoàn thành gần nhất */}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  type = 'normal', 
  title, 
  subtitle,
  fullScreen = false,
  aiSteps
}) => {
  const steps = aiSteps && aiSteps.length > 0 ? aiSteps : DEFAULT_AI_STEPS;

  const content = (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-in fade-in duration-500 w-full px-4">
      {type === 'ai' ? (
        <AiLoadingView title={title} subtitle={subtitle} steps={steps} />
      ) : (
        <>
          <div className="relative mb-8">
             <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">
            {title || 'Đang tải dữ liệu...'}
          </h2>
          {subtitle && (
            <p className="text-gray-500 font-medium max-w-md text-center">
              {subtitle}
            </p>
          )}
        </>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <MainLayout hideSearch={true} fullHeight={true} maxWidth='100%' className="overflow-hidden bg-[#fafafa]">
        <div className="h-[calc(100vh-140px)] flex items-center justify-center">
          {content}
        </div>
      </MainLayout>
    );
  }

  return content;
};
