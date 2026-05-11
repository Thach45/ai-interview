import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "../../layouts/AuthLayout";

import { loginSchema, type LoginFormValues } from "../../features/auth/validations/auth.validation";
import { useAuth } from "../../features/auth/hooks/useAuth";



export const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <AuthLayout 
      image="/auth-hero.png"
      title="Phỏng vấn thông minh"
      subtitle="Bắt đầu buổi phỏng vấn cùng AI ngay."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Chào mừng bạn trở lại! 👋</h1>
          <p className="text-text-secondary text-[14px]">Đăng nhập để tiếp tục hành trình chinh phục sự nghiệp.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
            <input 
              {...register('email')}
              type="email" 
              placeholder="name@company.com"
              className={`w-full px-4 py-3 bg-bg-surface border ${errors.email ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]`}
            />
            {errors.email && <p className="text-red-500 text-[12px] ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider">Mật khẩu</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-primary">Quên?</Link>
            </div>
            <input 
              {...register('password')}
              type="password" 
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-bg-surface border ${errors.password ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]`}
            />
            {errors.password && <p className="text-red-500 text-[12px] ml-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-hairline"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-text-tertiary font-bold tracking-widest">Hoặc</span>
          </div>
        </div>

        <button className="w-full bg-white border border-border-hairline text-text-primary py-2.5 rounded-xl font-bold text-[13px] hover:bg-bg-surface transition-all flex items-center justify-center gap-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" alt="Google" />
          Tiếp tục với Google
        </button>

        <p className="mt-6 text-center text-[13px] text-text-secondary">
          Mới biết đến AI Interview?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">Đăng ký</Link>
        </p>
      </div>
    </AuthLayout>
  );
};
