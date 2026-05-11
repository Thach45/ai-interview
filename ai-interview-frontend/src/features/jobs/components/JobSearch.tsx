import React from 'react';

interface JobSearchProps {
  onSearch?: (keyword: string) => void;
}

export const JobSearch: React.FC<JobSearchProps> = ({ onSearch }) => {
  return (
    <div className="search-section bg-white rounded-xl border border-[#e5e7eb] p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <form 
        id="job-search-form" 
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-2xl">
            search
          </span>
          <input
            type="text"
            name="keyword"
            id="job-keyword"
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Tìm kiếm việc làm theo tiêu đề, công ty hoặc từ khóa..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary/20 transition-all text-base outline-none"
          />
        </div>
      </form>
    </div>
  );
};
