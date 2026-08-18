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
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Omit<ResetPasswordRequest, 'email' | 'otp'>>();
  const otpComplete = otp.join('').length === 6;

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (!/^\d?$/.test(element.value)) return;
    const next = [...otp];
    next[index] = element.value;
    setOtp(next);
    if (element.value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  return (
    <AuthLayout image="" title="" subtitle="">
      <div>
        <Link href="/login" className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><ArrowLeft size={17} aria-hidden="true" />Quay lại đăng nhập</Link>
        <div className="mb-9"><span className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-black"><KeyRound size={23} aria-hidden="true" /></span><h1 className="mt-6 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Đặt lại mật khẩu</h1><p className="mt-4 text-base leading-7 text-gray-500">Nhập mã gửi tới <strong className="font-medium text-gray-950">{email || 'email của bạn'}</strong> và chọn mật khẩu mới.</p></div>
        <form className="space-y-5" onSubmit={handleSubmit((data) => { if (otpComplete) resetPassword({ email, otp: otp.join(''), ...data }); })} noValidate>
          <div><label className="mb-2 block text-sm font-medium text-gray-950">Mã OTP</label><div className="flex justify-between gap-2 sm:gap-3">{otp.map((value, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} type="text" inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} value={value} onChange={(event) => handleOtpChange(event.target, index)} onKeyDown={(event) => { if (event.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus(); }} aria-label={`Chữ số ${index + 1}`} className="size-11 rounded-xl border border-gray-200 bg-white text-center text-lg font-semibold outline-none transition-colors focus:border-black sm:size-12" />)}</div></div>
          <div><label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-950">Mật khẩu mới</label><div className={`flex items-center gap-3 rounded-xl border px-4 ${errors.newPassword ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}><LockKeyhole size={19} aria-hidden="true" className="text-gray-500" /><input {...register('newPassword', { required: 'Vui lòng nhập mật khẩu mới', minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' } })} id="newPassword" type="password" autoComplete="new-password" placeholder="Tối thiểu 6 ký tự" aria-invalid={Boolean(errors.newPassword)} className="min-h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400" /></div>{errors.newPassword ? <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p> : null}</div>
          <div><label htmlFor="passwordConfirmation" className="mb-2 block text-sm font-medium text-gray-950">Xác nhận mật khẩu</label><input {...register('passwordConfirmation', { required: 'Vui lòng xác nhận mật khẩu', validate: (value) => value === watch('newPassword') || 'Mật khẩu không khớp' })} id="passwordConfirmation" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" aria-invalid={Boolean(errors.passwordConfirmation)} className={`min-h-14 w-full rounded-xl border bg-white px-4 text-base outline-none transition-colors placeholder:text-gray-400 focus:border-gray-950 ${errors.passwordConfirmation ? 'border-red-500' : 'border-gray-200'}`} />{errors.passwordConfirmation ? <p className="mt-2 text-sm text-red-600">{errors.passwordConfirmation.message}</p> : null}</div>
          <button type="submit" disabled={isResettingPassword || !otpComplete} className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-base font-medium text-white transition-transform hover:bg-gray-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{isResettingPassword ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Đang xử lý</> : <>Đặt lại mật khẩu <ArrowRight size={20} aria-hidden="true" /></>}</button>
        </form>
        <p className="mt-7 text-center text-sm text-gray-500">Chưa nhận được mã? <button type="button" onClick={() => { if (email) forgotPassword({ email }); }} disabled={isSendingForgotOtp || !email} className="font-medium text-black underline underline-offset-4 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50">{isSendingForgotOtp ? 'Đang gửi...' : 'Gửi lại mã'}</button></p>
      </div>
    </AuthLayout>
  );
};
