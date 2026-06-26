import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useDashboardStats } from '../../features/dashboard/hooks/useDashboardStats';
import dayjs from 'dayjs';

export const AdminDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7days' | 'this_month' | 'last_month' | 'custom'>('7days');
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { data: stats, isLoading } = useDashboardStats({
    dateRange,
    ...(dateRange === 'custom' ? { startDate, endDate } : {}),
  });

  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="flex flex-col gap-6">
        
        {/* Bộ lọc thời gian (Date Range Filter) */}
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-border-hairline shadow-sm gap-4">
          <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
            <FilterButton active={dateRange === '7days'} onClick={() => setDateRange('7days')}>7 ngày qua</FilterButton>
            <FilterButton active={dateRange === 'this_month'} onClick={() => setDateRange('this_month')}>Tháng này</FilterButton>
            <FilterButton active={dateRange === 'last_month'} onClick={() => setDateRange('last_month')}>Tháng trước</FilterButton>
            <FilterButton active={dateRange === 'custom'} onClick={() => setDateRange('custom')}>Tùy chỉnh</FilterButton>
          </div>
          
          <div className={`flex items-center gap-2 transition-all ${dateRange === 'custom' ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
            <div className="relative group">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 pr-3 py-2 text-[13px] border border-border-hairline rounded-lg text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[140px] transition-all bg-bg-canvas"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-text-tertiary group-focus-within:text-primary transition-colors">event</span>
            </div>
            <span className="text-text-tertiary text-[12px] font-medium">đến</span>
            <div className="relative group">
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 pr-3 py-2 text-[13px] border border-border-hairline rounded-lg text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[140px] transition-all bg-bg-canvas"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-text-tertiary group-focus-within:text-primary transition-colors">event</span>
            </div>
            <button className="px-4 py-2 bg-primary text-white text-[13px] font-bold rounded-lg shadow-sm hover:brightness-110 transition-all ml-2">
              Lọc
            </button>
          </div>
        </div>

        {/* 1. Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Doanh thu" 
            value={stats?.cards?.revenue?.value ? `${stats.cards.revenue.value.toLocaleString()} đ` : "0 đ"} 
            trend={stats?.cards?.revenue?.trend || "0%"} 
            icon="payments" 
            color="green" 
          />
          <StatCard 
            title="Người dùng mới" 
            value={stats?.cards?.newUsers?.value?.toLocaleString() || "0"} 
            trend={stats?.cards?.newUsers?.trend || "0%"} 
            icon="group_add" 
            color="primary" 
          />
          <StatCard 
            title="Phỏng vấn hoàn thành" 
            value={stats?.cards?.completedInterviews?.value?.toLocaleString() || "0"} 
            trend={stats?.cards?.completedInterviews?.trend || "0%"} 
            icon="task_alt" 
            color="blue" 
          />
          <StatCard 
            title="Chi phí AI (Ước tính)" 
            value={stats?.cards?.aiCost?.value ? `${stats.cards.aiCost.value.toLocaleString()} đ` : "0 đ"} 
            trend={stats?.cards?.aiCost?.trend || "0%"} 
            icon="smart_toy" 
            color="orange" 
          />
        </div>

        {/* 2. Focus Revenue Row (Biểu đồ doanh thu TO & Giao dịch) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Biểu đồ Doanh thu (Spans 2 cols) */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-border-hairline p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-bold text-text-primary">Biểu đồ Tăng trưởng Doanh thu</h3>
                <p className="text-[13px] text-text-secondary mt-1">Tổng doanh thu theo thời gian thực tế</p>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-bold text-green-600">
                  {stats?.cards?.revenue?.value ? `${stats.cards.revenue.value.toLocaleString()} đ` : "0 đ"}
                </div>
                <div className="text-[12px] font-medium text-text-tertiary">Tổng kỳ này</div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center flex-1 min-h-[300px]">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex-1 relative flex items-center justify-center min-h-[300px] mt-4">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {stats?.revenueChart && stats.revenueChart.length > 0 && (() => {
                    const maxAmt = Math.max(...stats.revenueChart.map(c => c.amount), 1);
                    const len = stats.revenueChart.length;
                    
                    const points = stats.revenueChart.map((c, i) => {
                      const x = len === 1 ? 50 : (i / (len - 1)) * 100;
                      // y in range 5 to 35 (inverted: 35 is bottom, 5 is top)
                      const y = 35 - ((c.amount / maxAmt) * 30);
                      return { x, y };
                    });

                    // Build path
                    let d = `M 0 35 L ${points[0].x} ${points[0].y}`;
                    for(let i=1; i<points.length; i++) {
                      d += ` L ${points[i].x} ${points[i].y}`;
                    }

                    // Fill path
                    const fillD = `${d} L 100 40 L 0 40 Z`;

                    return (
                      <>
                        <path d={fillD} fill="url(#greenGradient)" />
                        <path d={d} fill="none" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
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
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full border-b border-dashed border-gray-400 h-0" />
                  <div className="w-full border-b border-dashed border-gray-400 h-0" />
                  <div className="w-full border-b border-dashed border-gray-400 h-0" />
                  <div className="w-full border-b border-dashed border-gray-400 h-0" />
                  <div className="w-full border-b border-solid border-gray-400 h-0" />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-4 px-2">
              {stats?.revenueChart && stats.revenueChart.map((c, i, arr) => {
                // Chỉ show 5-6 mốc ngày cho đỡ rối
                if (arr.length <= 6 || i === 0 || i === arr.length - 1 || i % Math.floor(arr.length / 5) === 0) {
                  return <span key={c.date} className="text-[12px] font-medium text-text-tertiary">{dayjs(c.date).format('DD/MM')}</span>
                }
                return null;
              })}
            </div>
          </div>

          {/* Bảng Giao dịch */}
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
              ) : stats?.recentTransactions.length === 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-500 min-h-[200px]">
                  Không có giao dịch nào
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {stats?.recentTransactions.map((tx: any) => (
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
        </div>

        {/* 3. Other Metrics Row (Interviews, Tokens) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biểu đồ cột: Voice vs Text */}
          <div className="bg-white rounded-2xl border border-border-hairline p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-text-primary mb-6">Phiên phỏng vấn (Voice/Text)</h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="h-40 flex items-end gap-3 justify-center pt-4">
                {(() => {
                  const voiceCount = stats?.interviewStats?.voice || 0;
                  const textCount = stats?.interviewStats?.text || 0;
                  const total = voiceCount + textCount;
                  
                  if (total === 0) {
                    return <div className="text-sm text-gray-500 mb-10">Chưa có dữ liệu</div>
                  }

                  const voicePct = Math.round((voiceCount / total) * 100);
                  const textPct = 100 - voicePct;

                  return (
                    <div className="flex gap-8 items-end h-full">
                      <div className="flex flex-col justify-end items-center gap-2 h-full group">
                        <div className="w-16 bg-primary/80 rounded-t-sm relative flex items-end justify-center" style={{ height: `${Math.max(voicePct, 5)}%` }}>
                          <span className="absolute -top-6 text-[12px] font-bold">{voicePct}%</span>
                        </div>
                        <span className="text-[12px] font-medium text-text-tertiary">Voice ({voiceCount})</span>
                      </div>
                      <div className="flex flex-col justify-end items-center gap-2 h-full group">
                        <div className="w-16 bg-blue-300 rounded-t-sm relative flex items-end justify-center" style={{ height: `${Math.max(textPct, 5)}%` }}>
                          <span className="absolute -top-6 text-[12px] font-bold">{textPct}%</span>
                        </div>
                        <span className="text-[12px] font-medium text-text-tertiary">Text ({textCount})</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-primary/80" /><span className="text-[11px] text-text-secondary">Voice</span></div>
              <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-blue-300" /><span className="text-[11px] text-text-secondary">Text</span></div>
            </div>
          </div>

          {/* Biểu đồ Token */}
          <div className="bg-white rounded-2xl border border-border-hairline p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-text-primary mb-6">Lượng Token tiêu thụ</h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : !stats?.tokenChart || stats.tokenChart.length === 0 ? (
              <div className="flex items-center justify-center text-sm text-gray-500 h-40">
                Chưa có dữ liệu
              </div>
            ) : (
              <div className="h-40 flex items-end gap-3 justify-between pt-4">
                {(() => {
                  const maxToken = Math.max(...stats.tokenChart.map(t => t.input + t.output), 1);
                  return stats.tokenChart.map((item, idx, arr) => {
                    const inputPct = (item.input / maxToken) * 100;
                    const outputPct = (item.output / maxToken) * 100;
                    // Only show ~7 labels max to avoid crowding
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
                          <span className="text-[10px] font-medium text-text-tertiary">{dayjs(item.date).format('DD/MM')}</span>
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

          {/* Bảng Phỏng vấn */}
          <div className="bg-white rounded-2xl border border-border-hairline shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border-hairline flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-text-primary">Phỏng vấn mới nhất</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2 custom-scrollbar max-h-[220px]">
              {isLoading ? (
                 <div className="flex items-center justify-center h-full min-h-[150px]">
                   <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                 </div>
              ) : stats?.recentInterviews?.length === 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-500 min-h-[150px]">
                  Chưa có phiên phỏng vấn nào
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {stats?.recentInterviews?.map((interview) => (
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
                          <div className="text-[11px] text-text-secondary truncate flex items-center gap-1">
                            {interview.jobTitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-text-tertiary shrink-0 whitespace-nowrap">{interview.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const FilterButton = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
      active 
        ? 'bg-ink-deep text-white shadow-sm' 
        : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
    }`}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: string, color: 'primary' | 'blue' | 'green' | 'orange' }) => {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-white rounded-2xl p-6 border border-border-hairline shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className={`flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-full ${
          isPositive ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'
        }`}>
          <span className="material-symbols-outlined text-[14px]">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-[28px] font-bold text-text-primary tracking-tight">{value}</h4>
        <p className="text-[13px] font-medium text-text-secondary mt-1">{title}</p>
      </div>
    </div>
  );
};


