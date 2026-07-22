import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 shrink-0 ${className}`}>
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{title}</h1>
        {description && (
          <p className="text-gray-500 font-medium">{description}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
