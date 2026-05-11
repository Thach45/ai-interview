import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { cn } from '../shared/utils/cn';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Trang chủ', href: '/', icon: 'dashboard' },
  { id: 'jobs', label: 'Việc làm', href: '/jobs', icon: 'work' },
  { id: 'history', label: 'Lịch sử', href: '/history', icon: 'history' },
  { id: 'profile', label: 'Cá nhân', href: '/profile', icon: 'person' },
];

export const MainLayout: React.FC<{ children: React.ReactNode; fullHeight?: boolean; className?: string; maxWidth?: string; hideSearch?: boolean }> = ({ 
  children, 
  fullHeight = false, 
  className = '',
  maxWidth = '1280px',
  hideSearch = false
}) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [isHovered, setIsHovered] = useState(false);

  const currentPath = location.pathname.replace('/', '') || 'Dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb] overflow-hidden font-sans">
      
      {/* GLOBAL FULL SCREEN OVERLAY (Scrim) */}
      <div className={cn(
        "fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[90] transition-all duration-700 pointer-events-none",
        isHovered ? "opacity-100" : "opacity-0"
      )} />

      {/* STARK MINIMALIST HEADER */}
      <header className="h-16 flex items-center justify-between px-11 bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shrink-0">
        {/* Left Section: Brand & Breadcrumbs */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 flex items-center justify-center transition-all group-hover:scale-110 drop-shadow-sm">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-[16px] font-black text-gray-900 hidden xs:block uppercase tracking-tighter">AI Interview</span>
          </Link>
          
          <div className="h-4 w-px bg-gray-200 hidden md:block" />
          
          <nav className="hidden md:flex items-center gap-2 text-[12px] font-medium text-gray-400">
            <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
            <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
            <span className="text-gray-900 font-semibold">{currentPath}</span>
          </nav>
        </div>

        {/* Middle Section: Functional Search Bar */}
        {!hideSearch && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-100/50 border border-transparent rounded-xl w-[340px] group/search focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all">
            <label htmlFor="global-search" className="cursor-text">
              <span className="material-symbols-outlined text-[18px] text-gray-400 group-focus-within/search:text-primary transition-colors">search</span>
            </label>
            <input 
              id="global-search"
              type="text"
              placeholder="Tìm kiếm nhanh..."
              className="bg-transparent border-none outline-none text-[12px] font-medium flex-1 text-gray-900 placeholder:text-gray-400 w-full"
            />
            <kbd className="text-[14px] font-bold text-gray-400">⌘K</kbd>
          </div>
        )}

        {/* Right Section: Icon-based Credit & Profile */}
        <div className="flex items-center gap-6">
          {/* Minimalist Credit Display with Icon */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-gray-400">database</span>
            <span className="text-[13px] font-bold text-gray-900 leading-none">1,250</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-gray-400 hover:text-gray-900 transition-colors text-[20px]">notifications</button>
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="size-9 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden p-0.5 transition-all group-hover:border-primary/30">
                <div className="size-full rounded-full overflow-hidden">
                  <img src={user?.avatarUrl || "https://i.pravatar.cc/100?u=admin"} alt="Avatar" className="size-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 relative min-w-0",
        fullHeight ? "h-[calc(100vh-64px)] overflow-hidden" : "overflow-y-auto pb-32"
      )}>
        <div 
          className={cn(
            "mx-auto h-full transition-all duration-500",
            !fullHeight && "p-6 lg:p-10",
            className
          )}
          style={{ maxWidth: maxWidth === 'full' ? 'none' : maxWidth }}
        >
          {children}
        </div>
      </main>

      {/* THE MAGIC ORB DOCK CONTAINER */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex justify-center cursor-default"
      >
        <nav className={cn(
          "flex items-center gap-2 p-1.5 rounded-full bg-white/95 backdrop-blur-2xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isHovered ? "w-auto px-3" : "w-12 h-12 overflow-hidden"
        )}>
          
          {/* Neutral Orb Trigger Icon */}
          <div className="size-9 shrink-0 flex items-center justify-center text-gray-900">
            <span className={cn(
              "material-symbols-outlined text-[24px] transition-all duration-300",
              isHovered ? "opacity-30 scale-75 rotate-90" : "opacity-70 scale-100"
            )}>
              grid_view
            </span>
          </div>

          {/* Action Buttons */}
          <div className={cn(
            "flex items-center gap-1.5 transition-all duration-300 delay-100",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          )}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="text-[12px] font-bold tracking-tight uppercase">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-20 pointer-events-none" />
    </div>
  );
};
