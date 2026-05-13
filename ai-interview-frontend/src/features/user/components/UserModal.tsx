import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '../types/user';
import { useUserActions } from '../hooks/useUsers';

const userSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'MODERATOR', 'CANDIDATE']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  creditsBalance: z.number().min(0, 'Credit không được âm'),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const { createUser, updateUser, isCreating, isUpdating } = useUserActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'CANDIDATE',
      status: 'ACTIVE',
      creditsBalance: 3,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
        creditsBalance: user.creditsBalance,
      });
    } else {
      reset({
        fullName: '',
        email: '',
        password: '',
        role: 'CANDIDATE',
        status: 'ACTIVE',
        creditsBalance: 3,
      });
    }
  }, [user, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: UserFormData) => {
    try {
      // Remove empty password if editing
      if (user && !data.password) {
        delete data.password;
      }

      if (user) {
        await updateUser({ id: user.id, data });
      } else {
        await createUser(data as any);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <h3 className="text-lg font-bold text-text-primary">
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-tertiary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Họ và tên</label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="Nhập tên người dùng..."
                className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.fullName ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
              />
              {errors.fullName && <p className="text-red-500 text-[11px] ml-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.email ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
              />
              {errors.email && <p className="text-red-500 text-[11px] ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Mật khẩu</label>
              <input
                {...register('password')}
                type="password"
                placeholder={user ? "Để trống nếu không muốn đổi..." : "Nhập mật khẩu..."}
                className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.password ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
              />
              {errors.password && <p className="text-red-500 text-[11px] ml-1">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-text-secondary ml-1">Vai trò</label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] appearance-none"
                >
                  <option value="CANDIDATE">CANDIDATE</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-text-secondary ml-1">Trạng thái</label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] appearance-none"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Đã khóa</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Số dư Credit</label>
              <input
                {...register('creditsBalance', { valueAsNumber: true })}
                type="number"
                className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.creditsBalance ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
              />
              {errors.creditsBalance && <p className="text-red-500 text-[11px] ml-1">{errors.creditsBalance.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-2.5 rounded-xl border border-border-hairline font-semibold text-[14px] hover:bg-bg-surface transition-all text-text-secondary disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {user ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
