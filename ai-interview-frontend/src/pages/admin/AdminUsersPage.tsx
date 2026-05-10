import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserModal } from '../../features/components/UserModal';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'CANDIDATE' | 'MODERATOR';
  creditsBalance: number;
  createdAt: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'BLOCKED';
}

const MOCK_USERS: User[] = [
  { id: '1', fullName: 'Thạch Admin', email: 'admin@gmail.com', role: 'ADMIN', creditsBalance: 999, createdAt: '2024-01-01', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', status: 'ACTIVE' },
  { id: '2', fullName: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'CANDIDATE', creditsBalance: 3, createdAt: '2024-05-10', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vana', status: 'ACTIVE' },
  { id: '3', fullName: 'Phạm Thị Moderator', email: 'mod@gmail.com', role: 'MODERATOR', creditsBalance: 50, createdAt: '2024-05-09', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mod', status: 'ACTIVE' },
  { id: '4', fullName: 'Trần Thị B', email: 'thib@gmail.com', role: 'CANDIDATE', creditsBalance: 10, createdAt: '2024-05-08', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thib', status: 'BLOCKED' },
  { id: '5', fullName: 'Lê Văn C', email: 'vanc@gmail.com', role: 'CANDIDATE', creditsBalance: 0, createdAt: '2024-05-07', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vanc', status: 'ACTIVE' },
];

export const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  return (
    <AdminLayout title="Quản lý Người dùng">
      <div className="flex flex-col gap-6">
        {/* Quick Summary Bar for User Focus */}
       
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-[400px] group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[14px]"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <select 
               value={roleFilter}
               onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
               }}
               className="px-4 py-2 bg-bg-surface border border-border-hairline rounded-lg outline-none focus:bg-white focus:border-primary/30 transition-all text-[13px] font-semibold text-text-secondary"
             >
                <option value="ALL">Tất cả vai trò</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="CANDIDATE">CANDIDATE</option>
             </select>
             <button 
              onClick={handleAddUser}
              className="flex-1 md:flex-none bg-primary text-white px-6 py-2 rounded-lg font-semibold text-[13px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
             >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Thêm người dùng
             </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-bg-canvas rounded-xl border border-border-hairline shadow-sm overflow-hidden">
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
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.fullName} className="size-9 rounded-full border border-border-hairline bg-bg-surface" />
                      <div>
                        <div className="font-semibold text-text-primary text-[14px]">{user.fullName}</div>
                        <div className="text-text-secondary text-[12px]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                      user.role === 'ADMIN' ? 'text-purple-600 bg-purple-50 border-purple-100' : 
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
                  <td className="px-6 py-4 text-[13px] text-text-secondary">{user.createdAt}</td>
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
                        className="p-2 hover:bg-red-50 text-text-tertiary hover:text-red-600 rounded-md transition-all" 
                        title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {user.status === 'ACTIVE' ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-text-tertiary">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-20">search_off</span>
              <p className="text-[14px]">Không tìm thấy người dùng nào phù hợp</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-bg-surface-soft/50 border-t border-border-hairline flex items-center justify-between">
              <div className="text-[13px] text-text-secondary">
                Hiển thị <span className="font-bold text-text-primary">{(currentPage-1)*pageSize + 1}-{Math.min(currentPage*pageSize, filteredUsers.length)}</span> trên <span className="font-bold text-text-primary">{filteredUsers.length}</span> người dùng
              </div>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`size-8 rounded-lg text-[13px] font-bold transition-all ${
                        currentPage === i + 1 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'bg-white border border-border-hairline text-text-secondary hover:bg-bg-surface'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all"
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
