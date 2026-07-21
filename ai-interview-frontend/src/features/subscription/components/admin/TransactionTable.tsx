interface Transaction {
  id: string;
  userId?: string;
  user?: { fullName: string; email: string };
  type: string;
  creditsAdded: number;
  amount: number;
  paymentRefId?: string;
  sepayTransactionId?: string;
  status: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  totalPages: number;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

const STATUS_MAP: Record<string, { label: string; colors: string }> = {
  SUCCESS: { label: 'Thành công', colors: 'text-green-600 bg-green-50 border-green-100' },
  PENDING: { label: 'Chờ xử lý', colors: 'text-amber-600 bg-amber-50 border-amber-100' },
  FAILED: { label: 'Thất bại', colors: 'text-red-600 bg-red-50 border-red-100' },
};

const TYPE_MAP: Record<string, string> = {
  DEPOSIT: 'Nạp qua QR',
  COMPENSATION: 'Đền bù',
  PROMOTION: 'Khuyến mãi',
};

const TYPE_COLORS: Record<string, string> = {
  DEPOSIT: 'text-blue-600 bg-blue-50 border-blue-100',
  COMPENSATION: 'text-orange-600 bg-orange-50 border-orange-100',
  PROMOTION: 'text-green-600 bg-green-50 border-green-100',
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
}

export function TransactionTable({ transactions, isLoading, totalPages, totalCount, currentPage, pageSize, onPageChange, onSelectTransaction }: TransactionTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[800px]">
          <thead>
            <tr className="bg-bg-surface-soft border-b border-border-hairline">
              {['Học viên', 'Phân loại', 'Credit nạp', 'Số tiền', 'Mã đối soát / Lý do', 'Trạng thái', 'Thời gian', ''].map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.5px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24 mb-1" /><div className="h-3 bg-gray-100 rounded w-32" /></td>
                  <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-8 ml-auto" /></td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <span className="material-symbols-outlined text-[48px] mb-2 opacity-20 text-text-tertiary">search_off</span>
                  <p className="text-[13px] font-medium text-text-tertiary">Không tìm thấy giao dịch nào phù hợp</p>
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-bg-surface-soft/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-text-primary text-[13px]">{t.user?.fullName || 'Người dùng'}</div>
                      <div className="text-text-secondary text-[11px]">{t.user?.email || 'Chưa cập nhật'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${TYPE_COLORS[t.type] || ''}`}>
                      {TYPE_MAP[t.type] || t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-text-primary text-[13px]">
                    {t.creditsAdded === -1 ? 'VÔ HẠN' : `+${t.creditsAdded} CR`}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-text-secondary">
                    {t.amount > 0 ? `${t.amount.toLocaleString()}đ` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-mono text-text-primary select-all max-w-[180px] truncate" title={t.paymentRefId}>
                      {t.paymentRefId || '-'}
                    </div>
                    {t.sepayTransactionId && <div className="text-[10px] text-text-tertiary">Sepay: {t.sepayTransactionId}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_MAP[t.status]?.colors || ''}`}>
                      {t.status === 'SUCCESS' ? 'Thành công' : t.status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-text-secondary">{formatDate(t.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onSelectTransaction(t)} className="p-1.5 hover:bg-bg-surface text-text-tertiary hover:text-primary rounded-lg transition-all">
                      <span className="material-symbols-outlined text-[18px]">info</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="px-6 py-4 bg-bg-surface-soft/50 border-t border-border-hairline flex items-center justify-between">
          <div className="text-[12px] text-text-secondary">
            Hiển thị <span className="font-bold text-text-primary">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}</span> trên <span className="font-bold text-text-primary">{totalCount}</span> giao dịch
          </div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
              className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => onPageChange(i + 1)}
                  className={`size-8 rounded-lg text-[12px] font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-border-hairline text-text-secondary hover:bg-bg-surface'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
              className="size-8 rounded-lg border border-border-hairline bg-white flex items-center justify-center hover:bg-bg-surface disabled:opacity-30 transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
