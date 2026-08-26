'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../../features/auth/validations/auth.validation';

const fieldClass = 'min-h-14 w-full rounded-xl border bg-white px-4 text-base text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-950';

export const RegisterPage: React.FC = () => {
  const { register: registerAction, isRegistering } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  return (
    <AuthLayout image="" title="" subtitle="">
      <div>
        <div className="mb-9"><h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">Tạo tài khoản</h1><p className="mt-4 text-base text-gray-500">Bắt đầu chuẩn bị tốt hơn cùng Arion.</p></div>
        <form className="space-y-5" onSubmit={handleSubmit((data) => registerAction(data))} noValidate>
          <div><label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-950">Họ và tên</label><div className={`flex items-center gap-3 rounded-xl border px-4 ${errors.fullName ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}><UserRound size={19} aria-hidden="true" className="text-gray-500" /><input {...register('fullName')} id="fullName" autoComplete="name" placeholder="Nguyễn Văn A" aria-invalid={Boolean(errors.fullName)} className="min-h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400" /></div>{errors.fullName ? <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p> : null}</div>
          <div><label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-950">Email</label><div className={`flex items-center gap-3 rounded-xl border px-4 ${errors.email ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}><Mail size={19} aria-hidden="true" className="text-gray-500" /><input {...register('email')} id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} className="min-h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400" /></div>{errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}</div>
          <div><label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-950">Mật khẩu</label><div className={`flex items-center gap-3 rounded-xl border px-4 ${errors.password ? 'border-red-500' : 'border-gray-200 focus-within:border-gray-950'}`}><LockKeyhole size={19} aria-hidden="true" className="text-gray-500" /><input {...register('password')} id="password" type="password" autoComplete="new-password" placeholder="Tối thiểu 8 ký tự" aria-invalid={Boolean(errors.password)} className="min-h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400" /></div>{errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password.message}</p> : null}</div>
          <div><label htmlFor="passwordConfirmation" className="mb-2 block text-sm font-medium text-gray-950">Xác nhận mật khẩu</label><input {...register('passwordConfirmation')} id="passwordConfirmation" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" aria-invalid={Boolean(errors.passwordConfirmation)} className={`${fieldClass} ${errors.passwordConfirmation ? 'border-red-500' : 'border-gray-200'}`} />{errors.passwordConfirmation ? <p className="mt-2 text-sm text-red-600">{errors.passwordConfirmation.message}</p> : null}</div>
          <button type="submit" disabled={isRegistering} className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-xl bg-black px-5 text-base font-medium text-white transition-transform hover:bg-gray-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{isRegistering ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Đang tạo tài khoản</> : <>Tạo tài khoản <ArrowRight size={20} aria-hidden="true" /></>}</button>
        </form>
        <p className="mt-9 text-center text-sm text-gray-500">Đã có tài khoản? <Link href="/login" className="font-medium text-black underline underline-offset-4 hover:text-gray-600">Đăng nhập <ArrowRight size={15} className="ml-1 inline" aria-hidden="true" /></Link></p>
      </div>
    </AuthLayout>
  );
};
