import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../../features/auth/validations/auth.validation';

export const RegisterPage: React.FC = () => {
  const { register: registerAction, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerAction(data);
  };

  return (
    <AuthLayout 
      image="/auth-hero.png"
      title="Khởi đầu sự nghiệp"
      subtitle="Chỉ mất 30s để bắt đầu buổi phỏng vấn."
    >
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">Bắt đầu hành trình mới! ✨</h1>
          <p className="text-text-secondary text-[14px]">Tham gia cùng 50,000+ ứng viên đang luyện tập mỗi ngày.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Họ và tên</label>
            <input 
              {...register('fullName')}
              type="text" 
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.fullName ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]`}
            />
            {errors.fullName && <p className="text-red-500 text-[11px] ml-1">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
            <input 
              {...register('email')}
              type="email" 
              placeholder="name@company.com"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.email ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]`}
            />
            {errors.email && <p className="text-red-500 text-[11px] ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Mật khẩu</label>
            <input 
              {...register('password')}
              type="password" 
              placeholder="Tối thiểu 8 ký tự"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.password ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]`}
            />
            {errors.password && <p className="text-red-500 text-[11px] ml-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider ml-1">Xác nhận mật khẩu</label>
            <input 
              {...register('passwordConfirmation')}
              type="password" 
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.passwordConfirmation ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:bg-white focus:border-primary transition-all text-[14px]`}
            />
            {errors.passwordConfirmation && <p className="text-red-500 text-[11px] ml-1">{errors.passwordConfirmation.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isRegistering}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-[15px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isRegistering ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang tạo tài khoản...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-hairline"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-text-tertiary font-bold tracking-widest">Hoặc</span>
          </div>
        </div>

        <button className="w-full bg-white border border-border-hairline text-text-primary py-2.5 rounded-xl font-bold text-[13px] hover:bg-bg-surface transition-all flex items-center justify-center gap-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" alt="Google" />
          Đăng ký với Google
        </button>

        <p className="mt-4 text-center text-[13px] text-text-secondary">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </AuthLayout>
  );
};
