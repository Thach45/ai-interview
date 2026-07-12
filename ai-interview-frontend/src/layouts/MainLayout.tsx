import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../shared/utils/cn';
import { Header } from '../components/layout/Header';
import { BackgroundJobWidget } from '../shared/components/BackgroundJobWidget';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Trang chủ', href: '/', icon: 'dashboard' },
  { id: 'jobs', label: 'Việc làm', href: '/jobs', icon: 'work' },
  { id: 'cvs', label: 'Quản lý CV', href: '/my-cvs', icon: 'description' },
  { id: 'interview', label: 'Phỏng vấn AI', href: '/interviews/setup', icon: 'chat' },
  { id: 'history', label: 'Lịch sử', href: '/history', icon: 'history' },
  { id: 'subscription', label: 'Gói dịch vụ', href: '/subscription', icon: 'payments' },
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

      {/* BOTTOM HEADER / BREADCRUMB */}
      <div className="backdrop-blur-md px-6 lg:px-10 py-2.5 flex items-center gap-2 text-sm text-gray-500 sticky top-[64px] z-40">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">home</span>
        </Link>
        {location.pathname !== '/' && (
          <>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-gray-900 font-medium">
              {NAV_ITEMS.find(item => item.id !== 'dashboard' && location.pathname.startsWith(item.href.split('/')[1] ? '/' + item.href.split('/')[1] : item.href))?.label || 'Chi tiết'}
            </span>
          </>
        )}
      </div>

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

      {/* Floating Background Job Widget */}
      <BackgroundJobWidget />
    </div>
  );
};
