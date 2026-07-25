import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, RefreshCw, X, Wand2 } from 'lucide-react';
import { cn } from '../../../../shared/utils/cn';

export function FormField({
  label, value, onChange, placeholder, multiline, className, enableAiCopilot,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  enableAiCopilot?: boolean;
}) {
  const Comp = multiline ? 'textarea' : 'input';
  const [showCopilot, setShowCopilot] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockSuggestions, setMockSuggestions] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowCopilot(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopilotClick = () => {
    if (!value || !value.trim()) {
      alert("Vui lòng nhập một ít nội dung để AI có thể viết lại!");
      return;
    }
    setShowCopilot(true);
    setIsGenerating(true);
    setTimeout(() => {
      setMockSuggestions([
        "Phát triển hệ thống thương mại điện tử giúp tăng 20% doanh thu trong quý 3.",
        "Thiết kế và triển khai kiến trúc microservices, giảm 30% thời gian tải trang.",
        "Đóng vai trò nhóm trưởng, dẫn dắt đội ngũ 5 người hoàn thành dự án trước thời hạn."
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className={cn('space-y-1.5 relative', className)}>
      <div className="flex justify-between items-end">
        <label className="text-[11px] font-bold text-gray-700">{label}</label>
        {enableAiCopilot && multiline && (
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={handleCopilotClick}
              className="flex items-center gap-1 text-[10px] font-bold text-[#4b2c9a] hover:text-white hover:bg-[#4b2c9a] px-2 py-1 rounded-md transition-colors border border-[#4b2c9a]/20 bg-[#4b2c9a]/5"
            >
              <Sparkles className="size-3" />
              AI Rewrite
            </button>

            <AnimatePresence>
              {showCopilot && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#4b2c9a] to-indigo-600 px-4 py-2.5 flex justify-between items-center">
                    <span className="text-white text-[12px] font-bold flex items-center gap-1.5">
                      <Wand2 className="size-3.5" /> AI Copilot
                    </span>
                    <button onClick={() => setShowCopilot(false)} className="text-white/80 hover:text-white">
                      <X className="size-3.5" />
                    </button>
                  </div>
                  
                  <div className="p-3 bg-gray-50 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center py-6 gap-2">
                        <RefreshCw className="size-5 text-[#4b2c9a] animate-spin" />
                        <span className="text-[11px] text-gray-500 font-medium">AI đang suy nghĩ và viết lại...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-gray-500 mb-2 font-medium">Chọn một gợi ý để thay thế nội dung hiện tại:</p>
                        {mockSuggestions.map((suggestion, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              onChange(suggestion);
                              setShowCopilot(false);
                            }}
                            className="p-2.5 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-700 hover:border-[#4b2c9a] hover:bg-[#4b2c9a]/5 cursor-pointer transition-all group relative pr-8 leading-relaxed"
                          >
                            {suggestion}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Check className="size-4 text-[#4b2c9a]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Comp
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] font-medium text-gray-800 outline-none transition-all duration-200',
          'placeholder:text-gray-400 placeholder:font-normal',
          'focus:border-[#4b2c9a] focus:ring-1 focus:ring-[#4b2c9a]/20 focus:bg-white',
          multiline ? 'resize-none min-h-[80px]' : 'h-[42px]',
        )}
      />
    </div>
  );
}
