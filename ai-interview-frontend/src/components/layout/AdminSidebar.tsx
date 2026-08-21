'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '../../store/authStore';
import { cn } from '../../shared/utils/cn';

type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const NAVIGATION_GROUPS: NavigationGroup[] = [
  { label: 'Tổng quan', items: [{ id: 'dashboard', label: 'Dashboard điều hành', icon: 'dashboard', path: '/admin/dashboard' }] },
  { label: 'Sản phẩm & nội dung', items: [
    { id: 'users', label: 'Người dùng', icon: 'group', path: '/admin/users' },
    { id: 'categories', label: 'Ngành nghề', icon: 'category', path: '/admin/categories' },
    { id: 'jobs', label: 'Mẫu JD', icon: 'description', path: '/admin/jobs' },
    { id: 'cv-templates', label: 'Mẫu CV', icon: 'web', path: '/admin/cv-templates' },
  ] },
  { label: 'Thương mại', items: [
    { id: 'packages', label: 'Gói dịch vụ', icon: 'inventory_2', path: '/admin/packages' },
    { id: 'transactions', label: 'Giao dịch & Credit', icon: 'toll', path: '/admin/transactions' },
  ] },
  { label: 'Phân tích sản phẩm', items: [
    { id: 'behavior', label: 'Hành vi người dùng', icon: 'insights', path: '/admin/analytics/behavior' },
    { id: 'funnel', label: 'Phễu sử dụng', icon: 'filter_alt', path: '/admin/analytics/funnel' },
    { id: 'ai-quality', label: 'Chất lượng AI', icon: 'psychology', path: '/admin/analytics/ai-quality' },
  ] },
  { label: 'Vận hành hệ thống', items: [
    { id: 'system-status', label: 'Tình trạng hệ thống', icon: 'monitor_heart', path: '/admin/system/status' },
    { id: 'queues', label: 'Tác vụ nền / Queue', icon: 'pending_actions', path: '/admin/system/queues' },
    { id: 'api-errors', label: 'API & lỗi', icon: 'error_outline', path: '/admin/system/api-errors' },
    { id: 'ai-cost', label: 'Chi phí AI', icon: 'token', path: '/admin/system/ai-cost' },
  ] },
  { label: 'Tương tác', items: [{ id: 'notifications', label: 'Thông báo', icon: 'campaign', path: '/admin/notifications' }] },
  { label: 'Cài đặt', items: [
    { id: 'administrators', label: 'Quản trị viên & phân quyền', icon: 'admin_panel_settings', path: '/admin/settings/administrators' },
    { id: 'configuration', label: 'Cấu hình hệ thống', icon: 'settings', path: '/admin/settings/configuration' },
  ] },
];

const isCurrentPath = (pathname: string, path: string) => pathname === path || pathname.startsWith(`${path}/`);

export const AdminSidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="w-72 h-full shrink-0 flex flex-col bg-bg-canvas border-r border-border-hairline select-none">
      <div className="px-8 py-7 border-b border-border-hairline">
        <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="size-9 bg-text-primary rounded-md flex items-center justify-center" aria-hidden="true">
            <span className="material-symbols-outlined text-on-primary text-xl">terminal</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">Arion</p>
            <p className="text-base font-bold tracking-tight text-text-primary">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav aria-label="Điều hướng quản trị" className="flex-1 overflow-y-auto px-3 py-5 custom-scrollbar">
        {NAVIGATION_GROUPS.map((group) => (
          <section key={group.label} aria-label={group.label} className="mb-6 last:mb-0">
            <h2 className="px-3 mb-2 text-xs font-bold tracking-wide text-text-tertiary uppercase">{group.label}</h2>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = isCurrentPath(pathname, item.path);
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isActive ? 'bg-primary/10 font-semibold text-primary' : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary',
                    )}
                  >
                    <span aria-hidden="true" className={cn('material-symbols-outlined text-xl', isActive ? 'text-primary' : 'text-text-tertiary')}>{item.icon}</span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {isActive ? <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" /> : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-border-hairline p-3">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span aria-hidden="true" className="material-symbols-outlined text-xl text-text-tertiary">open_in_new</span>
          Trang người dùng
        </Link>
      </div>

      <div className="border-t border-border-hairline p-4">
        <Link href="/admin/settings/administrators" className="flex min-h-11 items-center gap-3 rounded-md p-2 transition-colors hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="size-9 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm overflow-hidden">
            {user?.fullName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-text-primary">{user?.fullName || 'Quản trị viên'}</p>
            <p className="truncate text-xs text-text-secondary">{user?.email || 'Quản trị hệ thống'}</p>
          </div>
          <span aria-hidden="true" className="material-symbols-outlined text-lg text-text-tertiary">settings</span>
        </Link>
      </div>
    </aside>
  );
};
