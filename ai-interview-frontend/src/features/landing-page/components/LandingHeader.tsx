import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'features', label: 'Tính năng', href: '#features' },
  { id: 'how-it-works', label: 'Cách hoạt động', href: '#how-it-works' },
  { id: 'pricing', label: 'Bảng giá', href: '#pricing' },
];

export const LandingHeader: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header
        className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between px-2 py-2 rounded-full border border-gray-200/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl w-full max-w-3xl'
            : 'bg-white/50 backdrop-blur-md w-full max-w-4xl'
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink-0 pl-3 pr-2">
          <div className="size-8 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <img src="/logo/logo_ai_interview.png" alt="AI Interview Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
          <span className="text-[16px] font-bold text-gray-900 tracking-tight whitespace-nowrap hidden sm:block">
            AI Interview
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 px-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="group flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-semibold text-[13px] transition-all duration-300"
            >
              Vào Dashboard
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-all duration-300 shadow-md shadow-primary/20"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 p-2 pr-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[110%] left-4 right-4 bg-white border border-gray-100 shadow-xl rounded-2xl py-4 px-4 flex flex-col gap-4 pointer-events-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[15px] font-medium text-gray-700 hover:text-primary py-2"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-gray-100 mt-2">
            {isAuthenticated ? (
               <Link
                 href="/dashboard"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium"
               >
                 Vào Dashboard
               </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 text-[15px] font-semibold text-gray-700 bg-gray-50 rounded-full"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-primary text-white px-6 py-3 rounded-full font-medium text-[15px]"
                >
                  Đăng ký miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
