import React from 'react';
import { cn } from '../../../shared/utils/cn';

export interface InterviewProgressCardProps {
  currentQuestionIdx: number;
  questions: Array<{
    title: string;
    reason: string;
  }>;
  isDarkMode?: boolean;
}

export const InterviewProgressCard: React.FC<InterviewProgressCardProps> = ({
  currentQuestionIdx,
  questions,
  isDarkMode = false,
}) => {
  return (
    <div className={cn(
      "rounded-2xl border shadow-sm p-6 flex flex-col transition-colors duration-300 h-full",
      isDarkMode ? "bg-[#111318] border-white/10" : "bg-white border-[#e5e3df]"
    )}>
      <div className={cn(
        "flex items-center justify-between mb-5 pb-3 border-b",
        isDarkMode ? "border-white/10" : "border-[#ede9e4]"
      )}>
        <span className={cn("text-[11px] font-bold uppercase", isDarkMode ? "text-gray-400" : "text-slate-400")}>Tiến trình phỏng vấn</span>
        <span className="text-xs font-mono font-bold text-primary">
          Đã xong {currentQuestionIdx} / {questions.length} câu
        </span>
      </div>

      {/* Premium Minimal Progress Bar */}
      <div className={cn(
        "w-full h-1.5 rounded-full overflow-hidden mb-6 border",
        isDarkMode ? "bg-white/5 border-white/5" : "bg-[#f6f5f4] border-[#e5e3df]/40"
      )}>
        <div 
          className="bg-primary h-full transition-all duration-500 rounded-full" 
          style={{ width: `${(currentQuestionIdx / questions.length) * 100}%` }}
        />
      </div>

      {/* Active Topic Spotlight (Beautiful soft card tint depending on index) */}
      <div className={cn(
        "rounded-xl p-4.5 mb-5 border transition-all duration-300",
        currentQuestionIdx === 0 
          ? (isDarkMode ? "bg-purple-900/20 border-purple-500/20 text-purple-200" : "bg-[#e6e0f5]/40 border-[#d3c9ed] text-purple-950")
          : currentQuestionIdx === 1
            ? (isDarkMode ? "bg-blue-900/20 border-blue-500/20 text-blue-200" : "bg-[#dcecfa]/40 border-[#c4dbf2] text-blue-950")
            : currentQuestionIdx === 2
              ? (isDarkMode ? "bg-orange-900/20 border-orange-500/20 text-orange-200" : "bg-[#ffe8d4]/40 border-[#f2d3bd] text-orange-950")
              : (isDarkMode ? "bg-emerald-900/20 border-emerald-500/20 text-emerald-200" : "bg-[#d9f3e1]/40 border-[#bee8cb] text-emerald-950")
      )}>
        <span className={cn("text-[9px] font-bold uppercase block mb-1", isDarkMode ? "text-gray-400" : "text-slate-400")}>
          Chủ đề đang diễn ra
        </span>
        <h4 className={cn("text-sm font-extrabold leading-snug", isDarkMode ? "text-gray-100" : "text-slate-900")}>
          {currentQuestionIdx < questions.length 
            ? `${currentQuestionIdx + 1}. ${questions[currentQuestionIdx].title}`
            : "Hoàn tất phỏng vấn!"}
        </h4>
        {currentQuestionIdx < questions.length ? (
          <p className={cn("text-[11px] mt-2 leading-relaxed font-normal", isDarkMode ? "text-gray-400" : "text-slate-500")}>
            {questions[currentQuestionIdx].reason}
          </p>
        ) : (
          <p className={cn("text-[11px] mt-2 leading-relaxed font-normal", isDarkMode ? "text-gray-400" : "text-slate-500")}>
            Buổi phỏng vấn đã kết thúc thành công. Hãy bấm nút Kết thúc ở dưới để xem báo cáo đánh giá.
          </p>
        )}
      </div>

      {/* Upcoming topics in simple elegant timeline bullet list */}
      <div className="space-y-3.5 mt-2 overflow-y-auto pr-2 custom-scrollbar">
        <span className={cn("text-[10px] font-bold uppercase block mb-2", isDarkMode ? "text-gray-400" : "text-slate-400")}>
          Danh sách chủ đề đánh giá
        </span>
        {questions.map((q, idx) => {
          const isPassed = currentQuestionIdx > idx;
          const isCurrent = currentQuestionIdx === idx;
          
          return (
            <div key={idx} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isPassed 
                    ? "bg-emerald-500" 
                    : isCurrent 
                      ? "bg-primary animate-pulse shadow-sm shadow-primary/40" 
                      : (isDarkMode ? "bg-gray-600" : "bg-slate-300")
                )} />
                <span className={cn(
                  "font-medium transition-all duration-300",
                  isCurrent 
                    ? (isDarkMode ? "text-gray-200 font-bold" : "text-slate-800 font-bold")
                    : isPassed 
                      ? (isDarkMode ? "text-gray-600 line-through decoration-gray-600" : "text-slate-400 line-through decoration-slate-300")
                      : (isDarkMode ? "text-gray-500" : "text-slate-500")
                )}>
                  {idx + 1}. {q.title}
                </span>
              </div>
              {isCurrent && (
                <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase">
                  Đang hỏi
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
