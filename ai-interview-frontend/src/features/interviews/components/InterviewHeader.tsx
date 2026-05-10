import React from 'react';

interface InterviewHeaderProps {
  jobTitle: string;
  duration: string;
  onEndSession: () => void;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({ jobTitle, duration, onEndSession }) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <div>
          <h2 className="text-[14px] font-bold text-text-primary leading-tight">{jobTitle}</h2>
          <p className="text-[12px] text-text-secondary">Phỏng vấn sơ loại AI</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-text-secondary font-medium text-[13px] bg-gray-50 px-3 py-1.5 rounded-full">
          <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
          {duration}
        </div>
        
        <button 
          onClick={onEndSession}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-[13px] hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">stop_circle</span>
          Kết thúc phỏng vấn
        </button>
      </div>
    </header>
  );
};
