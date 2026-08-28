'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { ResetPasswordRequest } from '../../features/auth/types';

export const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const { resetPassword, forgotPassword, isResettingPassword, isSendingForgotOtp } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<ResetPasswordRequest, 'email' | 'otp'>>();
  const otpComplete = otp.join('').length === 6;

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (!/^\d?$/.test(element.value)) return;
    const next = [...otp];
    next[index] = element.value;
    setOtp(next);
    if (element.value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  return (
    <AuthLayout>
      <div>
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Quay lại đăng nhập</span>
        </Link>

        <div className="mb-8">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <KeyRound size={20} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Đặt lại mật khẩu
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Nhập mã OTP gửi tới <strong className="font-semibold text-gray-900">{email || 'email của bạn'}</strong> và chọn mật khẩu mới.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            if (otpComplete) resetPassword({ email, otp: otp.join(''), ...data });
          })}
          noValidate
        >
          {/* OTP Code Fields */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900">
              Mã xác thực OTP
            </label>
            <div className="flex justify-between gap-2 sm:gap-2.5">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={value}
                  onChange={(event) => handleOtpChange(event.target, index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && !otp[index] && index > 0) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  aria-label={`Chữ số ${index + 1}`}
                  className="size-11 rounded-xl border border-gray-200 bg-white text-center text-lg font-bold text-gray-950 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:size-12"
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-xs font-semibold text-gray-900">
              Mật khẩu mới
            </label>
            <div
              className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white px-4 transition-all ${
                errors.newPassword
                  ? 'border-red-500 ring-2 ring-red-500/10'
                  : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            >
              <LockKeyhole size={18} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('newPassword', {
                  required: 'Vui lòng nhập mật khẩu mới',
                  minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                })}
                id="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
                aria-invalid={Boolean(errors.newPassword)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.newPassword ? (
              <p className="mt-1.5 text-xs text-red-600">{errors.newPassword.message}</p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="mb-1.5 block text-xs font-semibold text-gray-900"
            >
              Xác nhận mật khẩu
            </label>
            <div
              className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white px-4 transition-all ${
                errors.passwordConfirmation
                  ? 'border-red-500 ring-2 ring-red-500/10'
                  : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            >
              <LockKeyhole size={18} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('passwordConfirmation', {
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: (value) => value === watch('newPassword') || 'Mật khẩu không khớp',
                })}
                id="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                aria-invalid={Boolean(errors.passwordConfirmation)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.passwordConfirmation ? (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.passwordConfirmation.message}
              </p>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isResettingPassword || !otpComplete}
              className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-pressed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResettingPassword ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <span>Đặt lại mật khẩu</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Chưa nhận được mã?{' '}
          <button
            type="button"
            onClick={() => {
              if (email) forgotPassword({ email });
            }}
            disabled={isSendingForgotOtp || !email}
            className="font-semibold text-primary hover:text-primary-pressed hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingForgotOtp ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
