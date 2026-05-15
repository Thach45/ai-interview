import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';


interface HeaderProps {
  hideSearch?: boolean;
}

const pathMap: { [key: string]: string } = {
  'jobs': 'Việc làm',
  'dashboard': 'Tổng quan',
  'users': 'Người dùng',
  'settings': 'Cài đặt',
  'templates': 'Mẫu câu hỏi',
  'cv-analysis': 'Phân tích CV',
  'interview-setup': 'Thiết lập phỏng vấn',
  'interview-room': 'Phòng phỏng vấn',
};

export const Header: React.FC<HeaderProps> = ({ hideSearch = false }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
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
        
        <nav className="flex items-center gap-2 text-[12px] font-medium text-text-tertiary">
          <Link to="/" className="hover:text-primary transition-colors flex items-center">
            <span className="material-symbols-outlined text-[18px]">home</span>
          </Link>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = pathMap[name.toLowerCase()] || name;

            return (
              <React.Fragment key={routeTo}>
                <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
                {isLast ? (
                  <span className="text-text-primary font-bold">
                    {displayName}
                  </span>
                ) : (
                  <Link 
                    to={routeTo} 
                    className="hover:text-primary transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
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
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-gray-400">database</span>
          <span className="text-[13px] font-bold text-gray-900 leading-none">1,250</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-gray-400 hover:text-gray-900 transition-colors text-[20px]">notifications</button>
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="flex flex-col font-semibold items-end -space-y-1 hidden md:flex">
              <span className="text-[12px] text-gray-900 group-hover:text-primary transition-colors leading-none">
                {user?.fullName || 'Guest User'}
              </span>
              
            </div>
            <div className="size-9 rounded-full bg-white shadow-sm overflow-hidden p-0.5 transition-all border-primary/30">
              <div className="size-full rounded-full overflow-hidden">
                <img src={user.avatarUrl || "https://i.pravatar.cc/100?u=admin"} alt="Avatar" className="size-full object-cover hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
