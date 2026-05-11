import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, User } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { updateProfileSchema, type UpdateProfileFormValues } from '../validations/profile.validation';

export const EditProfile: React.FC = () => {
  const { user, isLoading, updateProfile, isUpdating } = useProfile();
  
  // State để hiển thị/ẩn input nhập URL tạm thời thay vì upload thật
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      avatarUrl: '',
      phone: '',
      dob: '',
      bio: '',
    }
  });

  const avatarUrlWatch = watch('avatarUrl');

  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('email', user.email || ''); // Readonly
      setValue('avatarUrl', user.avatarUrl || '');
      setValue('phone', user.phone || ''); // Fallback
      setValue('dob', user.dob || '');
      setValue('bio', user.bio || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: UpdateProfileFormValues) => {
    const payload: any = {
      fullName: data.fullName,
      phone: data.phone,
      dob: data.dob,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    };

    await updateProfile(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 border border-border-hairline rounded-xl bg-white shadow-sm">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get initial for avatar
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-bg-canvas rounded-lg border border-border-hairline shadow-[0_1px_2px_rgba(15,15,15,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-hairline flex items-center gap-2.5">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-[18px] font-semibold text-text-primary">Thông tin hồ sơ</h2>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-8">
            <div className="relative">
              {avatarUrlWatch ? (
                <img 
                  src={avatarUrlWatch} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full object-cover border border-border-hairline bg-bg-canvas"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-semibold">
                  {getInitial(watch('fullName'))}
                </div>
              )}
              {/* Fallback avatar if error */}
              <div className="hidden w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-semibold absolute top-0 left-0">
                  {getInitial(watch('fullName'))}
              </div>

              <button 
                type="button"
                onClick={() => setShowAvatarInput(!showAvatarInput)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-primary-pressed transition-colors shadow-sm"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-[16px] font-medium text-text-primary">Ảnh hồ sơ</h3>
              <p className="text-[14px] text-text-tertiary">JPG, PNG hoặc GIF. Tối đa 2MB</p>
            </div>
          </div>

          {showAvatarInput && (
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-text-secondary">Đường dẫn ảnh</label>
              <input
                {...register('avatarUrl')}
                type="url"
                className="w-full h-[44px] px-4 bg-bg-canvas border border-border-hairline-strong rounded-md outline-none focus:border-primary transition-all text-[16px]"
                placeholder="https://example.com/avatar.jpg"
              />
              {errors.avatarUrl && <p className="text-semantic-error text-[13px]">{errors.avatarUrl.message}</p>}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-medium text-text-secondary">
                Họ và tên <span className="text-semantic-error">*</span>
              </label>
              <input
                {...register('fullName')}
                type="text"
                className={`w-full h-[44px] px-4 bg-bg-canvas border ${errors.fullName ? 'border-semantic-error' : 'border-border-hairline-strong'} rounded-md outline-none focus:border-primary transition-all text-[16px] text-text-primary`}
                placeholder="Nhập họ và tên"
              />
              {errors.fullName && <p className="text-semantic-error text-[13px]">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-medium text-text-secondary">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                disabled
                className="w-full h-[44px] px-4 bg-bg-surface border border-border-hairline rounded-md outline-none text-[16px] text-text-tertiary cursor-not-allowed"
              />
              <p className="text-[13px] text-text-tertiary font-normal">Không thể thay đổi email</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-text-secondary">
                  Điện thoại
                </label>
                <input
                  {...register('phone')}
                  type="text"
                  className={`w-full h-[44px] px-4 bg-bg-canvas border ${errors.phone ? 'border-semantic-error' : 'border-border-hairline-strong'} rounded-md outline-none focus:border-primary transition-all text-[16px] text-text-primary`}
                />
                {errors.phone && <p className="text-semantic-error text-[13px]">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-medium text-text-secondary">
                  Ngày sinh
                </label>
                <input
                  {...register('dob')}
                  type="date"
                  className={`w-full h-[44px] px-4 bg-bg-canvas border ${errors.dob ? 'border-semantic-error' : 'border-border-hairline-strong'} rounded-md outline-none focus:border-primary transition-all text-[16px] text-text-primary`}
                />
                {errors.dob && <p className="text-semantic-error text-[13px]">{errors.dob.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-medium text-text-secondary">
                Giới thiệu
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className={`w-full p-4 bg-bg-canvas border ${errors.bio ? 'border-semantic-error' : 'border-border-hairline-strong'} rounded-md outline-none focus:border-primary transition-all text-[16px] text-text-primary resize-none`}
                placeholder="Viết giới thiệu ngắn về bản thân..."
              />
              {errors.bio && <p className="text-semantic-error text-[13px]">{errors.bio.message}</p>}
              <p className="text-[13px] text-text-tertiary font-normal">Tối đa 1000 ký tự</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="h-[44px] px-8 bg-primary text-white rounded-md font-medium text-[14px] hover:bg-primary-pressed active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
