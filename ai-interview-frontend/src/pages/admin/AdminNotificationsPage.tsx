import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { NotificationSendModal } from '../../features/notifications/components/NotificationSendModal';
import { useAdminNotifications } from '../../features/notifications/hooks/useAdminNotifications';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const AdminNotificationsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { notificationsQuery, sendNotification, isSending, deleteNotification } = useAdminNotifications(currentPage, pageSize);
  const { data, isLoading } = notificationsQuery;

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn thu hồi thông báo này không?')) {
      await deleteNotification(id);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'AI_PROCESS': return 'smart_toy';
      case 'BILLING': return 'payments';
      case 'REMINDER': return 'schedule';
      case 'SYSTEM_UPDATE': return 'campaign';
      default: return 'notifications';
    }
  };

  const headerAction = (
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[18px]">campaign</span>
      Phát thông báo
    </button>
  );

  return (
    <AdminLayout title="Quản lý Thông báo" rightAction={headerAction}>
      <div className="flex flex-col gap-6">
        
        {/* Table Lịch sử */}
        <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-bg-surface-soft border-b border-border-hairline">
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Thời gian</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Người nhận</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Loại</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Nội dung</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-[13px] text-text-tertiary font-medium">Đang tải lịch sử thông báo...</span>
                      </div>
                    </td>
                  </tr>
                ) : data?.notifications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-text-secondary text-[13px]">
                      Chưa có thông báo nào được phát.
                    </td>
                  </tr>
                ) : (
                  data?.notifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] font-medium text-text-primary">
                          {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-[11px] text-text-tertiary mt-0.5">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={notification.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.user?.email}`}
                            alt={notification.user?.fullName}
                            className="size-8 rounded-full border border-border-hairline bg-bg-surface"
                          />
                          <div>
                            <div className="font-semibold text-text-primary text-[13px]">
                              {notification.user?.fullName}
                            </div>
                            <div className="text-text-secondary text-[12px]">{notification.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            {getIconForType(notification.type)}
                          </span>
                          <span className="text-[12px] text-text-secondary font-medium">
                            {notification.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[250px]">
                        <div className="text-[13px] font-medium text-text-primary truncate max-w-[200px]" title={notification.title}>
                          {notification.title}
                        </div>
                        <div className="text-[12px] text-text-secondary truncate max-w-[200px] mt-1" title={notification.message}>
                          {notification.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {notification.isRead ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                            Đã xem
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                            Chưa xem
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="size-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Thu hồi thông báo"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border-hairline flex items-center justify-between bg-bg-surface-soft">
              <span className="text-[12px] text-text-secondary font-medium">
                Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data.pagination.total)} trong tổng số {data.pagination.total} thông báo
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-border-hairline bg-white text-[12px] font-bold text-text-secondary hover:text-text-primary hover:border-border-color disabled:opacity-50 disabled:hover:border-border-hairline disabled:hover:text-text-secondary transition-all shadow-sm"
                >
                  Trang trước
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                  disabled={currentPage === data.pagination.totalPages}
                  className="px-3 py-1.5 rounded-lg border border-border-hairline bg-white text-[12px] font-bold text-text-secondary hover:text-text-primary hover:border-border-color disabled:opacity-50 disabled:hover:border-border-hairline disabled:hover:text-text-secondary transition-all shadow-sm"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <NotificationSendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={async (data) => { await sendNotification(data); }}
        isSending={isSending}
      />
    </AdminLayout>
  );
};
