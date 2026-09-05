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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Quên mật khẩu?
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-gray-500">
            Nhập email của bạn, chúng tôi sẽ gửi mã OTP để bạn thiết lập lại mật khẩu mới.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit((data) => forgotPassword(data))}
          noValidate
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold text-gray-900">
              Email khôi phục
            </label>
            <div
              className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white px-4 transition-all ${
                errors.email
                  ? 'border-red-500 ring-2 ring-red-500/10'
                  : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
              }`}
            >
              <Mail size={18} aria-hidden="true" className="shrink-0 text-gray-400" />
              <input
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không hợp lệ',
                  },
                })}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={Boolean(errors.email)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.email ? (
              <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSendingForgotOtp}
            className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-pressed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingForgotOtp ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Đang gửi mã...</span>
              </>
            ) : (
              <>
                <span>Gửi mã OTP</span>
                <ArrowRight size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
