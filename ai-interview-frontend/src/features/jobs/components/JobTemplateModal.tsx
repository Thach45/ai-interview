import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JobTemplate } from '../types/types';
import { jobTemplateSchema, type JobTemplateFormData } from '../validations/jobTemplate.validation';
import { useJobTemplates } from '../hooks/useJobTemplates';
import { JobCategoryModal } from './JobCategoryModal';
import { useJobCategories } from '../hooks/useJobCategoriesAdmin';
import { LocationModal, SalaryModal, ExperienceModal, JobTypeModal } from './FilterModals';

interface JobTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: JobTemplate | null;
}

export const JobTemplateModal: React.FC<JobTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'ai'>('basic');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // State cho các modal lựa chọn mới
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const { createTemplate, updateTemplate, isCreating, isUpdating } = useJobTemplates();

  const form = useForm<JobTemplateFormData>({
    resolver: zodResolver(jobTemplateSchema),
    defaultValues: {
      title: '',
      companyName: '',
      companyLogo: '',
      location: '',
      salaryRange: '',
      employmentType: 'Full-time',
      experienceLevel: 'JUNIOR',
      isRemote: false,
      categoryId: '',
      responsibilities: '',
      requirements: '',
      benefits: '',
      aiExtractedContext: '',
      isHotJob: false,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = form;

  useEffect(() => {
    if (template) {
      reset({
        title: template.title,
        companyName: template.companyName,
        companyLogo: template.companyLogo || '',
        location: template.location || '',
        salaryRange: template.salaryRange || '',
        employmentType: template.employmentType || 'Full-time',
        experienceLevel: template.experienceLevel,
        isRemote: template.isRemote,
        categoryId: template.categoryId,
        responsibilities: template.responsibilities,
        requirements: template.requirements,
        benefits: template.benefits,
        aiExtractedContext: template.aiExtractedContext,
        isHotJob: template.isHotJob,
      });
    } else {
      reset({
        title: '',
        companyName: '',
        companyLogo: '',
        location: '',
        salaryRange: '',
        employmentType: 'Full-time',
        experienceLevel: 'JUNIOR',
        isRemote: false,
        categoryId: '',
        responsibilities: '',
        requirements: '',
        benefits: '',
        aiExtractedContext: '',
        isHotJob: false,
      });
    }
  }, [template, reset]);

  const onSubmit: SubmitHandler<JobTemplateFormData> = async (data) => {
    try {
      if (template) {
        await updateTemplate({ id: template.id, data });
      } else {
        await createTemplate(data);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const { useFlatCategories } = useJobCategories();
  const { data: flatCategoriesData } = useFlatCategories({ limit: 1000 });
  const flatCategories = flatCategoriesData?.data.data || [];

  const getCategoryNames = (idsString: string) => {
    if (!idsString) return [];
    const ids = idsString.split(',').map(id => id.trim());
    return ids.map(id => {
      const cat = flatCategories.find(c => c.id === id);
      return cat ? cat.name : id;
    });
  };

  if (!isOpen) return null;

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-bg-canvas w-full max-w-[900px] max-h-[90vh] rounded-xl shadow-2xl border border-border-hairline flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-text-primary leading-tight">
                {template ? 'Cập nhật mẫu JD' : 'Thiết kế mẫu JD mới'}
              </h3>
              <p className="text-[11px] text-text-tertiary uppercase font-bold tracking-[0.5px]">Thư viện JD chuẩn hóa</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-bg-surface text-text-tertiary transition-all">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tabs Trigger */}
        <div className="px-6 bg-bg-surface-soft border-b border-border-hairline flex gap-8">
          {[
            { id: 'basic', label: 'Thông tin chung', icon: 'info' },
            { id: 'content', label: 'Nội dung hiển thị', icon: 'description' },
            { id: 'ai', label: 'Tri thức phỏng vấn (AI)', icon: 'psychology' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
              {(tab.id === 'basic' && (errors.title || errors.companyName)) ||
               (tab.id === 'content' && (errors.responsibilities || errors.requirements)) ||
               (tab.id === 'ai' && errors.aiExtractedContext) ? (
                <span className="size-2 bg-red-500 rounded-full"></span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Vị trí tuyển dụng</label>
                  <input 
                    type="text" 
                    {...register('title')}
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.title ? 'border-red-500' : 'border-border-hairline'} rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]`} 
                    placeholder="Ví dụ: Senior Frontend Developer"
                  />
                  {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Tên công ty</label>
                  <input 
                    type="text" 
                    {...register('companyName')}
                    className={`w-full px-4 py-2.5 bg-bg-surface border ${errors.companyName ? 'border-red-500' : 'border-border-hairline'} rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]`} 
                    placeholder="Ví dụ: Google Vietnam"
                  />
                  {errors.companyName && <p className="text-red-500 text-[11px] mt-1">{errors.companyName.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Địa điểm</label>
                  <div 
                    onClick={() => setActivePicker('location')}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg cursor-pointer hover:border-primary/30 transition-all flex items-center justify-between"
                  >
                    <span className={`text-[14px] ${watch('location') ? 'text-text-primary font-medium' : 'text-text-tertiary'}`}>
                      {watch('location') || 'Chọn địa điểm...'}
                    </span>
                    <span className="material-symbols-outlined text-text-tertiary">location_on</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Mức lương</label>
                  <input 
                    type="text" 
                    {...register('salaryRange')} 
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]" 
                    placeholder="Ví dụ: 15 - 25 triệu"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Hình thức làm việc</label>
                  <div 
                    onClick={() => setActivePicker('type')}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg cursor-pointer hover:border-primary/30 transition-all flex items-center justify-between"
                  >
                    <span className={`text-[14px] ${watch('employmentType') ? 'text-text-primary font-medium' : 'text-text-tertiary'}`}>
                      {watch('employmentType') || 'Chọn hình thức...'}
                    </span>
                    <span className="material-symbols-outlined text-text-tertiary">business_center</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Cấp bậc kinh nghiệm</label>
                  <div 
                    onClick={() => setActivePicker('experience')}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg cursor-pointer hover:border-primary/30 transition-all flex items-center justify-between"
                  >
                    <span className={`text-[14px] ${watch('experienceLevel') ? 'text-text-primary font-medium' : 'text-text-tertiary'}`}>
                      {watch('experienceLevel') || 'Chọn cấp bậc...'}
                    </span>
                    <span className="material-symbols-outlined text-text-tertiary">psychology</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-6 col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" {...register('isRemote')} className="size-4 rounded border-border-hairline text-primary" />
                    <span className="text-[13px] font-semibold text-text-secondary group-hover:text-text-primary transition-all">Làm việc từ xa (Remote)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" {...register('isHotJob')} className="size-4 rounded border-border-hairline text-orange-500" />
                    <span className="text-[13px] font-semibold text-text-secondary group-hover:text-orange-500 transition-all">Vị trí nổi bật</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Logo URL (Tùy chọn)</label>
                <input 
                  type="text" 
                  {...register('companyLogo')} 
                  className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[13px]" 
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Ngành nghề & Lĩnh vực chuyên môn</label>
                <div 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-full px-4 py-2 bg-bg-surface border border-border-hairline rounded-lg cursor-pointer hover:border-primary/30 transition-all flex flex-wrap items-center gap-2 min-h-[44px]"
                >
                  {watch('categoryId') ? (
                    getCategoryNames(watch('categoryId')).map((name, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-md border border-primary/20">
                        <span className="material-symbols-outlined text-[14px]">work</span>
                        {name}
                      </span>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-text-tertiary">
                      <span className="material-symbols-outlined text-text-tertiary">work</span>
                      <span className="text-[13px]">Chọn ngành nghề cho vị trí này...</span>
                    </div>
                  )}
                  <span className="material-symbols-outlined text-text-tertiary ml-auto">expand_more</span>
                </div>
                {errors.categoryId && <p className="text-red-500 text-[11px] mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Trách nhiệm công việc (Responsibilities)</label>
                <textarea 
                  rows={4} 
                  {...register('responsibilities')}
                  className={`w-full px-4 py-3 bg-bg-surface border ${errors.responsibilities ? 'border-red-500' : 'border-border-hairline'} rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px] leading-relaxed`} 
                  placeholder="Mô tả các nhiệm vụ chính của vị trí này..."
                ></textarea>
                {errors.responsibilities && <p className="text-red-500 text-[11px] mt-1">{errors.responsibilities.message}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Yêu cầu kỹ năng & Kinh nghiệm (Requirements)</label>
                <textarea 
                  rows={4} 
                  {...register('requirements')}
                  className={`w-full px-4 py-3 bg-bg-surface border ${errors.requirements ? 'border-red-500' : 'border-border-hairline'} rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px] leading-relaxed`} 
                  placeholder="Các kỹ năng bắt buộc, ngôn ngữ, số năm kinh nghiệm..."
                ></textarea>
                {errors.requirements && <p className="text-red-500 text-[11px] mt-1">{errors.requirements.message}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-text-tertiary uppercase mb-2">Quyền lợi & Chế độ (Benefits)</label>
                <textarea 
                  rows={4} 
                  {...register('benefits')}
                  className={`w-full px-4 py-3 bg-bg-surface border ${errors.benefits ? 'border-red-500' : 'border-border-hairline'} rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px] leading-relaxed`} 
                  placeholder="Lương thưởng, bảo hiểm, du lịch, môi trường làm việc..."
                ></textarea>
                {errors.benefits && <p className="text-red-500 text-[11px] mt-1">{errors.benefits.message}</p>}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <p className="text-[13px] text-primary/80 leading-relaxed font-medium">
                  Trường <strong>tri thức phỏng vấn</strong> này sẽ được AI sử dụng làm tri thức nền để đặt câu hỏi. Hãy cung cấp bối cảnh chuyên sâu nhất để tối ưu hóa phỏng vấn.
                </p>
              </div>
              <textarea 
                rows={12} 
                {...register('aiExtractedContext')}
                className={`w-full px-4 py-4 bg-bg-surface border ${errors.aiExtractedContext ? 'border-red-500' : 'border-border-hairline'} rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px] font-mono leading-relaxed`} 
                placeholder="Ví dụ: Dự án này sử dụng Microservices với NestJS, yêu cầu ứng viên hiểu sâu về kiến trúc Event-driven..." 
              ></textarea>
              {errors.aiExtractedContext && <p className="text-red-500 text-[11px] mt-1">{errors.aiExtractedContext.message}</p>}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-border-hairline bg-bg-surface-soft flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-[13px] font-bold text-text-secondary hover:text-text-primary transition-colors">Hủy bỏ</button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-10 py-2.5 rounded-lg text-[13px] font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Đang lưu...
              </>
            ) : (
              'Lưu mẫu JD'
            )}
          </button>
        </div>
      </form>

      {/* Modals Picker */}
      <JobCategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialSelectedIds={watch('categoryId')?.split(',').map(id => id.trim()).filter(Boolean) || []}
        onApply={(ids) => {
          setValue('categoryId', ids.join(','));
          setIsCategoryModalOpen(false);
        }}
      />

      <LocationModal 
        isOpen={activePicker === 'location'}
        onClose={() => setActivePicker(null)}
        title="Chọn địa điểm"
        icon="location_on"
        onSelect={(loc) => setValue('location', loc)}
      />

      <SalaryModal 
        isOpen={activePicker === 'salary'}
        onClose={() => setActivePicker(null)}
        title="Chọn mức lương"
        icon="payments"
        onSelect={(range) => setValue('salaryRange', range)}
      />

      <ExperienceModal 
        isOpen={activePicker === 'experience'}
        onClose={() => setActivePicker(null)}
        title="Chọn kinh nghiệm"
        icon="psychology"
        onSelect={(lv) => setValue('experienceLevel', lv as any)}
      />

      <JobTypeModal 
        isOpen={activePicker === 'type'}
        onClose={() => setActivePicker(null)}
        title="Chọn loại việc"
        icon="business_center"
        onSelect={(type) => setValue('employmentType', type)}
      />
    </div>
  );
};
