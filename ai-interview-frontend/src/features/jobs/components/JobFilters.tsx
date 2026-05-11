import React, { useState } from 'react';
import { JobCategoryModal } from './JobCategoryModal';
import { useJobCategories } from '../hooks/useJobCategoriesAdmin';
import { LocationModal, SalaryModal, ExperienceModal, JobTypeModal } from './FilterModals';

interface FilterState {
  categoryIds: string[];
  location: string;
  salaryRange: string;
  experienceLevel: string;
  employmentType: string;
}

interface JobFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  selectedFilters: FilterState; // Bắt buộc truyền từ ngoài vào
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange, selectedFilters }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const { useFlatCategories } = useJobCategories();
  const { data: flatCategoriesData } = useFlatCategories({ limit: 1000 });
  const flatCategories = flatCategoriesData?.data.data || [];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...selectedFilters, [key]: value };
    onFilterChange?.(newFilters);
  };

  const getCategoryLabel = () => {
    if (selectedFilters.categoryIds.length === 0) return 'Ngành nghề';
    const firstId = selectedFilters.categoryIds[0];
    const category = flatCategories.find(c => c.id === firstId);
    const name = category ? category.name : 'Đã chọn';
    return selectedFilters.categoryIds.length === 1 ? name : `${name} (+${selectedFilters.categoryIds.length - 1})`;
  };

  const FILTER_BUTTONS = [
    { key: 'categoryIds', label: getCategoryLabel(), icon: 'work', modal: 'category' },
    { key: 'location', label: selectedFilters.location || 'Địa điểm', icon: 'location_on', modal: 'location' },
    { key: 'employmentType', label: selectedFilters.employmentType || 'Loại việc', icon: 'business_center', modal: 'type' },
    { key: 'salaryRange', label: selectedFilters.salaryRange || 'Mức lương', icon: 'payments', modal: 'salary' },
    { key: 'experienceLevel', label: selectedFilters.experienceLevel || 'Kinh nghiệm', icon: 'psychology', modal: 'experience' },
  ];

  const clearFilter = (e: React.MouseEvent, key: keyof FilterState) => {
    e.stopPropagation();
    updateFilter(key, key === 'categoryIds' ? [] : '');
  };

  return (
    <div className="filters-section mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {FILTER_BUTTONS.map((btn) => {
          const value = selectedFilters[btn.key as keyof FilterState];
          const isActive = Array.isArray(value) ? value.length > 0 : !!value;

          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setActiveModal(btn.modal)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all border group ${
                isActive 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-white text-text-secondary border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{btn.icon}</span>
              <span className="max-w-[150px] truncate">{btn.label}</span>
              
              {isActive ? (
                <span 
                  onClick={(e) => clearFilter(e, btn.key as keyof FilterState)}
                  className="material-symbols-outlined text-[18px] ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  close
                </span>
              ) : (
                <span className="material-symbols-outlined text-lg opacity-50">expand_more</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modals */}
      <JobCategoryModal 
        isOpen={activeModal === 'category'}
        onClose={() => setActiveModal(null)}
        initialSelectedIds={selectedFilters.categoryIds}
        onApply={(ids) => {
          updateFilter('categoryIds', ids);
          setActiveModal(null);
        }}
      />

      <LocationModal 
        isOpen={activeModal === 'location'}
        onClose={() => setActiveModal(null)}
        title="Chọn địa điểm"
        icon="location_on"
        onSelect={(loc) => {
          updateFilter('location', loc);
          setActiveModal(null);
        }}
      />

      <SalaryModal 
        isOpen={activeModal === 'salary'}
        onClose={() => setActiveModal(null)}
        title="Chọn mức lương"
        icon="payments"
        onSelect={(range) => {
          updateFilter('salaryRange', range);
          setActiveModal(null);
        }}
      />

      <ExperienceModal 
        isOpen={activeModal === 'experience'}
        onClose={() => setActiveModal(null)}
        title="Chọn kinh nghiệm"
        icon="psychology"
        onSelect={(lv) => {
          updateFilter('experienceLevel', lv);
          setActiveModal(null);
        }}
      />

      <JobTypeModal 
        isOpen={activeModal === 'type'}
        onClose={() => setActiveModal(null)}
        title="Chọn loại việc"
        icon="business_center"
        onSelect={(type) => {
          updateFilter('employmentType', type);
          setActiveModal(null);
        }}
      />
    </div>
  );
};
