interface TransactionFiltersProps {
  searchTerm: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function TransactionFilters({ searchTerm, typeFilter, onSearchChange, onTypeChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative flex-1 group w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
        <input
          type="text"
          placeholder="Tìm theo tên học viên, email, mã đối soát, Sepay ID..."
          value={searchTerm}
          onChange={(e) => { onSearchChange(e.target.value); }}
          className="w-full pl-10 pr-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[13px] shadow-sm"
        />
      </div>
      <div className="w-full md:w-64">
        <select
          value={typeFilter}
          onChange={(e) => { onTypeChange(e.target.value); }}
          className="w-full px-4 py-3 bg-white border border-border-hairline rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[13px] font-bold text-text-secondary shadow-sm"
        >
          <option value="ALL">Tất cả loại giao dịch</option>
          <option value="DEPOSIT">Nạp qua QR (Deposit)</option>
          <option value="COMPENSATION">Cấp đền bù (Compensation)</option>
          <option value="PROMOTION">Quà khuyến mãi (Promotion)</option>
        </select>
      </div>
    </div>
  );
}
