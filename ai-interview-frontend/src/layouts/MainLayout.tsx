import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../shared/utils/cn';
import { Header } from '../components/layout/Header';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Trang chủ', href: '/', icon: 'dashboard' },
  { id: 'jobs', label: 'Việc làm', href: '/jobs', icon: 'work' },
  { id: 'cvs', label: 'Quản lý CV', href: '/my-cvs', icon: 'description' },
  { id: 'interview', label: 'Phỏng vấn AI', href: '/interviews/setup', icon: 'chat' },
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb] overflow-hidden font-sans">
      
      {/* GLOBAL FULL SCREEN OVERLAY (Scrim) */}
      <div className={cn(
        "fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[90] transition-all duration-700 pointer-events-none",
        isHovered ? "opacity-100" : "opacity-0"
      )} />

      {/* REUSABLE HEADER COMPONENT */}
      <Header hideSearch={hideSearch} />

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
