import React, { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const VerifyOTPPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { resendOtp, isResendingOtp, verifyOtp, isVerifyingOtp } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (email) {
      resendOtp(email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      verifyOtp({ email, otp: otpString });
    }
  };

  return (
    <AuthLayout 
      image="/auth-hero.png"
      title="Xác thực tài khoản"
      subtitle="Vui lòng kiểm tra email để nhận mã bảo mật."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Nhập mã OTP</h1>
          <p className="text-text-secondary text-[14px]">
            Chúng tôi đã gửi mã xác thực đến email: <br />
            <strong className="text-text-primary">{email}</strong>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input 
                key={index}
                type="text" 
                maxLength={1}
                value={data}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="size-12 bg-bg-surface border border-border-hairline rounded-xl text-center text-lg font-bold outline-none focus:border-primary focus:bg-white transition-all"
              />
            ))}
          </div>

          <button 
            type="submit"
            disabled={isVerifyingOtp || otp.join('').length < 6}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isVerifyingOtp ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xác thực...
              </>
            ) : (
              'Xác nhận'
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[13px] text-text-secondary">
            Chưa nhận được mã?{' '}
            <button 
              type="button"
              onClick={handleResend}
              disabled={isResendingOtp || !email}
              className="font-bold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResendingOtp ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
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
