import React, { useState } from 'react';
import { JobCategoryModal } from './JobCategoryModal';

const FILTER_ITEMS = [
  { label: 'Loại việc', icon: 'business_center' },
  { label: 'Mức lương', icon: 'payments' },
  { label: 'Kinh nghiệm', icon: 'psychology', badge: '(1)', active: true },
];

export const JobFilters = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="filters-section mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Saved Filter Button */}
        
        {/* Job Role Multi-Select (Trigger Modal) */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
        >
          <span className="material-symbols-outlined text-lg">work</span>
          <span>Chọn ngành nghề</span>
          <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">+1</span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </button>

        {/* Other Filters */}
        {FILTER_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all border ${
              item.active 
                ? 'bg-primary/10 text-primary border-primary/20' 
                : 'bg-white text-text-secondary border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="ml-0.5">{item.badge}</span>}
            <span className="material-symbols-outlined text-lg opacity-50">expand_more</span>
          </button>
        ))}
      </div>

      <JobCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={(ids) => {
          console.log('Applied categories:', ids);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
