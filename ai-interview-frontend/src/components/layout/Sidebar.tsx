import React from 'react';
import { cn } from '../../shared/utils/cn';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Trang chủ', href: '/', active: true },

  // { icon: 'video_camera_front', label: 'Luyện tập phỏng vấn', href: '/interview-sets' },
  { icon: 'work', label: 'Việc làm', href: '/jobs' },
  // { icon: 'shopping_bag', label: 'Gói dịch vụ', href: '/packages' },
  // { icon: 'description', label: 'Hồ sơ CV', href: '/documents' },
  // { icon: 'article', label: 'Blog', href: '/blog', isExternal: true },
  // { icon: 'business', label: 'Dành cho Nhà tuyển dụng/Tổ chức', href: '/recruiter', isExternal: true },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <aside className={cn(
      "bg-white hidden lg:flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-40 border-r border-gray-100 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn("h-16 flex items-center px-6", isCollapsed && "justify-center px-0")}>
        <div className="flex items-center gap-3">
          <img 
            src="https://x-interview.com/images/favicon/favicon.png?v=2" 
            alt="Interview Logo" 
            className="size-8 object-contain"
          />
          {!isCollapsed && (
            <h2 className="text-text-primary text-xl font-bold tracking-tight">X-Interview</h2>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            
            title={isCollapsed ? item.label : ""}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
              item.active 
                ? "bg-primary/10 text-primary" 
                : "text-text-secondary hover:text-text-primary hover:bg-gray-50",
              isCollapsed && "justify-center"
            )}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
                
              </>
            )}
          </a>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4">
        <a 
          href="/settings" 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
        >
          <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs overflow-hidden">
            HO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate">Hoang Thach</p>
            <p className="text-[10px] text-text-secondary truncate">0 lượt</p>
          </div>
          <span className="material-symbols-outlined text-gray-400 text-[18px] group-hover:text-primary">
            settings
          </span>
        </a>
      </div>
    </aside>
  );
};
