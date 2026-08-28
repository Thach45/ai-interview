import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { HttpMethod, Permission } from '../types';
import { usePermissionActions } from '../hooks/useAuthorization';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const permissionSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z
    .string()
    .min(1, 'Path không được để trống')
    .max(255)
    .regex(/^\/[A-Za-z0-9_~:/.-]*$/, 'Path phải bắt đầu bằng / và chỉ chứa ký tự route hợp lệ'),
  displayName: z.string().min(1, 'Tên hiển thị không được để trống').max(255),
  description: z.string().max(1000).optional().or(z.literal('')),
  isActive: z.boolean(),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, permission }) => {
  const { createPermission, updatePermission, isCreating, isUpdating } = usePermissionActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { method: 'GET', path: '', displayName: '', description: '', isActive: true },
  });

  useEffect(() => {
    if (permission) {
      reset({
        method: permission.method,
        path: permission.path,
        displayName: permission.displayName,
        description: permission.description ?? '',
        isActive: permission.isActive,
      });
    } else {
      reset({ method: 'GET', path: '', displayName: '', description: '', isActive: true });
    }
  }, [permission, reset, isOpen]);

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: PermissionFormData) => {
    try {
      if (permission) {
        await updatePermission({ id: permission.id, data });
      } else {
        await createPermission(data);
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
            {permission ? 'Chỉnh sửa permission' : 'Thêm permission mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-tertiary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Method</label>
              <select
                {...register('method')}
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] appearance-none"
              >
                {HTTP_METHODS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-[13px] font-semibold text-text-secondary ml-1">Path</label>
              <input
                {...register('path')}
                type="text"
                placeholder="/admin/packages/:id"
                className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.path ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
              />
            </div>
          </div>
          {errors.path && <p className="text-red-500 text-[11px] ml-1">{errors.path.message}</p>}

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-secondary ml-1">Tên hiển thị</label>
            <input
              {...register('displayName')}
              type="text"
              placeholder="VD: Xem danh sách gói dịch vụ"
              className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.displayName ? 'border-red-500' : 'border-border-hairline'} rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px]`}
            />
            {errors.displayName && <p className="text-red-500 text-[11px] ml-1">{errors.displayName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-secondary ml-1">Mô tả</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Mô tả phạm vi endpoint..."
              className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[14px] resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input {...register('isActive')} type="checkbox" id="permission-active" className="size-4" />
            <label htmlFor="permission-active" className="text-[13px] font-medium text-text-secondary">Đang hoạt động</label>
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
              {permission ? 'Lưu thay đổi' : 'Tạo permission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
