import React, { useState, useEffect } from 'react';
import { X, Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export function LinkedInExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      setTimeout(() => setIsGenerating(false), 2000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mockData = {
    headline: "Chuyên viên Phát triển Phần mềm (Fullstack) | Chuyên gia về React & Node.js | Đam mê kiến trúc Microservices",
    about: "Xin chào! 👋 Tôi là một Kỹ sư Phần mềm đam mê công nghệ với hơn 3 năm kinh nghiệm trong việc xây dựng các ứng dụng web hiệu năng cao...\n\n💡 Kỹ năng cốt lõi: React, Node.js, AWS\n🚀 Mục tiêu: Xây dựng các sản phẩm mang lại giá trị thực cho người dùng.",
    experience: "🔹 Kỹ sư Phần mềm @ Tech Company\n- Phát triển thành công hệ thống CRM phục vụ 10,000+ người dùng...\n- Tối ưu hóa truy vấn Database giúp giảm 30% thời gian tải trang.\n\n#SoftwareEngineering #ReactJS #NodeJS #Tech"
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LinkedInIcon className="text-[#0a66c2] size-5" />
              Xuất dữ liệu LinkedIn
            </h3>
            <p className="text-gray-500 text-sm mt-1">AI đã phân tích CV của bạn và tối ưu hóa nội dung cho LinkedIn Profile.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-5">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="size-8 text-[#0a66c2] animate-spin" />
              <p className="text-sm font-bold text-gray-600">AI đang điều chỉnh định dạng LinkedIn...</p>
            </div>
          ) : (
            <>
              {Object.entries(mockData).map(([key, text]) => (
                <div key={key} className="bg-gray-50 rounded-2xl border border-gray-200 p-5 relative group hover:border-[#0a66c2]/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      {key === 'headline' ? 'Tiêu đề (Headline)' : key === 'about' ? 'Giới thiệu (About)' : 'Kinh nghiệm (Experience)'}
                    </span>
                    <button
                      onClick={() => handleCopy(key, text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-[#0a66c2] hover:border-[#0a66c2] shadow-sm transition-all"
                    >
                      {copiedSection === key ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      {copiedSection === key ? 'Đã copy' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">{text}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
