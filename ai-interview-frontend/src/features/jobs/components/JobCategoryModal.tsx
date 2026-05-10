import React, { useState } from 'react';



interface JobCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedIds: string[]) => void;
}

export const JobCategoryModal: React.FC<JobCategoryModalProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

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
        <div className="flex-1 overflow-hidden flex divide-x divide-border-hairline">
          
          {/* Column 1: Nhóm nghề */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2 bg-bg-surface-soft text-[11px] font-bold text-text-tertiary uppercase border-b border-border-hairline">
              Nhóm nghề
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {['CÔNG NGHỆ THÔNG TIN', 'MARKETING', 'KINH DOANH', 'NHÂN SỰ'].map((group) => (
                <div 
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors group ${selectedGroup === group ? 'bg-primary/5 text-primary' : 'hover:bg-bg-surface text-text-primary'}`}
                >
                  <input 
                    type="checkbox" 
                    className="size-4 rounded border-border-hairline-strong text-primary focus:ring-primary/20 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); toggleCheck(group); }}
                  />
                  <span className="text-[13px] font-medium flex-1 truncate">{group}</span>
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Nghề */}
          <div className="flex-1 flex flex-col min-w-0 bg-bg-surface-soft/30">
            <div className="px-4 py-2 bg-bg-surface-soft text-[11px] font-bold text-text-tertiary uppercase border-b border-border-hairline">
              Nghề
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!selectedGroup ? (
                <div className="h-full flex flex-col items-center justify-center text-text-tertiary gap-2 opacity-60">
                  <span className="material-symbols-outlined text-[32px]">arrow_back</span>
                  <span className="text-[12px] font-medium">Chọn nhóm nghề</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {['Phần mềm', 'Mạng máy tính', 'Bảo mật', 'Dữ liệu'].map((industry) => (
                    <div 
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors group ${selectedIndustry === industry ? 'bg-primary/5 text-primary' : 'hover:bg-bg-surface text-text-primary'}`}
                    >
                      <input type="checkbox" className="size-4 rounded border-border-hairline-strong text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="text-[13px] font-medium flex-1 truncate">{industry}</span>
                      <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                    </div>
                  ))}
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
              {!selectedIndustry ? (
                <div className="h-full flex flex-col items-center justify-center text-text-tertiary gap-2 opacity-60">
                  <span className="material-symbols-outlined text-[32px]">arrow_back</span>
                  <span className="text-[12px] font-medium">Chọn nghề</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {['Frontend Developer', 'Backend Developer', 'Fullstack Developer'].map((pos) => (
                    <div 
                      key={pos}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-bg-surface text-text-primary transition-colors group"
                    >
                      <input type="checkbox" className="size-4 rounded border-border-hairline-strong text-primary focus:ring-primary/20 cursor-pointer" />
                      <span className="text-[13px] font-medium flex-1 truncate">{pos}</span>
                    </div>
                  ))}
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
