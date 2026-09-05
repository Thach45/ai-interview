'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { loginSchema, type LoginFormValues } from '../../features/auth/validations/auth.validation';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Chào mừng trở lại
          </h1>
          <p className="mt-1.5 text-xs text-gray-500">
            Tiếp tục hành trình luyện phỏng vấn và tối ưu CV cùng Arion.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit((data) => login(data))} noValidate>
          {/* Email field */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-900">
              Email
            </label>
            <div
              className={`flex min-h-12 items-center gap-3 rounded-xl border bg-white px-3.5 transition-all ${
                errors.email
                  ? 'border-red-500 ring-2 ring-red-500/10'
                  : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            >
              <Mail size={17} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.email ? (
              <p id="email-error" className="mt-1 text-[11px] text-red-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          {/* Password field */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <label htmlFor="password" className="text-xs font-semibold text-gray-900">
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="text-[11.5px] font-medium text-primary hover:text-primary-pressed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div
              className={`flex min-h-12 items-center gap-3 rounded-xl border bg-white px-3.5 transition-all ${
                errors.password
                  ? 'border-red-500 ring-2 ring-red-500/10'
                  : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            >
              <LockKeyhole size={17} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('password')}
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••••"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isPasswordVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="mt-1 text-[11px] text-red-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {/* Submit button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-pressed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4 text-xs text-gray-400 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">
          hoặc tiếp tục với
        </div>

        {/* Google sign-in button */}
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white px-5 text-xs sm:text-sm font-semibold text-gray-800 transition-all hover:bg-gray-50 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" alt="" />
          <span>Tiếp tục với Google</span>
        </button>

        {/* Footer link */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold text-primary hover:text-primary-pressed hover:underline">
            Tạo tài khoản miễn phí <ArrowRight size={12} className="ml-0.5 inline" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
