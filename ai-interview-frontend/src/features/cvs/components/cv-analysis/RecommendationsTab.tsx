import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  result: any;
  handleOptimize: () => void;
  isOptimizing: boolean;
}

export const RecommendationsTab = ({ result, handleOptimize, isOptimizing }: Props) => {
  return (
    <motion.div
      key="recommendations"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <p className="text-[14px] text-gray-600 mb-6 bg-white p-4 rounded-xl border border-gray-200">
        Dựa trên phân tích yêu cầu công việc và CV của bạn, AI của chúng tôi đề xuất các bước hành động sau để tối ưu hóa hồ sơ của bạn.
      </p>
      
      {result.improvementSuggestions.map((rec: any, i: number) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              rec.priority === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
            }`}>
              <TrendingUp size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors">{rec.title}</h4>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
                  rec.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  Mức độ: {rec.priority}
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                {rec.desc}
              </p>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[12px] font-semibold text-gray-800">💡 Giải pháp AI gợi ý:</p>
                <p className="text-[12px] text-gray-600 mt-1">{rec.solution}</p>
              </div>
              
              <div className="mt-3">
                <button className="text-[12px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                  Áp dụng gợi ý này bằng AI <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* CTA Update CV */}
      <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 text-center">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <Sparkles className="text-primary" size={24} />
        </div>
        <h3 className="text-[16px] font-bold text-gray-900 mb-2">Sẵn sàng để nổi bật?</h3>
        <p className="text-[13px] text-gray-600 mb-5 max-w-sm mx-auto">
          Để AI của chúng tôi tự động viết lại CV của bạn dựa trên các đề xuất trên và yêu cầu công việc.
        </p>
        <button 
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="px-6 py-2.5 bg-primary text-white text-[14px] font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-70"
        >
          Cập nhật CV tự động
        </button>
      </div>
    </motion.div>
  );
};
