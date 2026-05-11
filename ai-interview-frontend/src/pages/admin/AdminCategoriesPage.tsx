import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useJobCategories } from '../../features/jobs/hooks/useJobCategoriesAdmin';
import { CategoryModal } from './components/CategoryModal';
import type { JobCategory } from '../../features/jobs/api/jobCategoryAdmin.api';

export const AdminCategoriesPage: React.FC = () => {
  const { 
    categoriesTree, 
    isTreeLoading, 
    deleteCategory, 
    isDeleting,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating
  } = useJobCategories();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [parentInfo, setParentInfo] = useState<{ id: string; name: string; type: string } | null>(null);

  const handleAddGroup = () => {
    setSelectedCategory(null);
    setParentInfo(null);
    setIsModalOpen(true);
  };

  const handleAddSub = (parent: JobCategory) => {
    setSelectedCategory(null);
    setParentInfo({ id: parent.id, name: parent.name, type: parent.type });
    setIsModalOpen(true);
  };

  const handleEdit = (category: JobCategory) => {
    setSelectedCategory(category);
    setParentInfo(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (data: { name: string; type: string; parentId?: string }) => {
    if (selectedCategory) {
      updateCategory({ id: selectedCategory.id, data: { name: data.name } }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createCategory(data as any, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  if (isTreeLoading) {
    return (
      <AdminLayout title="Quản lý Danh mục Ngành nghề">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý Danh mục Ngành nghề">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-[14px] text-text-secondary">Quản lý cấu trúc phân cấp: Nhóm nghề &gt; Ngành nghề &gt; Vị trí chuyên môn</p>
          <button 
            onClick={handleAddGroup}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold text-[13px] hover:brightness-110 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm nhóm mới
          </button>
        </div>

        <div className="space-y-4 pb-20">
          {categoriesTree.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-border-hairline">
              <p className="text-text-tertiary">Chưa có danh mục nào. Hãy tạo nhóm nghề đầu tiên!</p>
            </div>
          )}

          {categoriesTree.map(group => (
            <div key={group.id} className="bg-white border border-border-hairline rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="px-6 py-4 bg-bg-surface-soft border-b border-border-hairline flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">folder_open</span>
                  <span className="font-bold text-text-primary text-[15px]">{group.name}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Cấp 1</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAddSub(group)} className="p-1.5 hover:bg-white rounded-md text-text-tertiary hover:text-primary transition-all" title="Thêm ngành nghề"><span className="material-symbols-outlined text-[18px]">add_box</span></button>
                  <button onClick={() => handleEdit(group)} className="p-1.5 hover:bg-white rounded-md text-text-tertiary hover:text-primary transition-all" title="Sửa tên"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                  <button 
                    onClick={() => handleDelete(group.id, group.name)}
                    disabled={isDeleting}
                    className="p-1.5 hover:bg-white rounded-md text-text-tertiary hover:text-red-500 transition-all"
                    title="Xóa"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-border-hairline">
                {group.children?.map(industry => (
                  <div key={industry.id} className="px-10 py-3 bg-white hover:bg-bg-surface-soft/50 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-tertiary text-[18px]">subdirectory_arrow_right</span>
                        <span className="font-semibold text-text-primary text-[14px]">{industry.name}</span>
                        <span className="text-[10px] text-text-tertiary border border-border-hairline px-1.5 py-0.5 rounded uppercase">Cấp 2</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleAddSub(industry)} className="p-1 hover:bg-bg-surface rounded text-text-tertiary hover:text-primary transition-all" title="Thêm vị trí"><span className="material-symbols-outlined text-[16px]">add</span></button>
                        <button onClick={() => handleEdit(industry)} className="p-1 hover:bg-bg-surface rounded text-text-tertiary hover:text-primary transition-all" title="Sửa tên"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                        <button 
                          onClick={() => handleDelete(industry.id, industry.name)}
                          disabled={isDeleting}
                          className="p-1 hover:bg-bg-surface rounded text-text-tertiary hover:text-red-500 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pl-7">
                      {industry.children?.map(pos => (
                        <div key={pos.id} className="flex items-center gap-2 px-3 py-1 bg-bg-surface border border-border-hairline rounded-full group hover:border-primary transition-all">
                          <span className="text-[12px] text-text-secondary group-hover:text-primary">{pos.name}</span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleEdit(pos)}
                              className="size-4 flex items-center justify-center text-text-tertiary hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <span className="material-symbols-outlined text-[13px]">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(pos.id, pos.name)}
                              disabled={isDeleting}
                              className="size-4 flex items-center justify-center text-text-tertiary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
        parentInfo={parentInfo}
        isLoading={isCreating || isUpdating}
      />
    </AdminLayout>
  );
};
