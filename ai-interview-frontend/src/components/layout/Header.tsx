import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { NotificationDropdown } from '../../features/notifications/components/NotificationDropdown';


interface HeaderProps {
  hideSearch?: boolean;
}


const NAV_ITEMS = [
  { id: 'dashboard', label: 'Trang chủ', href: '/' },
  { id: 'jobs', label: 'Việc làm', href: '/jobs' },
  { id: 'cvs', label: 'Quản lý CV', href: '/my-cvs' },
  { id: 'interview', label: 'Phỏng vấn AI', href: '/interviews/setup' },
  { id: 'subscription', label: 'Gói dịch vụ', href: '/subscription' },
];

export const Header: React.FC<HeaderProps> = ({ hideSearch = false }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shrink-0 gap-6">
      
      {/* Left: Brand & Navigation */}
      <div className="flex items-center shrink-0">
        <Link to="/" className="flex items-center gap-3 group mr-6">
          <div className="size-8 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[17px] font-bold text-gray-900 hidden md:block tracking-tight whitespace-nowrap">
            AI Interview
          </span>
        </Link>
        
        {/* Toggle Nav Button */}
        

        {/* Navigation Container (Animated Width) */}
        <div 
          className="hidden lg:flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: isNavCollapsed ? '0px' : '480px', opacity: isNavCollapsed ? 0 : 1 }}
        >
          <nav className="flex items-center gap-6 ml-4 w-[480px]">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`relative py-5 text-[14px] font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end transition-all duration-500">

        {/* Search Bar - Grows dynamically
        {!hideSearch && (
          <div 
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-100/60 hover:bg-gray-100 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: isNavCollapsed ? '100%' : '260px', maxWidth: '700px' }}
          >
            <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">search</span>
            <input 
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent border-none outline-none text-[13px] w-full text-gray-900 placeholder:text-gray-500 min-w-0"
            />
            <kbd className="hidden xl:flex items-center justify-center text-[11px] font-medium text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 bg-white shrink-0">
              ⌘K
            </kbd>
          </div>
        )} */}

       

        {/* Credit Balance */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 font-semibold text-[13px] mr-2">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          {user?.creditsBalance || 0} Credits
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile Avatar */}
        <Link to="/profile" className="ml-2 block rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
          <img 
            src={user?.avatarUrl || "https://i.pravatar.cc/100?u=admin"} 
            alt="Avatar" 
            className="size-9 rounded-full object-cover border border-gray-200" 
          />
        </Link>
        
      </div>
    </header>
  );
};
