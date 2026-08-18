'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { loginSchema, type LoginFormValues } from '../../features/auth/validations/auth.validation';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <AuthLayout image="" title="" subtitle="">
      <div>
        <div className="mb-10">
          <h1 className="flex items-center gap-2 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Chào mừng trở lại</h1>
          <p className="mt-4 text-base text-gray-500">Tiếp tục hành trình sự nghiệp cùng Arion.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(login)} noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-950">Email</label>
            <div className={`flex min-h-16 items-center gap-3 rounded-xl border bg-white px-4 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}>
              <Mail size={19} aria-hidden="true" className="shrink-0 text-gray-500" />
              <input {...register('email')} id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className="min-w-0 flex-1 bg-transparent text-base text-gray-950 outline-none placeholder:text-gray-400" />
            </div>
            {errors.email ? <p id="email-error" className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4"><label htmlFor="password" className="text-sm font-medium text-gray-950">Mật khẩu</label><Link href="/forgot-password" className="text-sm text-gray-500 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">Quên mật khẩu?</Link></div>
            <div className={`flex min-h-16 items-center gap-3 rounded-xl border bg-white px-4 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}>
              <LockKeyhole size={19} aria-hidden="true" className="shrink-0 text-gray-500" />
              <input {...register('password')} id="password" type={isPasswordVisible ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••••••" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} className="min-w-0 flex-1 bg-transparent text-base text-gray-950 outline-none placeholder:text-gray-400" />
              <button type="button" onClick={() => setIsPasswordVisible((visible) => !visible)} aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="flex size-10 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">{isPasswordVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}</button>
            </div>
            {errors.password ? <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          <button type="submit" disabled={isLoggingIn} className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-base font-medium text-white transition-transform hover:bg-gray-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoggingIn ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Đang đăng nhập</> : <>Đăng nhập <ArrowRight size={20} aria-hidden="true" /></>}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-sm text-gray-500 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">hoặc tiếp tục với</div>
        <button type="button" className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 text-base font-medium text-gray-950 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-5" alt="" />Tiếp tục với Google</button>
        <p className="mt-10 text-center text-sm text-gray-500">Chưa có tài khoản? <Link href="/register" className="font-medium text-black underline underline-offset-4 hover:text-gray-600">Tạo tài khoản <ArrowRight size={15} className="ml-1 inline" aria-hidden="true" /></Link></p>
      </div>
    </AuthLayout>
  );
};
