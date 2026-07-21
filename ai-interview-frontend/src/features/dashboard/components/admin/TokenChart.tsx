interface TokenData {
  date: string;
  input: number;
  output: number;
}

interface TokenChartProps {
  data?: TokenData[];
  isLoading?: boolean;
}

export function TokenChart({ data, isLoading }: TokenChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-hairline p-6 shadow-sm">
      <h3 className="text-[15px] font-bold text-text-primary mb-6">Lượng Token tiêu thụ</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex items-center justify-center text-sm text-gray-500 h-40">Chưa có dữ liệu</div>
      ) : (
        <div className="h-40 flex items-end gap-3 justify-between pt-4">
          {(() => {
            const maxToken = Math.max(...data.map(t => t.input + t.output), 1);
            return data.map((item, idx, arr) => {
              const inputPct = (item.input / maxToken) * 100;
              const outputPct = (item.output / maxToken) * 100;
              const showLabel = arr.length <= 7 || idx === 0 || idx === arr.length - 1 || idx % Math.floor(arr.length / 5) === 0;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                  <div className="flex flex-col w-full gap-[1px] items-center justify-end h-full relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      In: {(item.input / 1000).toFixed(1)}k | Out: {(item.output / 1000).toFixed(1)}k
                    </div>
                    <div className="w-[80%] bg-purple-300 rounded-t-sm transition-colors" style={{ height: `${outputPct}%` }} />
                    <div className="w-[80%] bg-purple-600 rounded-b-sm transition-colors" style={{ height: `${inputPct}%` }} />
                  </div>
                  {showLabel ? (
                    <span className="text-[10px] font-medium text-text-tertiary">{new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                  ) : (
                    <span className="text-[10px]">&nbsp;</span>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-purple-600" /><span className="text-[11px] text-text-secondary">Input (k)</span></div>
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-purple-300" /><span className="text-[11px] text-text-secondary">Output (k)</span></div>
      </div>
    </div>
  );
}
