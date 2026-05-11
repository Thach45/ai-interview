import React from 'react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ id, title, company, location, salary, type, postedAt, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer relative ${
        isSelected ? 'border-primary ring-1 ring-primary/20 shadow-md' : 'border-gray-100'
      }`}
    >
      {/* Heart Action */}
      <button className="absolute top-4 right-4 material-symbols-outlined text-gray-300 hover:text-red-500 transition-colors text-[20px]">
        favorite
      </button>

      <div className="flex gap-4">
        {/* Company Logo/Icon */}
        <div className="size-12 flex-shrink-0 border border-gray-100 rounded-lg flex items-center justify-center text-primary bg-white shadow-sm">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'wght' 300" }}>
            corporate_fare
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-text-primary mb-0.5 group-hover:text-primary transition-colors line-clamp-1 pr-6">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-3">
            <span className="font-medium">{company}</span>
            <span className="text-gray-300">•</span>
            <span>{location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-0.5 bg-[#eefcf4] text-[#22c55e] text-[11px] font-bold rounded">
              {salary}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-text-secondary text-[11px] font-bold rounded">
              {type}
            </span>
          </div>

          <p className="text-[11px] text-text-secondary font-medium">
            {postedAt}
          </p>
        </div>
      </div>
    </div>
  );
};
