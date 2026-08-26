'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { ForgotPasswordRequest } from '../../features/auth/types';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isSendingForgotOtp } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordRequest>();

  return (
    <AuthLayout image="" title="" subtitle="">
      <div>
        <Link href="/login" className="mb-10 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"><ArrowLeft size={17} aria-hidden="true" />Quay lại đăng nhập</Link>
        <div className="mb-10"><h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">Quên mật khẩu?</h1><p className="mt-4 max-w-[36ch] text-base leading-7 text-gray-500">Nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p></div>
        <form className="space-y-6" onSubmit={handleSubmit((data) => forgotPassword(data))} noValidate>
          <div><label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-950">Email khôi phục</label><div className={`flex min-h-16 items-center gap-3 rounded-xl border bg-white px-4 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}><Mail size={19} aria-hidden="true" className="text-gray-500" /><input {...register('email', { required: 'Vui lòng nhập email', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' } })} id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400" /></div>{errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}</div>
          <button type="submit" disabled={isSendingForgotOtp} className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-base font-medium text-white transition-transform hover:bg-gray-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{isSendingForgotOtp ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Đang gửi</> : <>Gửi mã OTP <ArrowRight size={20} aria-hidden="true" /></>}</button>
        </form>
      </div>
    </AuthLayout>
  );
};
