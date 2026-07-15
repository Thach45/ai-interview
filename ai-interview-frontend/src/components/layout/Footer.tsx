import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] text-[#888888] pt-32 pb-8 mt-auto font-sans overflow-hidden border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Top Section: Info & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
          
          {/* Brand & Contact (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="flex flex-col gap-8">
              <Link to="/" className="text-white">
                <span className="font-bold text-2xl tracking-tighter leading-none">AI INTERVIEW.</span>
              </Link>
              
              <div className="space-y-6">
                <p className="text-[14px] leading-relaxed max-w-[280px]">
                  Nền tảng phỏng vấn mô phỏng ứng dụng mô hình ngôn ngữ lớn. Chúng tôi giúp ứng viên tự tin hơn trước mọi cơ hội nghề nghiệp.
                </p>
                
                <div className="flex flex-col gap-3 text-[14px]">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 opacity-50 shrink-0" />
                    <span>Tầng 12, Tòa nhà Lotte Center<br />54 Liễu Giai, Ba Đình, Hà Nội</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="opacity-50 shrink-0" />
                    <span>hello@aiinterview.vn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Matrix (Spans 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Col 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium text-[13px] mb-4">Giải pháp</h4>
              <Link to="/features" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Phân tích CV ATS
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/interview-room" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Phỏng vấn giả lập
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/enterprise" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Dành cho Doanh nghiệp
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/api" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                API Tuyển dụng
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium text-[13px] mb-4">Tài nguyên</h4>
              <Link to="/blog" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Blog
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/questions" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Ngân hàng câu hỏi
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/templates" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Mẫu CV chuẩn ATS
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/help" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Trung tâm trợ giúp
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium text-[13px] mb-4">Công ty</h4>
              <Link to="/about" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Về chúng tôi
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/careers" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Tuyển dụng
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/press" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Báo chí
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
              <Link to="/contact" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Liên hệ
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </Link>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium text-[13px] mb-4">Mạng xã hội</h4>
              <a href="#" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                LinkedIn
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </a>
              <a href="#" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                X (Twitter)
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </a>
              <a href="#" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                GitHub
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </a>
              <a href="#" className="group flex items-center text-[14px] hover:text-white transition-colors w-fit">
                Discord
                <ArrowUpRight size={12} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Massive Brand Typography */}
        <div className="w-full flex items-center justify-center pointer-events-none select-none overflow-hidden mb-12">
          <h2 className="text-[14vw] font-bold tracking-tighter leading-[0.8] text-white/5 whitespace-nowrap">
            AI INTERVIEW
          </h2>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start md:items-center">
            <p className="text-[#666666]">
              &copy; {new Date().getFullYear()} AI Interview. All rights reserved.
            </p>
            <span className="hidden md:inline text-white/10">|</span>
            <span className="text-[#555555]">Mã số doanh nghiệp: 0109999999</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Bảo mật</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
