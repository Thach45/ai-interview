import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'how-it-works', label: 'Cách hoạt động', href: '#how-it-works' },
  { id: 'stats', label: 'Kết quả', href: '#stats' },
  { id: 'features', label: 'Tính năng', href: '#features' },
  { id: 'use-cases', label: 'Dành cho bạn', href: '#use-cases' },
  { id: 'testimonials', label: 'Đánh giá', href: '#testimonials' },
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
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/95 px-4 backdrop-blur pointer-events-none">
      <header
        className={`pointer-events-auto mx-auto flex max-w-6xl items-center justify-between py-3 transition-all duration-200 ${
          scrolled
            ? 'max-w-5xl'
            : 'w-full'
        }`}
      >
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center">
          <img src="/logo/logo.png" alt="Arion" className="h-[58px] w-auto transition-transform duration-500 group-hover:scale-[1.03]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="group inline-flex min-h-10 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Vào Dashboard
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center px-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="group inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMobileMenuOpen}
          className="p-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white px-4 py-4 shadow-sm pointer-events-auto lg:hidden">
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
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-white"
               >
                 Vào Dashboard
               </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-11 w-full rounded-md border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-h-11 w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white"
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
