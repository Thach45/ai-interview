import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Lock, Languages, Bell, LogOut, AlertTriangle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { updatePasswordSchema, type UpdatePasswordFormValues } from '../validations/profile.validation';
import { useAuth } from '../../auth/hooks/useAuth';

export const AccountSettings: React.FC = () => {
  const { updateProfile, isUpdating } = useProfile();
  const { logout } = useAuth();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmitPassword = async (data: UpdatePasswordFormValues) => {
    await updateProfile({ password: data.password });
    reset();
    setOpenAccordion(null); // Close accordion on success
  };

  return (
    <div className="space-y-6">
      
      {/* Cài đặt ngôn ngữ */}
      <div className="bg-bg-canvas rounded-lg border border-border-hairline shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <button 
          onClick={() => toggleAccordion('language')}
          className="w-full px-6 py-5 flex items-center justify-between bg-bg-canvas hover:bg-bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-primary" />
            <span className="text-[16px] font-medium text-text-primary">Cài đặt ngôn ngữ</span>
          </div>
          {openAccordion === 'language' ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
        </button>
        {openAccordion === 'language' && (
          <div className="px-6 pb-6 pt-2 border-t border-border-hairline">
            <p className="text-[14px] text-text-tertiary font-normal">Chức năng đang được phát triển...</p>
          </div>
        )}
      </div>

      {/* Đổi mật khẩu */}
      <div className="bg-bg-canvas rounded-lg border border-border-hairline shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <button 
          onClick={() => toggleAccordion('password')}
          className="w-full px-6 py-5 flex items-center justify-between bg-bg-canvas hover:bg-bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-[16px] font-medium text-text-primary">Đổi mật khẩu</span>
          </div>
          {openAccordion === 'password' ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
        </button>
        {openAccordion === 'password' && (
          <div className="px-6 pb-8 pt-6 border-t border-border-hairline">
            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-text-secondary">Mật khẩu mới</label>
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full h-[44px] px-4 bg-bg-canvas border ${errors.password ? 'border-semantic-error' : 'border-border-hairline-strong'} rounded-md outline-none focus:border-primary transition-all text-[16px]`}
                  placeholder="Nhập mật khẩu mới"
                />
                {errors.password && <p className="text-semantic-error text-[13px]">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-text-secondary">Xác nhận mật khẩu</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className={`w-full h-[44px] px-4 bg-bg-canvas border ${errors.confirmPassword ? 'border-semantic-error' : 'border-border-hairline-strong'} rounded-md outline-none focus:border-primary transition-all text-[16px]`}
                  placeholder="Nhập lại mật khẩu mới"
                />
                {errors.confirmPassword && <p className="text-semantic-error text-[13px]">{errors.confirmPassword.message}</p>}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="h-[44px] px-6 bg-primary text-white rounded-md font-medium text-[14px] hover:bg-primary-pressed transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Tùy chọn thông báo */}
      <div className="bg-bg-canvas rounded-lg border border-border-hairline shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
        <button 
          onClick={() => toggleAccordion('notifications')}
          className="w-full px-6 py-5 flex items-center justify-between bg-bg-canvas hover:bg-bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <span className="text-[16px] font-medium text-text-primary">Tùy chọn thông báo</span>
          </div>
          {openAccordion === 'notifications' ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
        </button>
        {openAccordion === 'notifications' && (
          <div className="px-6 pb-6 pt-2 border-t border-border-hairline">
             <p className="text-[14px] text-text-tertiary font-normal">Chức năng đang được phát triển...</p>
          </div>
        )}
      </div>

      {/* Đăng xuất */}
      <div className="bg-bg-canvas rounded-lg border border-border-hairline shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-border-hairline flex items-center gap-2.5">
          <LogOut className="w-5 h-5 text-primary" />
          <h2 className="text-[16px] font-semibold text-text-primary">Đăng xuất</h2>
        </div>
        <div className="p-8 flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-medium text-text-primary">Đăng xuất</h3>
            <p className="text-[14px] text-text-tertiary">Đăng xuất khỏi tài khoản trên thiết bị này.</p>
          </div>
          <button 
            onClick={logout}
            className="h-[40px] px-5 border border-border-hairline-strong rounded-md text-[14px] font-medium text-text-primary hover:bg-bg-surface transition-colors whitespace-nowrap"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Xóa tài khoản */}
      <div className="bg-bg-surface-soft rounded-lg border border-semantic-error/20 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-semantic-error/20 flex items-center gap-2.5 bg-semantic-error/[0.03]">
          <AlertTriangle className="w-5 h-5 text-semantic-error" />
          <h2 className="text-[16px] font-semibold text-semantic-error">Hành động nguy hiểm</h2>
        </div>
        <div className="p-8 flex items-center justify-between bg-bg-canvas">
          <div className="max-w-[70%]">
            <h3 className="text-[16px] font-medium text-text-primary">Xóa tài khoản</h3>
            <p className="text-[14px] text-text-tertiary">Khi bạn xóa tài khoản, không thể khôi phục lại. Vui lòng cân nhắc kỹ.</p>
          </div>
          <button className="h-[40px] px-5 border border-semantic-error/30 rounded-md text-[14px] font-medium text-semantic-error hover:bg-semantic-error/[0.05] transition-colors whitespace-nowrap">
            Xóa tài khoản
          </button>
        </div>
      </div>

    </div>
  );
};
