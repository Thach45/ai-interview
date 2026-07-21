import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useCvTemplatesAdmin } from '../../features/cvs/hooks/useCvTemplatesAdmin';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

import { CvTemplateModal } from '../../features/cvs/components/CvTemplateModal';
import type { CvTemplate } from '../../features/cvs/api/cvTemplateAdmin.api';

export const AdminCvTemplatesPage: React.FC = () => {
  const { templates, isTemplatesLoading, deleteTemplate } = useCvTemplatesAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CvTemplate | null>(null);

  const handleAdd = () => {
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template: CvTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mẫu CV "${name}"?`)) {
      deleteTemplate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Mẫu CV</h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình các giao diện mẫu cho chức năng Tối ưu CV</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all"
        >
          <Plus size={18} /> Thêm mẫu mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isTemplatesLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có mẫu CV nào. Hãy thêm mẫu mới.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[13px] uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Hình ảnh</th>
                <th className="py-4 px-6 font-bold">Tên mẫu</th>
                <th className="py-4 px-6 font-bold text-center">Trạng thái</th>
                <th className="py-4 px-6 font-bold text-center">Ngày tạo</th>
                <th className="py-4 px-6 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map((tpl) => (
                <tr key={tpl.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <img 
                      src={tpl.thumbnailUrl || 'https://via.placeholder.com/150'} 
                      alt={tpl.name} 
                      className="w-16 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-gray-800">{tpl.name}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {tpl.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Kích hoạt</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Đã ẩn</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-500">
                    {new Date(tpl.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(tpl)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tpl.id, tpl.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CvTemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
      />
    </AdminLayout>
  );
};
