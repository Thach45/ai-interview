import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../shared/services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../shared/utils/cn';

const MENU_ITEMS = [
  // { id: 'dashboard', label: 'Tổng quan', icon: 'dashboard', path: '/admin' },
  { id: 'users', label: 'Người dùng', icon: 'group', path: '/admin/users' },
  { id: 'jobs', label: 'Mẫu JD', icon: 'description', path: '/admin/jobs' },
  { id: 'categories', label: 'Ngành nghề', icon: 'category', path: '/admin/categories' },
  { id: 'transactions', label: 'Giao dịch & Credit', icon: 'toll', path: '/admin/transactions' },
  // { id: 'interviews', label: 'Phiên phỏng vấn', icon: 'history', path: '/admin/interviews' },
];


const SECONDARY_ITEMS = [
  { label: 'Cài đặt hệ thống', icon: 'settings', path: '/admin/settings' },
  { label: 'Trang người dùng', icon: 'open_in_new', path: '/' },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
   const user = useAuthStore((state) => state.user);

  return (
    <aside className="w-[280px] h-full flex flex-col bg-bg-canvas p-4 select-none">
      {/* Logo Area */}
      <div className="px-4 py-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-black rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]">terminal</span>
          </div>
          <span className="text-[18px] font-bold tracking-tight text-text-primary">Admin Panel</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 space-y-1">
        <div className="px-4 mb-2 text-[11px] font-bold text-text-tertiary uppercase">Chính</div>
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all group ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-text-primary'}`}>
                {item.icon}
              </span>
              <span className="text-[14px]">{item.label}</span>
              {isActive && <div className="ml-auto size-1.5 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Menu */}
      <div className="mt-auto pt-4 border-t border-border-hairline space-y-1">
        {SECONDARY_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-all group"
          >
            <span className="material-symbols-outlined text-[22px] text-text-tertiary group-hover:text-text-primary">
              {item.icon}
            </span>
            <span className="text-[14px]">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Profile Area */}
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
                
              </Link>
            </div>
    </aside>
  );
};
