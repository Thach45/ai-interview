interface InterviewChartProps {
  voice?: number;
  text?: number;
  isLoading?: boolean;
}

export function InterviewChart({ voice = 0, text = 0, isLoading }: InterviewChartProps) {
  const total = voice + text;

  return (
    <div className="bg-white rounded-2xl border border-border-hairline p-6 shadow-sm">
      <h3 className="text-[15px] font-bold text-text-primary mb-6">Phiên phỏng vấn (Voice/Text)</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : total === 0 ? (
        <div className="flex items-center justify-center text-sm text-gray-500 h-40 mb-10">Chưa có dữ liệu</div>
      ) : (
        <div className="h-40 flex items-end gap-8 justify-center pt-4">
          {[
            { label: 'Voice', count: voice, pct: Math.round((voice / total) * 100), color: 'bg-primary/80' },
            { label: 'Text', count: text, pct: Math.round((text / total) * 100), color: 'bg-blue-300' },
          ].map(item => (
            <div key={item.label} className="flex flex-col justify-end items-center gap-2 h-full group">
              <div className={`w-16 ${item.color} rounded-t-sm relative flex items-end justify-center`} style={{ height: `${Math.max(item.pct, 5)}%` }}>
                <span className="absolute -top-6 text-[12px] font-bold">{item.pct}%</span>
              </div>
              <span className="text-[12px] font-medium text-text-tertiary">{item.label} ({item.count})</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-primary/80" /><span className="text-[11px] text-text-secondary">Voice</span></div>
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-blue-300" /><span className="text-[11px] text-text-secondary">Text</span></div>
      </div>
    </div>
  );
}
