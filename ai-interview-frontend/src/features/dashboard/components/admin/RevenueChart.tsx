interface RevenueChartProps {
  data?: { date: string; amount: number }[];
  totalRevenue?: number;
  isLoading?: boolean;
}

export function RevenueChart({ data, totalRevenue, isLoading }: RevenueChartProps) {
  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-border-hairline p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-bold text-text-primary">Biểu đồ Tăng trưởng Doanh thu</h3>
          <p className="text-[13px] text-text-secondary mt-1">Tổng doanh thu theo thời gian thực tế</p>
        </div>
        <div className="text-right">
          <div className="text-[24px] font-bold text-green-600">
            {totalRevenue ? `${totalRevenue.toLocaleString()} đ` : '0 đ'}
          </div>
          <div className="text-[12px] font-medium text-text-tertiary">Tổng kỳ này</div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center flex-1 min-h-[300px]">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="flex-1 relative flex items-center justify-center min-h-[300px] mt-4">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            {(() => {
              const maxAmt = Math.max(...data.map(c => c.amount), 1);
              const len = data.length;
              const points = data.map((c, i) => {
                const x = len === 1 ? 50 : (i / (len - 1)) * 100;
                const y = 35 - ((c.amount / maxAmt) * 30);
                return { x, y };
              });
              let d = `M 0 35 L ${points[0].x} ${points[0].y}`;
              for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`;
              return (
                <>
                  <path d={`${d} L 100 40 L 0 40 Z`} fill="url(#greenGradient)" />
                  <path d={d} fill="none" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="2" fill="#fff" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  ))}
                </>
              );
            })()}
            <defs>
              <linearGradient id="greenGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(26, 174, 57, 0.2)" />
                <stop offset="100%" stopColor="rgba(26, 174, 57, 0)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-full border-b border-dashed border-gray-400 h-0" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[300px] text-sm text-gray-500">
          Chưa có dữ liệu
        </div>
      )}
      <div className="flex items-center justify-between mt-4 px-2">
        {data && data.map((c, i, arr) => {
          if (arr.length <= 6 || i === 0 || i === arr.length - 1 || i % Math.floor(arr.length / 5) === 0) {
            return <span key={c.date} className="text-[12px] font-medium text-text-tertiary">{new Date(c.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
          }
          return null;
        })}
      </div>
    </div>
  );
}
