import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { JobFilters } from '../../features/jobs/components/JobFilters';
import { JobTemplateTable } from '../../features/jobs/components/JobTemplateTable';
import { JobTemplateModal } from '../../features/jobs/components/JobTemplateModal';
import type { JobTemplate } from '../../features/jobs/types/types';
import { useJobTemplates } from '../../features/jobs/hooks/useJobTemplates';

export const AdminJobsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);

  const { templates, isLoading, deleteTemplate } = useJobTemplates({ search });

  const handleOpenModal = (template: JobTemplate | null = null) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mẫu JD này?')) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Job Templates">
      {/* Action Bar & Filters */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-[400px] group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Tìm mẫu JD theo tiêu đề, công ty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-[14px]"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-[13px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thiết kế mẫu JD mới
          </button>
        </div>

        <div className="bg-bg-surface/30 p-4 rounded-xl border border-border-hairline">
           <div className="text-[11px] font-bold text-text-tertiary uppercase mb-3 px-1">Lọc theo ngành nghề & kỹ năng</div>
           <JobFilters />
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-[13px] text-text-tertiary font-medium">Đang tải danh sách mẫu JD...</p>
        </div>
      ) : (
        <JobTemplateTable 
          templates={templates} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete}
        />
      )}

      {/* CRUD Modal Studio */}
      <JobTemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={editingTemplate}
      />
    </AdminLayout>
  );
};
