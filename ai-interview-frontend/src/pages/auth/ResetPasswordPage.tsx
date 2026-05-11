import React, { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { ResetPasswordRequest } from '../../features/auth/types';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const { resetPassword, forgotPassword, isResettingPassword, isSendingForgotOtp } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<ResetPasswordRequest, 'email' | 'otp'>>();

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (data: Omit<ResetPasswordRequest, 'email' | 'otp'>) => {
    const otpString = otp.join('');
    if (otpString.length < 6) return;
    resetPassword({ email, otp: otpString, ...data });
  };

  const handleResend = () => {
    if (email) forgotPassword({ email });
  };

  return (
    <AuthLayout
      image="/auth-hero.png"
      title="Đặt lại mật khẩu"
      subtitle="Nhập mã OTP và mật khẩu mới để hoàn tất."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Đặt lại mật khẩu 🔐</h1>
          <p className="text-text-secondary text-[14px]">
            Chúng tôi đã gửi mã OTP đến email: <br />
            <strong className="text-text-primary">{email}</strong>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* OTP Input */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Mã OTP
            </label>
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="size-12 bg-bg-surface border border-border-hairline rounded-xl text-center text-lg font-bold outline-none focus:border-primary focus:bg-white transition-all"
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]"
              {...register('newPassword', {
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-[12px] ml-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]"
              {...register('passwordConfirmation', {
                required: 'Vui lòng xác nhận mật khẩu',
                validate: (value) => value === watch('newPassword') || 'Mật khẩu không khớp',
              })}
            />
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-[12px] ml-1">{errors.passwordConfirmation.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isResettingPassword || otp.join('').length < 6}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isResettingPassword ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-[13px] text-text-secondary">
            Chưa nhận được mã?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isSendingForgotOtp || !email}
              className="font-bold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingForgotOtp ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
          </p>
          <p className="text-[13px] text-text-secondary">
            Quay lại{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
