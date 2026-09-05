'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../../features/auth/validations/auth.validation';

const inputWrapperClass = (hasError?: boolean) =>
  `flex min-h-11 items-center gap-2.5 rounded-xl border bg-white px-3.5 transition-all ${
    hasError
      ? 'border-red-500 ring-2 ring-red-500/10'
      : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
  }`;

export const RegisterPage: React.FC = () => {
  const { register: registerAction, isRegistering } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Tạo tài khoản
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Bắt đầu hành trình nâng cao phản xạ phỏng vấn cùng Arion.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit((data) => registerAction(data))} noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-gray-900">
              Họ và tên
            </label>
            <div className={inputWrapperClass(Boolean(errors.fullName))}>
              <UserRound size={16} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('fullName')}
                id="fullName"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                aria-invalid={Boolean(errors.fullName)}
                className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.fullName ? (
              <p className="mt-0.5 text-[11px] text-red-600">{errors.fullName.message}</p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-900">
              Email
            </label>
            <div className={inputWrapperClass(Boolean(errors.email))}>
              <Mail size={16} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={Boolean(errors.email)}
                className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.email ? (
              <p className="mt-0.5 text-[11px] text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-900">
              Mật khẩu
            </label>
            <div className={inputWrapperClass(Boolean(errors.password))}>
              <LockKeyhole size={16} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Tối thiểu 8 ký tự"
                aria-invalid={Boolean(errors.password)}
                className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.password ? (
              <p className="mt-0.5 text-[11px] text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="passwordConfirmation"
              className="mb-1 block text-xs font-semibold text-gray-900"
            >
              Xác nhận mật khẩu
            </label>
            <div className={inputWrapperClass(Boolean(errors.passwordConfirmation))}>
              <LockKeyhole size={16} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('passwordConfirmation')}
                id="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                aria-invalid={Boolean(errors.passwordConfirmation)}
                className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.passwordConfirmation ? (
              <p className="mt-0.5 text-[11px] text-red-600">
                {errors.passwordConfirmation.message}
              </p>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="pt-1.5">
            <button
              type="submit"
              disabled={isRegistering}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-pressed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Tạo tài khoản</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-pressed hover:underline">
            Đăng nhập ngay <ArrowRight size={12} className="ml-0.5 inline" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
