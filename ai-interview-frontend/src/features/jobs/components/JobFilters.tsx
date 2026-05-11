import React, { useState, useEffect } from 'react';
import { JobCategoryModal } from './JobCategoryModal';
import { useJobCategories } from '../hooks/useJobCategoriesAdmin';

const FILTER_ITEMS = [
  { label: 'Địa điểm', icon: 'location_on' },
  { label: 'Loại việc', icon: 'business_center' },
  { label: 'Mức lương', icon: 'payments' },
  { label: 'Kinh nghiệm', icon: 'psychology' },
];

interface JobFiltersProps {
  onFilterChange?: (filters: { categoryIds: string[] }) => void;
  selectedCategoryIds?: string[]; // Thêm prop này để đồng bộ từ ngoài vào
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange, selectedCategoryIds: externalIds = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(externalIds);
  
  // Đồng bộ khi prop từ ngoài thay đổi
  useEffect(() => {
    setSelectedCategoryIds(externalIds);
  }, [externalIds]);

  const { useFlatCategories } = useJobCategories();
  const { data: flatCategoriesData } = useFlatCategories({ limit: 1000 });
  const flatCategories = flatCategoriesData?.data.data || [];

  const getSelectedLabel = () => {
    if (selectedCategoryIds.length === 0) return 'Chọn ngành nghề';
    
    const firstId = selectedCategoryIds[0];
    const category = flatCategories.find(c => c.id === firstId);
    const name = category ? category.name : 'Đã chọn';

    if (selectedCategoryIds.length === 1) return `Ngành nghề: ${name}`;
    return `Ngành nghề: ${name} (+${selectedCategoryIds.length - 1})`;
  };

  const handleClearCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFilterChange?.({ categoryIds: [] });
  };

  return (
    <div className="filters-section mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Category Filter Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all border group ${
            selectedCategoryIds.length > 0 
              ? 'bg-primary/10 text-primary border-primary/20' 
              : 'bg-white text-text-secondary border-gray-200 hover:border-primary hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-lg">work</span>
          <span>{getSelectedLabel()}</span>
          
          {selectedCategoryIds.length > 0 ? (
            <span 
              onClick={handleClearCategory}
              className="material-symbols-outlined text-[18px] ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              title="Xóa bộ lọc"
            >
              close
            </span>
          ) : (
            <span className="material-symbols-outlined text-lg opacity-50">expand_more</span>
          )}
        </button>

        {/* Other Filters */}
        {FILTER_ITEMS.map((item) => (
          <button
            key={item.label}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-text-secondary font-semibold hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-lg opacity-50">{item.icon}</span>
            <span>{item.label}</span>
            <span className="material-symbols-outlined text-lg opacity-50">expand_more</span>
          </button>
        ))}
      </div>

      <JobCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSelectedIds={selectedCategoryIds}
        onApply={(ids) => {
          onFilterChange?.({ categoryIds: ids });
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
