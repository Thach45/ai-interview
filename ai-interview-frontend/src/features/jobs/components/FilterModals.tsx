import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
}

const ModalWrapper: React.FC<BaseModalProps & { children: React.ReactNode }> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <h3 className="font-bold text-[15px]">{title}</h3>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. Modal Địa điểm
export const LocationModal: React.FC<BaseModalProps & { onSelect: (loc: string) => void }> = (props) => {
  const cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Remote'];
  return (
    <ModalWrapper {...props}>
      <div className="grid grid-cols-1 gap-2">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => { props.onSelect(city); props.onClose(); }}
            className="w-full px-4 py-3 text-left text-[14px] font-medium text-text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all flex items-center justify-between group"
          >
            {city}
            <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100">chevron_right</span>
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};

// 2. Modal Mức lương
export const SalaryModal: React.FC<BaseModalProps & { onSelect: (range: string) => void }> = (props) => {
  const ranges = [
    { label: 'Dưới 10 triệu', value: '10' },
    { label: '10 - 20 triệu', value: '10-20' },
    { label: 'Trên 20 triệu', value: '20' },
    { label: 'Thỏa thuận', value: 'Negotiable' },
  ];
  return (
    <ModalWrapper {...props}>
      <div className="grid grid-cols-1 gap-2">
        {ranges.map(r => (
          <button
            key={r.value}
            onClick={() => { props.onSelect(r.label); props.onClose(); }}
            className="w-full px-4 py-3 text-left text-[14px] font-medium text-text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
          >
            {r.label}
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};

// 3. Modal Kinh nghiệm
export const ExperienceModal: React.FC<BaseModalProps & { onSelect: (lv: string) => void }> = (props) => {
  const levels = ['INTERN', 'FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'MANAGER', 'DIRECTOR'];
  return (
    <ModalWrapper {...props}>
      <div className="grid grid-cols-1 gap-2">
        {levels.map(lv => (
          <button
            key={lv}
            onClick={() => { props.onSelect(lv); props.onClose(); }}
            className="w-full px-4 py-3 text-left text-[14px] font-medium text-text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
          >
            {lv}
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};

// 4. Modal Loại việc
export const JobTypeModal: React.FC<BaseModalProps & { onSelect: (type: string) => void }> = (props) => {
  const types = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  return (
    <ModalWrapper {...props}>
      <div className="grid grid-cols-1 gap-2">
        {types.map(t => (
          <button
            key={t}
            onClick={() => { props.onSelect(t); props.onClose(); }}
            className="w-full px-4 py-3 text-left text-[14px] font-medium text-text-secondary hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
          >
            {t}
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};
