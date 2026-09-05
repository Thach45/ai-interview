import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Role } from '../types';
import { useRoleActions } from '../hooks/useAuthorization';

const roleSchema = z.object({
  code: z.string().min(1, 'Mã role không được để trống').max(50),
  displayName: z.string().min(1, 'Tên hiển thị không được để trống').max(100),
  description: z.string().max(1000).optional().or(z.literal('')),
  isActive: z.boolean(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

export const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role }) => {
  const { createRole, updateRole, isCreating, isUpdating } = useRoleActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { code: '', displayName: '', description: '', isActive: true },
  });

  useEffect(() => {
    if (role) {
      reset({
        code: role.code,
        displayName: role.displayName,
        description: role.description ?? '',
        isActive: role.isActive,
      });
    } else {
      reset({ code: '', displayName: '', description: '', isActive: true });
    }
  }, [role, reset, isOpen]);

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (role) {
        await updateRole({
          id: role.id,
          data: { displayName: data.displayName, description: data.description, isActive: data.isActive },
        });
      } else {
        await createRole(data);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <h3 className="text-lg font-bold text-text-primary">
            {role ? 'Chỉnh sửa role' : 'Thêm role mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-tertiary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-secondary ml-1">Mã role</label>
            <input
              {...register('code')}
              type="text"
              disabled={Boolean(role)}
              placeholder="VD: MODERATOR"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.code ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] disabled:opacity-60`}
            />
            {errors.code && <p className="text-red-500 text-[11px] ml-1">{errors.code.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-secondary ml-1">Tên hiển thị</label>
            <input
              {...register('displayName')}
              type="text"
              placeholder="VD: Điều phối viên"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.displayName ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
            />
            {errors.displayName && <p className="text-red-500 text-[11px] ml-1">{errors.displayName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-secondary ml-1">Mô tả</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Mô tả vai trò và phạm vi sử dụng..."
              className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input {...register('isActive')} type="checkbox" id="role-active" className="size-4" />
            <label htmlFor="role-active" className="text-[13px] font-medium text-text-secondary">Đang hoạt động</label>
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
              {role ? 'Lưu thay đổi' : 'Tạo role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
