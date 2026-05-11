import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { JobSearch } from '../../features/jobs/components/JobSearch';
import { JobFilters } from '../../features/jobs/components/JobFilters';
import { JobTemplateTable } from '../../features/jobs/components/JobTemplateTable';
import { JobTemplateModal } from '../../features/jobs/components/JobTemplateModal';
import type { JobTemplate } from '../../features/jobs/types/types';
import { useJobTemplates } from '../../features/jobs/hooks/useJobTemplates';

export const AdminJobsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);

  const { templates, isLoading, deleteTemplate } = useJobTemplates({ 
    search, 
    categoryIds 
  });

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

  // Định nghĩa nút bấm để đưa lên Header của AdminLayout
  const renderHeaderAction = (
    <button 
      onClick={() => handleOpenModal()}
      className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[18px]">add</span>
      Thiết kế mẫu JD mới
    </button>
  );

  return (
    <AdminLayout 
      title="Quản lý Job Templates" 
      rightAction={renderHeaderAction}
    >
      <div className="flex flex-col gap-6 mb-8">
        {/* Search Bar chiếm trọn chiều ngang */}
        <div className="w-full">
          <JobSearch onSearch={(val) => setSearch(val)} />
        </div>

        {/* Filter Section */}
        <div className="bg-bg-surface/30 p-4 rounded-xl border border-border-hairline">
           <div className="text-[11px] font-bold text-text-tertiary uppercase mb-3 px-1">Lọc theo ngành nghề & kỹ năng</div>
           <JobFilters 
             selectedCategoryIds={categoryIds}
             onFilterChange={(filters) => setCategoryIds(filters.categoryIds)} 
           />
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

      <JobTemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={editingTemplate}
      />
    </AdminLayout>
  );
};
