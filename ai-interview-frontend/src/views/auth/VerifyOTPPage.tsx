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
    if (event.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  return (
    <AuthLayout image="" title="" subtitle="">
      <div>
        <Link href="/login" className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><ArrowLeft size={17} aria-hidden="true" />Quay lại đăng nhập</Link>
        <div className="mb-10"><span className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-black"><MailCheck size={23} aria-hidden="true" /></span><h1 className="mt-6 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Xác thực email</h1><p className="mt-4 text-base leading-7 text-gray-500">Chúng tôi đã gửi mã gồm 6 chữ số đến <strong className="font-medium text-gray-950">{email || 'email của bạn'}</strong>.</p></div>
        <form className="space-y-7" onSubmit={(event) => { event.preventDefault(); if (otpComplete) verifyOtp({ email, otp: otp.join('') }); }}>
          <div className="flex justify-between gap-2 sm:gap-3" aria-label="Mã OTP gồm 6 chữ số">{otp.map((value, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} type="text" inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} value={value} onChange={(event) => handleChange(event.target, index)} onKeyDown={(event) => handleKeyDown(event, index)} aria-label={`Chữ số ${index + 1}`} className="size-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-semibold text-gray-950 outline-none transition-colors focus:border-black sm:size-14" />)}</div>
          <button type="submit" disabled={isVerifyingOtp || !otpComplete} className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-base font-medium text-white transition-transform hover:bg-gray-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{isVerifyingOtp ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Đang xác thực</> : <>Xác nhận <ArrowRight size={20} aria-hidden="true" /></>}</button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500">Chưa nhận được mã? <button type="button" onClick={() => { if (email) resendOtp(email); }} disabled={isResendingOtp || !email} className="font-medium text-black underline underline-offset-4 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50">{isResendingOtp ? 'Đang gửi...' : 'Gửi lại mã'}</button></p>
      </div>
    </AuthLayout>
  );
};
