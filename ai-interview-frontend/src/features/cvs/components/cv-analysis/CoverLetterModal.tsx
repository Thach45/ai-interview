import React, { useState, useEffect } from 'react';
import { X, Download, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function CoverLetterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isGenerating, setIsGenerating] = useState(true);
  
  const mockLetter = `Kính gửi Bộ phận Tuyển dụng,

Tôi viết thư này để bày tỏ sự quan tâm đặc biệt tới vị trí Kỹ sư Phần mềm tại Quý công ty. Với nền tảng vững chắc trong việc phát triển hệ thống web và đam mê tạo ra các giải pháp công nghệ đột phá, tôi tin rằng mình có thể mang lại giá trị thiết thực cho đội ngũ của bạn.

Trong 3 năm làm việc tại Tech Company, tôi đã dẫn dắt nhóm phát triển hoàn thành hệ thống CRM, giúp tăng hiệu suất làm việc của 10,000+ nhân viên. Tôi luôn chú trọng vào hiệu năng, trải nghiệm người dùng và khả năng mở rộng của hệ thống.

Sự đổi mới và môi trường làm việc năng động tại Quý công ty chính là nơi tôi khao khát được cống hiến lâu dài. Tôi rất mong có cơ hội thảo luận chi tiết hơn về cách tôi có thể đóng góp vào mục tiêu phát triển của công ty.

Trân trọng,
Nguyễn Hoàng Thạch`;

  const [content, setContent] = useState(mockLetter);

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      setTimeout(() => setIsGenerating(false), 2500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" />
              AI Cover Letter Generator
            </h3>
            <p className="text-gray-500 text-sm mt-1">Thư ngỏ được AI cá nhân hóa dựa trên CV và JD của bạn.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <RefreshCw className="size-10 text-indigo-600 animate-spin" />
              <div className="text-center">
                <p className="text-base font-bold text-gray-800">AI đang chắp bút viết thư...</p>
                <p className="text-sm text-gray-500 mt-1">Đang phân tích điểm mạnh của bạn để tạo ấn tượng tốt nhất.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-sm flex gap-2 shadow-sm">
                <span className="font-bold shrink-0">💡 Mẹo:</span> Bạn có thể chỉnh sửa trực tiếp nội dung bức thư này trước khi tải xuống.
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full p-6 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-700 leading-relaxed text-sm bg-gray-50 custom-scrollbar font-medium"
                placeholder="Nội dung thư ngỏ..."
              />
              <div className="flex justify-end gap-3 mt-2 shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Đóng
                </button>
                <button
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                  onClick={() => alert("Mock: Đang gọi Puppeteer tải PDF...")}
                >
                  <Download size={18} />
                  Tải xuống PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
