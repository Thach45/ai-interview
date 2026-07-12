import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const OverviewTab = ({ result }: { result: any }) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" /> Điểm mạnh
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="mt-1 min-w-1.5 min-h-1.5 rounded-full bg-green-400"></div>
                <span className="text-[13px] text-gray-700 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle size={18} className="text-red-500" /> Điểm cần cải thiện
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="mt-1 min-w-1.5 min-h-1.5 rounded-full bg-red-400"></div>
                <span className="text-[13px] text-gray-700 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Keywords Box */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/50">
        <h3 className="text-[14px] font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" /> Từ khóa thiếu sót quan trọng
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.missingKeywords.length > 0 ? result.missingKeywords.map((keyword: string) => (
            <div key={keyword} className="px-3 py-1.5 bg-white text-amber-800 text-[12px] font-bold rounded-lg border border-amber-200 shadow-sm flex items-center gap-1.5">
              {keyword}
              <span className="material-symbols-outlined text-[14px] opacity-50">add_circle</span>
            </div>
          )) : (
            <p className="text-[13px] text-amber-700 font-medium">CV của bạn đã bao gồm hầu hết các từ khóa quan trọng.</p>
          )}
        </div>
        <p className="text-[12px] text-amber-700/80 mt-3 font-medium">
          Việc bổ sung các từ khóa này vào CV có thể tăng tỷ lệ match lên đến <span className="font-bold text-amber-600">12%</span>
        </p>
      </div>
    </motion.div>
  );
};
