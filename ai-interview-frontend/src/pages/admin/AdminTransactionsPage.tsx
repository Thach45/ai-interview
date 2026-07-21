import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import subscriptionApi from '../../features/subscription/api/subscription.api';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { TransactionStats } from '../../features/subscription/components/admin/TransactionStats';
import { TransactionFilters } from '../../features/subscription/components/admin/TransactionFilters';
import { TransactionTable } from '../../features/subscription/components/admin/TransactionTable';

interface Transaction {
  id: string;
  userId?: string;
  user?: { fullName: string; email: string };
  amount: number;
  creditsAdded: number;
  type: string;
  status: string;
  paymentRefId?: string;
  sepayTransactionId?: string;
  createdAt: string;
}

export const AdminTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ totalRevenue: 0, creditsDeposited: 0, creditsCompensated: 0, pendingTransactions: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [creditsAdded, setCreditsAdded] = useState(10);
  const [manualType, setManualType] = useState<'COMPENSATION' | 'PROMOTION'>('COMPENSATION');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transRes, statsRes] = await Promise.all([
        subscriptionApi.adminGetTransactions({ type: typeFilter, search: searchTerm, page: currentPage, limit: pageSize }),
        subscriptionApi.adminGetTransactionStats(),
      ]);
      if (transRes.success && transRes.data) {
        setTransactions(transRes.data.transactions);
        setTotalPages(transRes.data.pagination.totalPages);
        setTotalCount(transRes.data.pagination.total);
      }
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
    } catch {
      toast.error('Không thể kết nối API giao dịch');
    } finally { setIsLoading(false); }
  }, [searchTerm, typeFilter, currentPage]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;
    setIsSubmitting(true);
    try {
      const res = await subscriptionApi.adminCreateManualTransaction({ userEmail, creditsAdded, type: manualType, reason: reason || undefined });
      if (res.success) { toast.success('Cấp nạp Credit cho học viên thành công! 🎉'); setIsModalOpen(false); resetForm(); fetchData(); }
    } catch (error: any) { toast.error(error.message || 'Lỗi hệ thống khi nạp credit'); }
    finally { setIsSubmitting(false); }
  };

  const resetForm = () => { setUserEmail(''); setCreditsAdded(10); setReason(''); };

  const handleUpdateStatus = async (id: string, status: 'SUCCESS' | 'FAILED') => {
    setIsUpdatingStatus(true);
    try {
      const res = await subscriptionApi.adminUpdateTransactionStatus(id, status);
      if (res.success) { toast.success(status === 'SUCCESS' ? 'Đã duyệt nạp thành công!' : 'Đã hủy giao dịch!'); setSelectedTransaction(null); fetchData(); }
    } catch (error: any) { toast.error(error.message || 'Lỗi hệ thống'); }
    finally { setIsUpdatingStatus(false); }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Xóa vĩnh viễn giao dịch này? Không thể hoàn tác!')) return;
    setIsDeleting(true);
    try {
      const res = await subscriptionApi.adminDeleteTransaction(id);
      if (res.success) { toast.success('Đã xóa giao dịch! 🎉'); setSelectedTransaction(null); fetchData(); }
    } catch (error: any) { toast.error(error.message || 'Lỗi hệ thống'); }
    finally { setIsDeleting(false); }
  };

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); }
    catch { return dateStr; }
  };

  return (
    <AdminLayout
      title="Quản lý Giao dịch & Credit"
      rightAction={
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-[12px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add_card</span>Tạo giao dịch nạp tay
        </button>
      }
    >
      <div className="flex flex-col gap-6 pb-12">
        <TransactionStats
          totalRevenue={stats.totalRevenue}
          creditsDeposited={stats.creditsDeposited}
          creditsCompensated={stats.creditsCompensated}
          pendingTransactions={stats.pendingTransactions}
        />
        <TransactionFilters
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
          onTypeChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
        />
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          totalPages={totalPages}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onSelectTransaction={(tx) => setSelectedTransaction(tx)}
        />
      </div>

      {/* Modal nạp Credit thủ công cực sang xịn */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[calc(100vh-2rem)]"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-[15px] font-black text-text-primary">Nạp Credit Thủ Công</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-text-tertiary">close</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleManualSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                {/* Email học viên */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email học viên <span className="text-red-500">*</span></label>
                  <input 
                    type="email"
                    required
                    placeholder="học viên@gmail.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[13px]"
                  />
                </div>

                {/* Số lượng Credit */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Số lượng Credit <span className="text-red-500">*</span></label>
                  <input 
                    type="number"
                    required
                    min="-1"
                    placeholder="Nhập số credit cấp (ví dụ: 10, -1 là vô hạn)"
                    value={creditsAdded}
                    onChange={(e) => setCreditsAdded(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[13px]"
                  />
                  <p className="text-[10px] text-text-tertiary">Nhập <span className="font-bold text-primary">-1</span> để cung cấp gói Credit vô hạn.</p>
                </div>

                {/* Phân loại nạp */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Hình thức cấp nạp <span className="text-red-500">*</span></label>
                  <select 
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[13px] font-bold text-text-secondary"
                  >
                    <option value="COMPENSATION">Đền bù hệ thống (Compensation)</option>
                    <option value="PROMOTION">Khuyến mãi & Tặng thưởng (Promotion)</option>
                  </select>
                </div>

                {/* Lý do nạp */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Lý do & Mô tả giao dịch</label>
                  <textarea 
                    placeholder="Nhập lý do nạp để lưu vết đối soát..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-bg-surface border border-border-hairline rounded-xl outline-none focus:border-primary/30 focus:bg-white transition-all text-[13px] resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-text-secondary rounded-xl font-bold text-[12px] transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-[12px] hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Đang cấp...
                      </>
                    ) : (
                      'Nạp Credit'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Chi tiết giao dịch cực kỳ sang trọng & Hỗ trợ duyệt/hủy */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransaction(null)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[calc(100vh-2rem)]"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                  <h3 className="text-[15px] font-black text-text-primary">Chi tiết giao dịch</h3>
                </div>
                <button 
                  onClick={() => setSelectedTransaction(null)} 
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-text-tertiary">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                {/* ID & Thời gian */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Mã giao dịch</span>
                    <p className="text-[13px] font-mono font-bold text-text-primary select-all truncate" title={selectedTransaction.id}>{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Thời gian khởi tạo</span>
                    <p className="text-[13px] font-bold text-text-primary">{formatDate(selectedTransaction.createdAt)}</p>
                  </div>
                </div>

                {/* Khách hàng */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-text-tertiary uppercase tracking-widest">Thông tin học viên</h4>
                  <div className="border border-border-hairline rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-text-secondary">Họ và tên:</span>
                      <span className="font-bold text-text-primary">{selectedTransaction.user?.fullName || 'Người dùng'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-text-secondary">Email:</span>
                      <span className="font-bold text-text-primary select-all">{selectedTransaction.user?.email || 'Chưa cập nhật'}</span>
                    </div>
                  </div>
                </div>

                {/* Chi tiết nạp tiền */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-text-tertiary uppercase tracking-widest">Thông tin đơn hàng</h4>
                  <div className="border border-border-hairline rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-text-secondary">Hình thức nạp:</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase ${
                        selectedTransaction.type === 'DEPOSIT' ? 'text-blue-600 bg-blue-50 border-blue-100' : 
                        selectedTransaction.type === 'COMPENSATION' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                        'text-green-600 bg-green-50 border-green-100'
                      }`}>
                        {selectedTransaction.type === 'DEPOSIT' ? 'Nạp tiền qua QR' : selectedTransaction.type === 'COMPENSATION' ? 'Hệ thống đền bù' : 'Quà tặng khuyến mãi'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-text-secondary">Số Credit cộng:</span>
                      <span className="font-black text-text-primary">
                        {selectedTransaction.creditsAdded === -1 ? 'HẠNG VÔ HẠN (UNLIMITED)' : `+${selectedTransaction.creditsAdded} CR`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-text-secondary">Số tiền thanh toán:</span>
                      <span className="font-black text-text-primary">{selectedTransaction.amount > 0 ? `${selectedTransaction.amount.toLocaleString()}đ` : '0đ (Miễn phí)'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-text-secondary">Mã đối soát chuyển khoản:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-primary select-all">
                        {selectedTransaction.paymentRefId || '-'}
                        {selectedTransaction.paymentRefId && (
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedTransaction.paymentRefId || '');
                              toast.success('Đã sao chép mã đối soát');
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-text-tertiary hover:text-primary transition-all"
                          >
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {selectedTransaction.sepayTransactionId && (
                      <div className="flex justify-between items-center text-[13px] border-t border-dashed border-gray-100 pt-2.5">
                        <span className="text-text-secondary">Mã giao dịch ngân hàng (Sepay):</span>
                        <span className="font-mono font-bold text-text-primary select-all">{selectedTransaction.sepayTransactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trạng thái hiện tại */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[12px] font-bold text-text-secondary uppercase">Trạng thái giao dịch:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                    selectedTransaction.status === 'SUCCESS' ? 'text-green-600 bg-green-50 border-green-100' : 
                    selectedTransaction.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                    'text-red-600 bg-red-50 border-red-100'
                  }`}>
                    <div className={`size-2 rounded-full ${
                      selectedTransaction.status === 'SUCCESS' ? 'bg-green-500' : 
                      selectedTransaction.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    {selectedTransaction.status === 'SUCCESS' ? 'Đã thanh toán thành công' : selectedTransaction.status === 'PENDING' ? 'Đang chờ xử lý' : 'Thất bại / Đã hủy'}
                  </span>
                </div>

                {/* Nút hành động thay đổi trạng thái chỉ dành cho giao dịch PENDING */}
                {selectedTransaction.status === 'PENDING' ? (
                  <div className="pt-3 border-t border-gray-100 space-y-2.5">
                    <p className="text-[10px] text-center text-text-tertiary">
                      Giao dịch này đang ở trạng thái <span className="font-bold text-amber-500">Chờ xử lý</span>. Bạn có thể duyệt tay hoặc hủy bỏ giao dịch này:
                    </p>
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                      <button
                        type="button"
                        disabled={isUpdatingStatus || isDeleting}
                        onClick={() => handleUpdateStatus(selectedTransaction.id, 'FAILED')}
                        className="px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-600 rounded-xl font-bold text-[12px] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        Hủy giao dịch
                      </button>
                      <button
                        type="button"
                        disabled={isUpdatingStatus || isDeleting}
                        onClick={() => handleUpdateStatus(selectedTransaction.id, 'SUCCESS')}
                        className="px-4 py-3 bg-green-600 hover:brightness-110 text-white rounded-xl font-bold text-[12px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/10"
                      >
                        {isUpdatingStatus ? (
                          <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            Duyệt nạp (Đã nhận)
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        disabled={isDeleting || isUpdatingStatus}
                        onClick={() => handleDeleteTransaction(selectedTransaction.id)}
                        className="w-full py-2 bg-gray-50 hover:bg-red-50 text-text-tertiary hover:text-red-600 border border-dashed border-gray-200 hover:border-red-200 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5"
                      >
                        {isDeleting ? (
                          <div className="size-4 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                            Xóa vĩnh viễn giao dịch này
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Nút xóa vĩnh viễn cho giao dịch đã kết thúc (SUCCESS hoặc FAILED) */
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteTransaction(selectedTransaction.id)}
                      className="w-full py-2.5 bg-gray-50 hover:bg-red-50 text-text-tertiary hover:text-red-600 border border-dashed border-gray-200 hover:border-red-200 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5"
                    >
                      {isDeleting ? (
                        <div className="size-4 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                          Xóa vĩnh viễn giao dịch này khỏi hệ thống đối soát
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};
