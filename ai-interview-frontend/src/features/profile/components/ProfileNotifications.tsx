import React, { useState } from 'react';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, Circle, Bell, Info } from 'lucide-react';
import Link from 'next/link';

export const ProfileNotifications: React.FC = () => {
  const { data, isLoading, markAsRead, markAllAsRead } = useNotifications();
  
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const notifications = data?.notifications || [];
  
  const selectedNotification = notifications.find((n: any) => n.id === selectedNotificationId) || notifications[0];

  // Nếu notification đầu tiên được auto-select và chưa đọc, thì đánh dấu đã đọc
  React.useEffect(() => {
    if (selectedNotification && !selectedNotification.isRead) {
      markAsRead(selectedNotification.id);
    }
  }, [selectedNotification?.id, selectedNotification?.isRead]);

  const handleSelectNotification = (id: string, isRead: boolean) => {
    setSelectedNotificationId(id);
    if (!isRead) {
      markAsRead(id);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-bg-canvas rounded-lg border border-border-hairline p-10 flex flex-col items-center text-center">
        <Bell className="w-12 h-12 text-text-tertiary mb-4" />
        <h3 className="text-[16px] font-medium text-text-primary mb-1">Chưa có thông báo nào</h3>
        <p className="text-[14px] text-text-secondary">Khi có thông báo mới, chúng sẽ xuất hiện ở đây.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-canvas rounded-xl border border-border-hairline shadow-sm overflow-hidden flex h-[600px]">
      {/* Left Pane: Notification List */}
      <div className="w-1/3 border-r border-border-hairline flex flex-col bg-bg-surface-soft">
        <div className="p-4 border-b border-border-hairline flex items-center justify-between bg-bg-canvas">
          <h2 className="text-[16px] font-semibold text-text-primary">Thông báo của bạn</h2>
          <button 
            onClick={handleMarkAllRead}
            disabled={!data || data?.unreadCount === 0}
            className="text-[12px] font-medium text-primary hover:text-primary-pressed disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Đánh dấu đã đọc tất cả
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {notifications.map((notification: any) => {
            const isSelected = (selectedNotificationId === notification.id) || (!selectedNotificationId && selectedNotification?.id === notification.id);
            
            return (
              <button
                key={notification.id}
                onClick={() => handleSelectNotification(notification.id, notification.isRead)}
                className={`w-full text-left p-4 border-b border-border-hairline transition-colors hover:bg-bg-canvas ${
                  isSelected ? 'bg-bg-canvas border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {notification.isRead ? (
                      <CheckCircle2 className="w-4 h-4 text-text-tertiary" />
                    ) : (
                      <Circle className="w-4 h-4 text-primary fill-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] truncate ${notification.isRead ? 'text-text-secondary' : 'text-text-primary font-semibold'}`}>
                      {notification.title}
                    </p>
                    <p className="text-[12px] text-text-tertiary mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Notification Details */}
      <div className="w-2/3 bg-bg-canvas flex flex-col">
        {selectedNotification ? (
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 text-text-tertiary mb-6">
              <Info className="w-5 h-5" />
              <span className="text-[14px]">{formatDistanceToNow(new Date(selectedNotification.createdAt), { addSuffix: true, locale: vi })}</span>
            </div>
            
            <h1 className="text-[24px] font-bold text-text-primary mb-4 leading-tight">
              {selectedNotification.title}
            </h1>
            
            <div className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-surface-soft p-6 rounded-xl border border-border-hairline">
              {selectedNotification.message}
            </div>

            {selectedNotification.link && (
              <div className="mt-8">
                <Link
                  href={selectedNotification.link}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white text-[14px] font-medium rounded-lg hover:bg-primary-pressed transition-colors shadow-sm"
                >
                  Xem chi tiết
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-tertiary p-8 text-center">
            <p>Chọn một thông báo để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );
};
