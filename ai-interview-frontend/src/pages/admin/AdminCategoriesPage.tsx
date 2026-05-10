import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';

interface Category {
  id: string;
  name: string;
  type: 'GROUP' | 'INDUSTRY' | 'POSITION';
  parentId?: string;
  subCategories?: Category[];
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Công nghệ thông tin',
    type: 'GROUP',
    subCategories: [
      {
        id: '1-1',
        name: 'Phát triển phần mềm',
        type: 'INDUSTRY',
        parentId: '1',
        subCategories: [
          { id: '1-1-1', name: 'Frontend Developer', type: 'POSITION', parentId: '1-1' },
          { id: '1-1-2', name: 'Backend Developer', type: 'POSITION', parentId: '1-1' },
        ]
      },
      {
        id: '1-2',
        name: 'Dữ liệu & AI',
        type: 'INDUSTRY',
        parentId: '1',
        subCategories: [
          { id: '1-2-1', name: 'AI Engineer', type: 'POSITION', parentId: '1-2' },
          { id: '1-2-2', name: 'Data Scientist', type: 'POSITION', parentId: '1-2' },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Thiết kế đồ họa',
    type: 'GROUP',
    subCategories: []
  }
];

export const AdminCategoriesPage: React.FC = () => {
  const [categories] = useState(MOCK_CATEGORIES);

  return (
    <AdminLayout title="Quản lý Danh mục Ngành nghề">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-[14px] text-text-secondary">Quản lý cấu trúc phân cấp: Nhóm nghề &gt; Ngành nghề &gt; Vị trí chuyên môn</p>
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold text-[13px] hover:brightness-110 transition-all shadow-md shadow-primary/20 flex items-center gap-2">
            
            Thêm nhóm mới
          </button>
        </div>

        <div className="space-y-4">
          {categories.map(group => (
            <div key={group.id} className="bg-white border border-border-hairline rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-bg-surface-soft border-b border-border-hairline flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary">folder_open</span>
                   <span className="font-bold text-text-primary text-[15px]">{group.name}</span>
                   <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Nhóm cấp 1</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-white rounded-md text-text-tertiary hover:text-primary transition-all"><span className="material-symbols-outlined text-[18px]">add_box</span></button>
                  <button className="p-1.5 hover:bg-white rounded-md text-text-tertiary hover:text-primary transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                </div>
              </div>
              
              <div className="divide-y divide-border-hairline">
                {group.subCategories?.map(industry => (
                  <div key={industry.id} className="px-10 py-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-text-tertiary text-[18px]">subdirectory_arrow_right</span>
                         <span className="font-semibold text-text-primary text-[14px]">{industry.name}</span>
                         <span className="text-[10px] text-text-tertiary border border-border-hairline px-1.5 py-0.5 rounded uppercase">Cấp 2</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-bg-surface rounded text-text-tertiary hover:text-primary transition-all"><span className="material-symbols-outlined text-[16px]">add</span></button>
                        <button className="p-1 hover:bg-bg-surface rounded text-text-tertiary hover:text-primary transition-all"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pl-7">
                      {industry.subCategories?.map(pos => (
                        <div key={pos.id} className="flex items-center gap-2 px-3 py-1 bg-bg-surface border border-border-hairline rounded-full group">
                           <span className="text-[12px] text-text-secondary group-hover:text-text-primary">{pos.name}</span>
                           <button className="size-4 flex items-center justify-center text-text-tertiary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                           </button>
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
    </AdminLayout>
  );
};
