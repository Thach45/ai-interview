import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-white">
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
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 bg-[#635bff] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm hover:brightness-110 transition-all z-50">
        <span className="material-symbols-outlined text-[20px]">chat</span>
        Gửi phản hồi
      </button>
    </div>
  );
};
