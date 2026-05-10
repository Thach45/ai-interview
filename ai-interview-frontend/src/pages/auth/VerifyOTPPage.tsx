import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';

export const VerifyOTPPage: React.FC = () => {
  return (
    <AuthLayout 
      image="/auth-hero.png"
      title="Xác thực tài khoản"
      subtitle="Vui lòng kiểm tra email để nhận mã bảo mật."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Nhập mã OTP 🛡️</h1>
          <p className="text-text-secondary text-[14px]">Chúng tôi đã gửi mã 6 chữ số đến email của bạn.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input 
                key={i}
                type="text" 
                maxLength={1}
                className="size-12 bg-bg-surface border border-border-hairline rounded-xl text-center text-lg font-bold outline-none focus:border-primary focus:bg-white transition-all"
              />
            ))}
          </div>

          <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
            Xác nhận
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[13px] text-text-secondary">
            Chưa nhận được mã?{' '}
            <button className="font-bold text-primary hover:underline">Gửi lại (59s)</button>
          </p>
          <p className="text-[13px] text-text-secondary">
            Quay lại trang{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
