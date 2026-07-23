import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserModal } from '../../features/user/components/UserModal';
import { useUsers, useUserActions } from '../../features/user/hooks/useUsers';
import type { User } from '../../features/user/types/user';

export const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useUsers({
    page: currentPage,
    limit: pageSize,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    search: searchTerm || undefined,
  });

  const { deleteUser, updateUser } = useUserActions();

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      await deleteUser(id);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateUser({ id: user.id, data: { status: newStatus } });
  };

  const headerAction = (
    <button
      onClick={handleAddUser}
      className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[18px]">person_add</span>
      Thêm người dùng mới
    </button>
  );

  return (
    <AdminLayout title="Quản lý Người dùng" rightAction={headerAction}>
      <div className="flex flex-col gap-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[14px] shadow-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[13px] font-bold text-text-secondary shadow-sm min-w-[150px]"
            >
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="CANDIDATE">CANDIDATE</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[13px] font-bold text-text-secondary shadow-sm min-w-[150px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Đã khóa</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-bg-surface-soft border-b border-border-hairline">
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Người dùng</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Vai trò</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Số dư Credit</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Ngày tham gia</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-[13px] text-text-tertiary font-medium">Đang tải danh sách...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-red-500">
                      Đã có lỗi xảy ra khi tải danh sách người dùng.
                    </td>
                  </tr>
                ) : data?.users?.map((user) => (
                  <tr key={user.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.fullName}
                          className="size-9 rounded-full border border-border-hairline bg-bg-surface"
                        />
                        <div>
                          <div className="font-semibold text-text-primary text-[14px]">{user.fullName}</div>
                          <div className="text-text-secondary text-[12px]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${user.role === 'ADMIN' ? 'text-purple-600 bg-purple-50 border-purple-100' :
                        user.role === 'MODERATOR' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                          'text-text-secondary bg-bg-surface border-border-hairline'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`size-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-[12px] font-medium ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                          {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary text-[14px]">{user.creditsBalance}</span>
                        <span className="material-symbols-outlined text-[16px] text-primary">toll</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-md transition-all"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-md transition-all ${user.status === 'ACTIVE'
                            ? 'hover:bg-red-50 text-text-tertiary hover:text-red-600'
                            : 'hover:bg-green-50 text-text-tertiary hover:text-green-600'
                            }`}
                          title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {user.status === 'ACTIVE' ? 'block' : 'check_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 text-text-tertiary hover:text-red-600 rounded-md transition-all"
                          title="Xóa vĩnh viễn"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!isLoading && (!data || !data.users || data.users.length === 0)) && (
            <div className="py-20 flex flex-col items-center justify-center text-text-tertiary">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-20">search_off</span>
              <p className="text-[14px]">Không tìm thấy người dùng nào phù hợp</p>
            </div>
          )}

          {/* Pagination Controls */}
          {data && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-bg-surface-soft/50 border-t border-border-hairline flex items-center justify-between">
              <div className="text-[13px] text-text-secondary">
                Hiển thị <span className="font-bold text-text-primary">{(data.pagination.page - 1) * data.pagination.limit + 1}-{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}</span> trên <span className="font-bold text-text-primary">{data.pagination.total}</span> người dùng
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(data.pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`size-8 rounded-lg text-[13px] font-bold transition-all ${currentPage === i + 1
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white border border-border-hairline text-text-secondary hover:bg-bg-surface shadow-sm'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === data.pagination.totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
      />
    </AdminLayout>
  );
};
