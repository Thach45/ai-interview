import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCvTemplatesAdmin } from '../hooks/useCvTemplatesAdmin';
import type { CvTemplate } from '../api/cvTemplateAdmin.api';

interface CvTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: CvTemplate | null;
}

export const CvTemplateModal: React.FC<CvTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const { createTemplate, isCreating, updateTemplate, isUpdating } = useCvTemplatesAdmin();
  const isEdit = !!template;

  const [formData, setFormData] = useState({
    name: '',
    thumbnailUrl: '',
    htmlStructure: '',
    cssStyles: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setFormData({
          name: template.name,
          thumbnailUrl: template.thumbnailUrl,
          htmlStructure: template.htmlStructure,
          cssStyles: template.cssStyles,
          isActive: template.isActive,
        });
      } else {
        setFormData({
          name: '',
          thumbnailUrl: '',
          htmlStructure: '',
          cssStyles: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, template]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && template) {
      updateTemplate({ id: template.id, data: formData }, {
        onSuccess: () => {
          onClose();
        }
      });
    } else {
      createTemplate(formData, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Chỉnh sửa Mẫu CV' : 'Thêm Mẫu CV Mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="templateForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên mẫu <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="VD: Minimalist, Creative..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái</label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="true">Kích hoạt (Hiển thị)</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail URL <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="thumbnailUrl"
                required
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="https://..."
              />
              {formData.thumbnailUrl && (
                <div className="mt-2 h-32 overflow-hidden rounded-lg border border-gray-200">
                  <img src={formData.thumbnailUrl} alt="Preview" className="h-full object-contain bg-gray-100" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">HTML Structure (Handlebars) <span className="text-red-500">*</span></label>
              <textarea
                name="htmlStructure"
                required
                value={formData.htmlStructure}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm"
                placeholder="<div>{{personalInfo.fullName}}</div>..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">CSS Styles</label>
              <textarea
                name="cssStyles"
                value={formData.cssStyles}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm"
                placeholder=".cv-wrapper { ... }"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="templateForm"
            disabled={isCreating || isUpdating}
            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isCreating || isUpdating ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            {isEdit ? 'Lưu thay đổi' : 'Thêm mẫu mới'}
          </button>
        </div>
      </div>
    </div>
  );
};
