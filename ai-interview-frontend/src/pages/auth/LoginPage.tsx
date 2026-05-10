import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout 
      image="/auth-hero.png"
      title="Phỏng vấn thông minh"
      subtitle="Bắt đầu buổi phỏng vấn cùng AI ngay."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Chào mừng bạn trở lại! 👋</h1>
          <p className="text-text-secondary text-[14px]">Đăng nhập để tiếp tục hành trình chinh phục sự nghiệp.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">Mật khẩu</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-primary">Quên?</Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]"
              required
            />
          </div>

          <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
            Đăng nhập
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-hairline"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-text-tertiary font-bold tracking-widest">Hoặc</span>
          </div>
        </div>

        <button className="w-full bg-white border border-border-hairline text-text-primary py-2.5 rounded-xl font-bold text-[13px] hover:bg-bg-surface transition-all flex items-center justify-center gap-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" alt="Google" />
          Tiếp tục với Google
        </button>

        <p className="mt-6 text-center text-[13px] text-text-secondary">
          Mới biết đến AI Interview?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">Đăng ký</Link>
        </p>
      </div>
    </AuthLayout>
  );
};
