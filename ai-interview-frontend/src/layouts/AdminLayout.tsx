import React from 'react';
import { AdminSidebar } from '../components/layout/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  rightAction?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, rightAction }) => {
  return (
    <div className="flex h-screen bg-bg-canvas text-text-primary overflow-hidden">
      {/* Sidebar cố định */}
      <AdminSidebar />

      {/* Vùng nội dung chính */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden border-l border-border-hairline">
        {/* Header của vùng Admin */}
        <header className="h-16 border-b border-border-hairline flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-[16px] font-semibold text-text-primary">{title || 'Admin Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-4">
            {rightAction && <div className="mr-2">{rightAction}</div>}
            <button className="material-symbols-outlined text-text-secondary hover:text-primary transition-colors">notifications</button>
            <div className="size-8 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-[12px] font-bold text-primary">
              AD
            </div>
          </div>
        </header>

        {/* Nội dung trang */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
