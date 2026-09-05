'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MailCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const VerifyOTPPage: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const { resendOtp, isResendingOtp, verifyOtp, isVerifyingOtp } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpComplete = otp.join('').length === 6;

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (!/^\d?$/.test(element.value)) return;
    const next = [...otp];
    next[index] = element.value;
    setOtp(next);
    if (element.value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
            <MailCheck size={22} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Xác thực email
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Chúng tôi đã gửi mã xác thực 6 chữ số đến <strong className="font-semibold text-gray-900">{email || 'email của bạn'}</strong>.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (otpComplete) verifyOtp({ email, otp: otp.join('') });
          }}
        >
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-900">
              Mã xác thực OTP
            </label>
            <div className="flex justify-between gap-2 sm:gap-2.5" aria-label="Mã OTP gồm 6 chữ số">
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
                  onChange={(event) => handleChange(event.target, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  aria-label={`Chữ số ${index + 1}`}
                  className="size-11 rounded-xl border border-gray-200 bg-white text-center text-lg font-bold text-gray-950 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:size-12"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifyingOtp || !otpComplete}
            className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-pressed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifyingOtp ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Xác nhận & Tiếp tục</span>
                <ArrowRight size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-gray-500">
          Chưa nhận được mã?{' '}
          <button
            type="button"
            onClick={() => {
              if (email) resendOtp(email);
            }}
            disabled={isResendingOtp || !email}
            className="font-semibold text-primary hover:text-primary-pressed hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResendingOtp ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTPPage;
