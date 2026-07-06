import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../../features/user/api/user.api';
import { useDebounce } from 'use-debounce';

interface NotificationSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: any) => Promise<void>;
  isSending: boolean;
}

export const NotificationSendModal: React.FC<NotificationSendModalProps> = ({
  isOpen,
  onClose,
  onSend,
  isSending,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    mode: 'personal',
    userId: '',
    type: 'SYSTEM_UPDATE',
    title: '',
    message: '',
    link: '',
  });
  const [selectedUserName, setSelectedUserName] = useState('');

  // Lấy danh sách user theo tên/email
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin_users_search', debouncedSearch],
    queryFn: () => userApi.getUsers({ search: debouncedSearch, limit: 5 }),
    enabled: debouncedSearch.length > 0 && isOpen,
  });

  if (!isOpen) return null;

  const handleSelectUser = (user: any) => {
    setFormData({ ...formData, userId: user.id });
    setSearchTerm(user.email);
    setSelectedUserName(`${user.fullName} (${user.email})`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mode === 'personal' && !formData.userId) return;
    
    await onSend(formData);
    // Reset sau khi gửi thành công
    setFormData({
      mode: 'personal',
      userId: '',
      type: 'SYSTEM_UPDATE',
      title: '',
      message: '',
      link: '',
    });
    setSearchTerm('');
    setSelectedUserName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Phát thông báo</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình thức gửi *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="mode" 
                  value="personal" 
                  checked={formData.mode === 'personal'} 
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Gửi cá nhân</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="mode" 
                  value="all" 
                  checked={formData.mode === 'all'} 
                  onChange={(e) => {
                    setFormData({ ...formData, mode: e.target.value, userId: '' });
                    setSearchTerm('');
                    setSelectedUserName('');
                  }}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Gửi tất cả (Broadcast)</span>
              </label>
            </div>
          </div>

          {/* User Combobox */}
          {formData.mode === 'personal' && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người nhận *
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                if (formData.userId) {
                  setFormData({ ...formData, userId: '' });
                  setSelectedUserName('');
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Nhập email hoặc tên để tìm..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              required={!formData.userId}
            />
            {selectedUserName && (
              <p className="mt-1 text-xs text-green-600 font-medium">Đã chọn: {selectedUserName}</p>
            )}

            {/* Dropdown search results */}
            {showDropdown && debouncedSearch && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm border border-gray-100">
                {isLoadingUsers ? (
                  <div className="px-4 py-2 text-gray-500 text-sm">Đang tìm kiếm...</div>
                ) : usersData?.users && usersData.users.length > 0 ? (
                  usersData.users.map((u) => (
                    <div
                      key={u.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                      onClick={() => handleSelectUser(u)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{u.fullName}</span>
                        <span className="text-gray-500 text-xs">{u.email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">Không tìm thấy người dùng phù hợp</div>
                )}
              </div>
            )}
          </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại thông báo *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border bg-white"
            >
              <option value="SYSTEM_UPDATE">Cập nhật hệ thống</option>
              <option value="AI_PROCESS">Tiến trình AI</option>
              <option value="BILLING">Giao dịch / Thanh toán</option>
              <option value="REMINDER">Nhắc nhở</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Chúc mừng bạn..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung *
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Nội dung chi tiết..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border resize-none"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn đính kèm (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="VD: /profile"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSending || (formData.mode === 'personal' && !formData.userId)}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-black bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSending && (
                <span className="material-symbols-outlined animate-spin mr-2 text-[18px]">
                  progress_activity
                </span>
              )}
              Gửi ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
