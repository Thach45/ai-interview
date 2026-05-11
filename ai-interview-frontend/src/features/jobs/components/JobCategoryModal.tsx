import React, { useState, useMemo } from 'react';
import { useJobCategories } from '../hooks/useJobCategoriesAdmin';
import type { JobCategory } from '../api/jobCategoryAdmin.api';

interface JobCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedIds: string[]) => void;
  initialSelectedIds?: string[];
}

export const JobCategoryModal: React.FC<JobCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onApply,
  initialSelectedIds = []
}) => {
  const { categoriesTree, isTreeLoading } = useJobCategories();
  
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(initialSelectedIds));

  // Lấy danh sách Ngành nghề thuộc Nhóm nghề đang chọn
  const industries = useMemo(() => {
    if (!selectedGroupId) return [];
    const group = categoriesTree.find(g => g.id === selectedGroupId);
    return group?.children || [];
  }, [selectedGroupId, categoriesTree]);

  // Lấy danh sách Vị trí thuộc Ngành nghề đang chọn
  const positions = useMemo(() => {
    if (!selectedIndustryId) return [];
    const industry = industries.find(i => i.id === selectedIndustryId);
    return industry?.children || [];
  }, [selectedIndustryId, industries]);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedIds(newChecked);
  };

  const handleClearAll = () => setCheckedIds(new Set());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg-canvas w-full max-w-[960px] max-h-[85vh] rounded-xl shadow-2xl flex flex-col border border-border-hairline overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-hairline flex justify-between items-center bg-bg-surface-soft">
          <h3 className="text-[18px] font-semibold text-text-primary">Chọn ngành nghề</h3>
          <button 
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-md hover:bg-bg-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary">close</span>
          </button>
        </div>

        {/* Content - 3 Columns */}
        <div className="flex-1 overflow-hidden flex divide-x divide-border-hairline min-h-[400px]">
          
          {/* Column 1: Nhóm nghề */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2 bg-bg-surface-soft text-[11px] font-bold text-text-tertiary uppercase border-b border-border-hairline">
              Nhóm nghề
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {isTreeLoading ? (
                <div className="p-4 space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md" />)}
                </div>
              ) : (
                categoriesTree.map((group) => (
                  <div 
                    key={group.id}
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setSelectedIndustryId(null);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors group ${selectedGroupId === group.id ? 'bg-primary/5 text-primary' : 'hover:bg-bg-surface text-text-primary'}`}
                  >
                    <input 
                      type="checkbox" 
                      checked={checkedIds.has(group.id)}
                      className="size-4 rounded border-border-hairline-strong text-primary focus:ring-primary/20 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); toggleCheck(group.id); }}
                      onChange={() => {}} 
                    />
                    <span className="text-[13px] font-medium flex-1 truncate">{group.name}</span>
                    <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Ngành nghề */}
          <div className="flex-1 flex flex-col min-w-0 bg-bg-surface-soft/30">
            <div className="px-4 py-2 bg-bg-surface-soft text-[11px] font-bold text-text-tertiary uppercase border-b border-border-hairline">
              Ngành nghề
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!selectedGroupId ? (
                <div className="h-full flex flex-col items-center justify-center text-text-tertiary gap-2 opacity-60">
                  <span className="material-symbols-outlined text-[32px]">arrow_back</span>
                  <span className="text-[12px] font-medium text-center px-4">Chọn nhóm nghề để xem danh sách ngành</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {industries.map((industry) => (
                    <div 
                      key={industry.id}
                      onClick={() => setSelectedIndustryId(industry.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors group ${selectedIndustryId === industry.id ? 'bg-primary/5 text-primary' : 'hover:bg-bg-surface text-text-primary'}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={checkedIds.has(industry.id)}
                        className="size-4 rounded border-border-hairline-strong text-primary focus:ring-primary/20 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); toggleCheck(industry.id); }}
                        onChange={() => {}}
                      />
                      <span className="text-[13px] font-medium flex-1 truncate">{industry.name}</span>
                      <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                    </div>
                  ))}
                  {industries.length === 0 && <p className="text-center py-10 text-[12px] text-text-tertiary italic">Chưa có dữ liệu ngành</p>}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Vị trí chuyên môn */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2 bg-bg-surface-soft text-[11px] font-bold text-text-tertiary uppercase border-b border-border-hairline">
              Vị trí chuyên môn
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!selectedIndustryId ? (
                <div className="h-full flex flex-col items-center justify-center text-text-tertiary gap-2 opacity-60">
                  <span className="material-symbols-outlined text-[32px]">arrow_back</span>
                  <span className="text-[12px] font-medium text-center px-4">Chọn ngành nghề để xem vị trí</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {positions.map((pos) => (
                    <div 
                      key={pos.id}
                      onClick={() => toggleCheck(pos.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors group ${checkedIds.has(pos.id) ? 'bg-primary/5 text-primary' : 'hover:bg-bg-surface text-text-primary'}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={checkedIds.has(pos.id)}
                        className="size-4 rounded border-border-hairline-strong text-primary focus:ring-primary/20 cursor-pointer"
                        onChange={() => {}}
                      />
                      <span className="text-[13px] font-medium flex-1 truncate">{pos.name}</span>
                    </div>
                  ))}
                  {positions.length === 0 && <p className="text-center py-10 text-[12px] text-text-tertiary italic">Chưa có dữ liệu vị trí</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-hairline flex justify-between items-center bg-bg-surface-soft/50">
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 text-[13px] font-semibold text-text-secondary hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
            Bỏ chọn tất cả ({checkedIds.size})
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-md text-[13px] font-semibold text-text-primary hover:bg-bg-surface transition-all"
            >
              Hủy
            </button>
            <button 
              onClick={() => onApply(Array.from(checkedIds))}
              className="bg-primary text-white px-8 py-2 rounded-md text-[13px] font-semibold hover:brightness-110 active:scale-[0.95] transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Áp dụng
              <span className="material-symbols-outlined text-[18px]">check</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
