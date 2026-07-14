import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-24 pb-12 mt-auto border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Brand & Newsletter Column (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-3 text-white group">
              <div className="size-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <BrainCircuit size={24} strokeWidth={2} />
              </div>
              <span className="font-bold text-2xl tracking-tighter">AI Interview</span>
            </Link>
            
            <p className="text-[15px] font-medium text-gray-500 max-w-sm leading-relaxed">
              Hệ thống phỏng vấn và phân tích năng lực ứng viên bằng Trí tuệ nhân tạo. Tối ưu hoá quy trình tuyển dụng của bạn.
            </p>
            
            <div className="mt-2 w-full max-w-md">
              <label className="sr-only">Đăng ký nhận tin</label>
              <div className="flex items-center bg-white/5 rounded-xl p-1.5 border border-white/10 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-300">
                <input 
                  type="email" 
                  placeholder="Nhập email nhận bản tin..." 
                  className="bg-transparent text-[15px] text-white px-4 py-2 outline-none flex-1 placeholder:text-gray-600"
                />
                <button className="bg-primary text-white text-[14px] font-bold px-6 py-2.5 rounded-lg hover:bg-primary-pressed transition-colors shadow-lg shadow-primary/20">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          {/* Spacer (1 col) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns (Span 6 cols total) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Col 1 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-white font-bold text-[13px] tracking-widest uppercase mb-2">Sản phẩm</h4>
              <Link to="/features" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Tính năng</Link>
              <Link to="/subscription" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Bảng giá</Link>
              <Link to="/jobs" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Việc làm</Link>
              <Link to="/changelog" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Cập nhật</Link>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-white font-bold text-[13px] tracking-widest uppercase mb-2">Công ty</h4>
              <Link to="/about" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Về chúng tôi</Link>
              <Link to="/careers" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium flex items-center gap-2">
                Tuyển dụng
                <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">Hiring</span>
              </Link>
              <Link to="/contact" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Liên hệ</Link>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-5">
              <h4 className="text-white font-bold text-[13px] tracking-widest uppercase mb-2">Mạng xã hội</h4>
              <a href="#" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">Facebook</a>
              <a href="#" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">LinkedIn</a>
              <a href="#" className="hover:text-primary hover:translate-x-1 transition-all duration-300 text-[15px] font-medium">YouTube</a>
            </div>

          </div>
        </div>

        {/* Sub Footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] font-medium">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} AI Interview. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
