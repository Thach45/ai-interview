import React from 'react';

interface HeaderProps {
  title: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, isSidebarCollapsed, onToggleSidebar }) => {
  return (
    <header className="px-6 h-16 flex items-center justify-between border-b border-gray-200 bg-white flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={onToggleSidebar}
          className="material-symbols-outlined text-text-secondary hover:bg-gray-100 size-9 flex items-center justify-center rounded-lg transition-colors"
        >
          {isSidebarCollapsed ? 'menu_open' : 'menu'}
        </button>
        
        <h1 className="text-[15px] font-bold text-text-primary tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications or Profile can go here */}
        <button className="material-symbols-outlined text-text-secondary hover:bg-gray-100 size-9 flex items-center justify-center rounded-lg transition-colors">
          notifications
        </button>
        
        <button className="material-symbols-outlined text-text-secondary hover:bg-gray-100 size-9 flex items-center justify-center rounded-lg transition-colors">
          dark_mode
        </button>

        
        {/* User Profile Mini */}
        
      </div>
    </header>
  );
};
