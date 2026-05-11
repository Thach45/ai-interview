import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  creditsAdded: number;
  type: 'DEPOSIT' | 'COMPENSATION' | 'PROMOTION';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentRefId?: string;
  createdAt: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', userId: 'u1', userName: 'Hoàng Thạch', userEmail: 'thach@gmail.com', amount: 50000, creditsAdded: 50, type: 'DEPOSIT', status: 'SUCCESS', paymentRefId: 'VNP123456', createdAt: '2024-05-10 10:30' },
  { id: '2', userId: 'u2', userName: 'Nguyễn Văn A', userEmail: 'vana@gmail.com', amount: 0, creditsAdded: 10, type: 'COMPENSATION', status: 'SUCCESS', createdAt: '2024-05-10 11:00' },
  { id: '3', userId: 'u3', userName: 'Trần Thị B', userEmail: 'thib@gmail.com', amount: 100000, creditsAdded: 110, type: 'DEPOSIT', status: 'PENDING', paymentRefId: 'MOMO789', createdAt: '2024-05-10 12:15' },
  { id: '4', userId: 'u4', userName: 'Lê Văn C', userEmail: 'vanc@gmail.com', amount: 0, creditsAdded: 5, type: 'PROMOTION', status: 'SUCCESS', createdAt: '2024-05-09 15:45' },
];

export const AdminTransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const matchesSearch = t.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.paymentRefId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  // Hành động chính cho Header
  const headerActions = (
    <div className="flex items-center gap-3">
      <button className="bg-white border border-border-hairline text-text-secondary px-4 py-2 rounded-lg font-bold text-[12px] hover:bg-bg-surface transition-all flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">download</span>
        Xuất báo cáo
      </button>
      <button className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">add_card</span>
        Tạo giao dịch mới
      </button>
    </div>
  );

  return (
    <AdminLayout title="Quản lý Giao dịch & Credit" rightAction={headerActions}>
      <div className="flex flex-col gap-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white border border-border-hairline p-5 rounded-xl shadow-sm">
              <div className="text-[11px] font-bold text-text-tertiary uppercase mb-1">Tổng doanh thu</div>
              <div className="text-2xl font-bold text-text-primary">15,250,000đ</div>
           </div>
           <div className="bg-white border border-border-hairline p-5 rounded-xl shadow-sm">
              <div className="text-[11px] font-bold text-text-tertiary uppercase mb-1">Credit đã nạp</div>
              <div className="text-2xl font-bold text-primary">12,450 CR</div>
           </div>
           <div className="bg-white border border-border-hairline p-5 rounded-xl shadow-sm">
              <div className="text-[11px] font-bold text-text-tertiary uppercase mb-1">Đền bù/Khuyến mãi</div>
              <div className="text-2xl font-bold text-orange-600">850 CR</div>
           </div>
           <div className="bg-white border border-border-hairline p-5 rounded-xl shadow-sm">
              <div className="text-[11px] font-bold text-text-tertiary uppercase mb-1">Chờ xử lý</div>
              <div className="text-2xl font-bold text-amber-500">3 GD</div>
           </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Tìm theo tên, email, mã GD..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[14px] shadow-sm"
            />
          </div>
          <div className="w-full md:w-64">
             <select 
               value={typeFilter}
               onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
               }}
               className="w-full px-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[13px] font-bold text-text-secondary shadow-sm"
             >
                <option value="ALL">Tất cả loại</option>
                <option value="DEPOSIT">Nạp tiền (Deposit)</option>
                <option value="COMPENSATION">Đền bù (Compensation)</option>
                <option value="PROMOTION">Khuyến mãi (Promotion)</option>
             </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-bg-surface-soft border-b border-border-hairline">
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Loại</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Số lượng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Số tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">Thời gian</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {paginatedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-text-primary text-[14px]">{t.userName}</div>
                      <div className="text-text-secondary text-[12px]">{t.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                      t.type === 'DEPOSIT' ? 'text-blue-600 bg-blue-50 border-blue-100' : 
                      t.type === 'COMPENSATION' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                      'text-green-600 bg-green-50 border-green-100'
                    }`}>
                      {t.type === 'DEPOSIT' ? 'Nạp tiền' : t.type === 'COMPENSATION' ? 'Đền bù' : 'Khuyến mãi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-primary text-[14px]">
                    +{t.creditsAdded} CR
                  </td>
                  <td className="px-6 py-4 text-[14px] text-text-secondary">
                    {t.amount > 0 ? `${t.amount.toLocaleString()}đ` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`size-2 rounded-full ${
                        t.status === 'SUCCESS' ? 'bg-green-500' : 
                        t.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-[12px] font-medium ${
                        t.status === 'SUCCESS' ? 'text-green-600' : 
                        t.status === 'PENDING' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {t.status === 'SUCCESS' ? 'Thành công' : t.status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-text-secondary">
                    {t.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-md transition-all">
                      <span className="material-symbols-outlined text-[20px]">info</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-text-tertiary">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-20">search_off</span>
              <p className="text-[14px]">Không tìm thấy giao dịch nào phù hợp</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-bg-surface-soft/50 border-t border-border-hairline flex items-center justify-between">
              <div className="text-[13px] text-text-secondary">
                Hiển thị <span className="font-bold text-text-primary">{(currentPage-1)*pageSize + 1}-{Math.min(currentPage*pageSize, filteredTransactions.length)}</span> trên <span className="font-bold text-text-primary">{filteredTransactions.length}</span> giao dịch
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
    </AdminLayout>
  );
};
