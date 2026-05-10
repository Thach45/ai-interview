import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout 
      image="/auth-hero.png"
      title="Khôi phục mật khẩu"
      subtitle="Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Quên mật khẩu? 🔑</h1>
          <p className="text-text-secondary text-[14px]">Nhập email của bạn để nhận mã xác thực OTP.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Email khôi phục</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]"
              required
            />
          </div>

          <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
            Gửi mã OTP
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-text-secondary">
          Quay lại trang{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </AuthLayout>
  );
};
