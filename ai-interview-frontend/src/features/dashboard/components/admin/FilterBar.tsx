interface FilterBarProps {
  dateRange: string;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function FilterBar({
  dateRange, startDate, endDate,
  onDateRangeChange, onStartDateChange, onEndDateChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-border-hairline shadow-sm gap-4">
      <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
        {['7days', 'this_month', 'last_month', 'custom'].map((range) => (
          <button
            key={range}
            onClick={() => onDateRangeChange(range)}
            className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              dateRange === range
                ? 'bg-ink-deep text-black shadow-sm'
                : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
            }`}
          >
            {range === '7days' ? '7 ngày qua' : range === 'this_month' ? 'Tháng này' : range === 'last_month' ? 'Tháng trước' : 'Tùy chỉnh'}
          </button>
        ))}
      </div>

      <div className={`flex items-center gap-2 transition-all ${dateRange === 'custom' ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
        <div className="relative group">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="pl-9 pr-3 py-2 text-[13px] border border-border-hairline rounded-lg text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[140px] transition-all bg-bg-canvas"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-text-tertiary group-focus-within:text-primary transition-colors">event</span>
        </div>
        <span className="text-text-tertiary text-[12px] font-medium">đến</span>
        <div className="relative group">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="pl-9 pr-3 py-2 text-[13px] border border-border-hairline rounded-lg text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[140px] transition-all bg-bg-canvas"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-text-tertiary group-focus-within:text-primary transition-colors">event</span>
        </div>
        <button className="px-4 py-2 bg-primary text-white text-[13px] font-bold rounded-lg shadow-sm hover:brightness-110 transition-all ml-2">
          Lọc
        </button>
      </div>
    </div>
  );
}
