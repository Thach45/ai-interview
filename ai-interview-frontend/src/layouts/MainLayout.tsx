import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: string; // Tùy chọn chiều rộng tối đa (mặc định 1280px)
  fullHeight?: boolean; // Nếu true, nội dung sẽ fix cứng chiều cao màn hình (dùng cho Master-Detail)
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'Dashboard', 
  maxWidth = '1280px',
  fullHeight = false,
  className = ''
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Sidebar with state */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        
        {/* Global Header */}
        <Header 
          title={title} 
          isSidebarCollapsed={isSidebarCollapsed} 
          onToggleSidebar={toggleSidebar} 
        />

        {/* Page Content */}
        <main className={`flex-1 min-w-0 ${fullHeight ? 'h-[calc(100vh-64px)] overflow-hidden' : 'overflow-y-auto'}`}>
          <div 
            className={`mx-auto ${fullHeight ? 'h-full' : 'p-6 lg:p-10'} ${className}`}
            style={{ maxWidth: maxWidth === 'full' ? 'none' : maxWidth }}
          >
            {children}
          </div>
        </main>
      </div>
      
      {/* Floating Action Button */}
      {!fullHeight && (
        <button className="fixed bottom-6 right-6 bg-[#635bff] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm hover:brightness-110 transition-all z-50">
          <span className="material-symbols-outlined text-[20px]">chat</span>
          Gửi phản hồi
        </button>
      )}
    </div>
  );
};
