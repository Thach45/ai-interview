import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, isRead: boolean, link?: string) => {
    if (!isRead) {
      markAsRead(id);
    }
    if (link) {
      // Dùng window.location hoặc react-router useNavigate tùy cấu hình
      window.location.href = link;
    }
    setIsOpen(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'AI_PROCESS':
        return <span className="material-symbols-outlined text-blue-500">smart_toy</span>;
      case 'BILLING':
        return <span className="material-symbols-outlined text-green-500">payments</span>;
      case 'REMINDER':
        return <span className="material-symbols-outlined text-yellow-500">schedule</span>;
      case 'SYSTEM_UPDATE':
        return <span className="material-symbols-outlined text-purple-500">campaign</span>;
      default:
        return <span className="material-symbols-outlined text-gray-500">notifications</span>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="size-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors relative"
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-[9999] overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllAsRead()}
                className="text-xs text-primary-600 hover:text-primary-800 transition-colors"
              >
                Đánh dấu đọc tất cả
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Chưa có thông báo nào
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead, notification.link)}
                    className={`flex cursor-pointer items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-primary-50/50' : ''
                    }`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1.5 text-[11px] text-gray-400">
                        {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi }) : 'Vừa xong'}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary-500" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="border-t border-gray-100 p-2">
            <button className="w-full rounded-lg px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
