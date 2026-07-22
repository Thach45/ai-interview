import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '../../features/profile/hooks/useProfile';
import { NotificationDropdown } from '../../features/notifications/components/NotificationDropdown';
import { useAuthStore } from '../../store/authStore';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

interface HeaderProps {
  hideSearch?: boolean;
}

type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: { id: string; label: string; href: string }[];
};

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { id: 'features', label: 'Giải pháp', href: '/#features' },
  { id: 'how-it-works', label: 'Luồng hoạt động', href: '/#how-it-works' },
  { id: 'subscription', label: 'Gói dịch vụ', href: '/subscription' },
];

const PRIVATE_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Trang chủ', href: '/dashboard' },
  { id: 'jobs', label: 'Việc làm', href: '/jobs' },
  { 
    id: 'ai-cv', 
    label: 'AI CV', 
    href: '#',
    children: [
      { id: 'cvs', label: 'Quản lý CV', href: '/my-cvs' },
      { id: 'cv-builder', label: 'Tạo CV', href: '/cv-builder/templates' },
      { id: 'analyze-external', label: 'Phân tích JD', href: '/cv-analysis' },
    ]
  },
  { id: 'interview', label: 'Phỏng vấn AI', href: '/interviews/setup' },
  { id: 'subscription', label: 'Gói dịch vụ', href: '/subscription' },
];

export const Header: React.FC<HeaderProps> = ({ hideSearch = false }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { user } = useProfile();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const navItems = isAuthenticated ? PRIVATE_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  return (
    <header className="h-16 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shrink-0 gap-6">
      
      {/* Left: Brand & Navigation */}
      <div className="flex items-center shrink-0">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group mr-6">
          <div className="size-8 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo/logo_ai_interview.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[17px] font-bold text-gray-900 hidden md:block tracking-tight whitespace-nowrap">
            AI Interview
          </span>
        </Link>
        
        {/* Navigation Container */}
        <div 
          className="hidden lg:flex items-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: isNavCollapsed ? '0px' : '650px', opacity: isNavCollapsed ? 0 : 1, overflow: isNavCollapsed ? 'hidden' : 'visible' }}
        >
          <nav className="flex items-center gap-6 ml-4 w-[650px]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              
              if (item.children) {
                const isChildActive = item.children.some(child => location.pathname === child.href || (child.href !== '/' && location.pathname.startsWith(child.href)));
                return (
                  <div key={item.id} className="relative group py-5 z-50">
                    <button className={`flex items-center gap-1 text-[14px] font-medium transition-colors whitespace-nowrap outline-none ${isChildActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 group-hover:-rotate-180 ${isChildActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'}`} />
                    </button>
                    {isChildActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full" />
                    )}
                    <div className="absolute top-[90%] left-0 mt-0 w-48 bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        {item.children.map(child => {
                          const childActive = location.pathname === child.href || (child.href !== '/' && location.pathname.startsWith(child.href));
                          return (
                            <Link
                              key={child.id}
                              to={child.href}
                              className={`block px-4 py-2.5 text-[13px] font-medium transition-colors ${childActive ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return item.href.startsWith('/#') ? (
                <a
                  key={item.id}
                  href={item.href.replace('/', '')}
                  className={`relative py-5 text-[14px] font-medium transition-colors whitespace-nowrap text-gray-500 hover:text-gray-900`}
                >
                  {item.label}
                </a>
              ) : (
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

      {/* Right: Actions based on auth state */}
      <div className="flex items-center gap-4 flex-1 justify-end transition-all duration-500">
        {isAuthenticated ? (
          <>
            {/* Credits */}
            <Link 
              to="/subscription"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all mr-2 group"
              title="Quản lý lượt phỏng vấn"
            >
              <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-gray-600 transition-colors">wallet</span>
              <span className="text-[13px] font-medium text-gray-600">
                <span className="text-gray-900 font-semibold">{user?.creditsBalance || 0}</span> lượt
              </span>
            </Link>

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
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-5 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Đăng nhập</Link>
            <Link to="/register" className="group flex items-center gap-2 bg-primary hover:bg-primary-pressed text-white px-5 py-2.5 rounded-full font-medium text-[13px] transition-all duration-500 active:scale-[0.98] shadow-lg shadow-primary/20">
              Đăng ký miễn phí
              <div className="size-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">
                <ArrowUpRight size={12} strokeWidth={2} />
              </div>
            </Link>
          </div>
        )}
      </div>
      </header>
  );
};
