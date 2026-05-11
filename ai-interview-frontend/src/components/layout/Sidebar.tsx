import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../shared/utils/cn';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Trang chủ', href: '/' },
  { icon: 'work', label: 'Việc làm', href: '/jobs' },
  // { icon: 'chat', label: 'Phỏng vấn AI', href: '/interviews/setup' },
  // { icon: 'history', label: 'Lịch sử', href: '/history' },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  return (
    <aside className={cn(
      "bg-white hidden lg:flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-40 border-r border-gray-100 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-[20px]">bolt</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold text-lg text-text-primary tracking-tight">AI Interview</span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all group overflow-hidden whitespace-nowrap",
                isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
              )}
            >
              <span className={cn(
                "material-symbols-outlined text-[22px] transition-colors",
                isActive ? "text-primary" : "text-gray-400 group-hover:text-text-primary"
              )}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-semibold text-[14px]">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-50">
        <Link 
          to="/profile" 
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-all group overflow-hidden",
            location.pathname === '/profile' ? "bg-gray-100" : "hover:bg-gray-50"
          )}
        >
          <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
            ) : (
              user?.fullName?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{user?.fullName || 'Người dùng'}</p>
                <p className="text-[10px] text-text-secondary truncate">{user?.email}</p>
              </div>
              <span 
                className="material-symbols-outlined text-gray-400 text-[18px] group-hover:text-primary transition-colors"
                title="Cài đặt tài khoản"
              >
                settings
              </span>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
};
