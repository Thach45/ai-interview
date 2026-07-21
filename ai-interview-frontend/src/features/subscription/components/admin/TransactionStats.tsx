interface TransactionStatsProps {
  totalRevenue: number;
  creditsDeposited: number;
  creditsCompensated: number;
  pendingTransactions: number;
}

export function TransactionStats({ totalRevenue, creditsDeposited, creditsCompensated, pendingTransactions }: TransactionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatBox label="Tổng doanh thu thực" value={`${(totalRevenue || 0).toLocaleString()}đ`} className="text-text-primary" />
      <StatBox label="Credit đã được nạp" value={`${(creditsDeposited || 0).toLocaleString()} CR`} className="text-primary" />
      <StatBox label="Đền bù & Khuyến mãi" value={`${(creditsCompensated || 0).toLocaleString()} CR`} className="text-orange-600" />
      <StatBox label="Giao dịch chờ xử lý" value={`${pendingTransactions} GD`} className="text-amber-500" />
    </div>
  );
}

function StatBox({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="bg-white border border-border-hairline p-5 rounded-2xl shadow-sm">
      <div className="text-[11px] font-bold text-text-tertiary uppercase mb-1">{label}</div>
      <div className={`text-xl font-black ${className}`}>{value}</div>
    </div>
  );
}
