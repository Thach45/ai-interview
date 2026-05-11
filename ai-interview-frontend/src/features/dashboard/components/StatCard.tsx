import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string;
  textColorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, textColorClass }) => (
  <div className="bg-bg-canvas p-6 rounded-lg border border-border-hairline flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <span className="text-[11px] font-semibold text-text-secondary uppercase">{title}</span>
      <div className={`size-9 rounded-md ${colorClass} flex items-center justify-center`}>
        <span className={`material-symbols-outlined text-[20px] ${textColorClass}`}>{icon}</span>
      </div>
    </div>
    <div className="text-[28px] font-semibold text-text-primary leading-tight">{value}</div>
  </div>
);
