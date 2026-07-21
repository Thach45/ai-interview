interface TransactionItem {
  id: string;
  user: string;
  date: string;
  amount: string;
  credits: string;
}

interface InterviewItem {
  id: string;
  user: string;
  jobTitle: string;
  score: number;
  date: string;
}

export function RecentTransactions({ transactions, isLoading }: { transactions?: TransactionItem[]; isLoading?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden flex flex-col xl:col-span-1">
      <div className="p-6 border-b border-border-hairline flex items-center justify-between bg-bg-surface-soft/50">
        <h3 className="text-[16px] font-bold text-text-primary">Giao dịch mới nhất</h3>
        <button className="text-[12px] font-bold text-primary hover:underline">Xem tất cả</button>
      </div>
      <div className="overflow-x-auto flex-1 p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="flex items-center justify-center text-sm text-gray-500 min-h-[200px]">Không có giao dịch nào</div>
        ) : (
          <div className="flex flex-col gap-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-surface transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold border border-green-100">
                    <span className="material-symbols-outlined text-[20px]">add_card</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-text-primary">{tx.user}</div>
                    <div className="text-[11px] text-text-secondary">{tx.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-text-primary">{tx.amount}</div>
                  <div className="text-[11px] font-bold text-green-600">+{tx.credits} Credits</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function RecentInterviews({ interviews, isLoading }: { interviews?: InterviewItem[]; isLoading?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-border-hairline flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-text-primary">Phỏng vấn mới nhất</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2 custom-scrollbar max-h-[220px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[150px]">
            <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !interviews || interviews.length === 0 ? (
          <div className="flex items-center justify-center text-sm text-gray-500 min-h-[150px]">Chưa có phiên phỏng vấn nào</div>
        ) : (
          <div className="flex flex-col gap-1">
            {interviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-surface transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 inline-flex items-center justify-center size-8 rounded-full border ${
                    interview.score >= 80 ? 'border-green-200 bg-green-50 text-green-700' :
                    interview.score >= 60 ? 'border-orange-200 bg-orange-50 text-orange-700' :
                    'border-red-200 bg-red-50 text-red-700'
                  }`}>
                    <span className="text-[11px] font-bold">{interview.score}</span>
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="text-[13px] font-bold text-text-primary truncate">{interview.user}</div>
                    <div className="text-[11px] text-text-secondary truncate">{interview.jobTitle}</div>
                  </div>
                </div>
                <div className="text-[10px] text-text-tertiary shrink-0 whitespace-nowrap">{interview.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
