import React from 'react';

interface JobListItemProps {
  title: string;
  company: string;
}

export const JobListItem: React.FC<JobListItemProps> = ({ title, company }) => (
  <div className="flex items-center gap-3 py-3 border-b border-border-hairline last:border-0 hover:bg-bg-surface-soft transition-colors cursor-pointer px-2 rounded-md group">
    <div className="size-10 bg-bg-surface border border-border-hairline rounded-md flex items-center justify-center font-bold text-text-secondary group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
       <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[14px] font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{title}</div>
      <div className="text-[12px] text-text-secondary truncate">{company}</div>
    </div>
    <span className="material-symbols-outlined text-text-tertiary group-hover:text-primary text-[18px] transition-colors">chevron_right</span>
  </div>
);
