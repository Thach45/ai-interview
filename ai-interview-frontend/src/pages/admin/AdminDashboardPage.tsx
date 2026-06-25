import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';

export const AdminDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days'); // '7days', 'this_month', 'last_month', 'custom'

  useEffect(() => {
    setIsLoading(true);
    // Giả lập call API mỗi khi đổi ngày
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [dateRange]);

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
                className="pl-9 pr-3 py-2 text-[13px] border border-border-hairline rounded-lg text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[140px] transition-all bg-bg-canvas"
                defaultValue="2026-04-25"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-text-tertiary group-focus-within:text-primary transition-colors">event</span>
            </div>
            <span className="text-text-tertiary text-[12px] font-medium">đến</span>
            <div className="relative group">
              <input 
                type="date" 
                className="pl-9 pr-3 py-2 text-[13px] border border-border-hairline rounded-lg text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[140px] transition-all bg-bg-canvas"
                defaultValue="2026-06-25"
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
            value="24,500,000 đ" 
            trend={dateRange === 'last_month' ? "-5%" : "+15%"} 
            icon="payments" 
            color="green" 
          />
          <StatCard 
            title="Người dùng mới" 
            value="342" 
            trend="+5%" 
            icon="group_add" 
            color="primary" 
          />
          <StatCard 
            title="Phỏng vấn hoàn thành" 
            value="1,204" 
            trend="+22%" 
            icon="task_alt" 
            color="blue" 
          />
          <StatCard 
            title="Chi phí AI (Ước tính)" 
            value="1,250,000 đ" 
            trend="+8%" 
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
                <div className="text-[24px] font-bold text-green-600">24,500,000 đ</div>
                <div className="text-[12px] font-medium text-text-tertiary">Tổng kỳ này</div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center flex-1 min-h-[300px]">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex-1 relative flex items-center justify-center min-h-[300px] mt-4">
                {/* Dùng SVG cơ bản để vẽ đường biểu đồ to hơn */}
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {/* Background Fill */}
                  <path 
                    d="M 0 35 Q 10 30, 20 25 T 40 15 T 60 20 T 80 5 T 100 10 L 100 40 L 0 40 Z" 
                    fill="url(#greenGradient)" 
                  />
                  {/* Line */}
                  <path 
                    d="M 0 35 Q 10 30, 20 25 T 40 15 T 60 20 T 80 5 T 100 10" 
                    fill="none" 
                    stroke="#1aae39" 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Points */}
                  <circle cx="20" cy="25" r="2" fill="#fff" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <circle cx="40" cy="15" r="2" fill="#fff" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <circle cx="60" cy="20" r="2" fill="#fff" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <circle cx="80" cy="5" r="2" fill="#fff" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <circle cx="100" cy="10" r="2" fill="#fff" stroke="#1aae39" strokeWidth="2" vectorEffect="non-scaling-stroke" />

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
              <span className="text-[12px] font-medium text-text-tertiary">Ngày 1</span>
              <span className="text-[12px] font-medium text-text-tertiary">Ngày 5</span>
              <span className="text-[12px] font-medium text-text-tertiary">Ngày 10</span>
              <span className="text-[12px] font-medium text-text-tertiary">Ngày 15</span>
              <span className="text-[12px] font-medium text-text-tertiary">Ngày 20</span>
              <span className="text-[12px] font-medium text-text-tertiary">Ngày 25</span>
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
              ) : (
                <div className="flex flex-col gap-1">
                  {MOCK_TRANSACTIONS.map((tx) => (
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
              <div className="h-40 flex items-end gap-3 justify-between pt-4">
                {[
                  { day: 'T2', voice: 40, text: 60 },
                  { day: 'T3', voice: 55, text: 45 },
                  { day: 'T4', voice: 30, text: 70 },
                  { day: 'T5', voice: 60, text: 40 },
                  { day: 'T6', voice: 80, text: 20 },
                  { day: 'T7', voice: 90, text: 10 },
                  { day: 'CN', voice: 75, text: 25 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                    <div className="flex w-full gap-1 items-end justify-center h-full relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        V: {item.voice}% | T: {item.text}%
                      </div>
                      <div className="w-[45%] bg-primary/80 rounded-t-sm hover:bg-primary transition-colors" style={{ height: `${item.voice}%` }} />
                      <div className="w-[45%] bg-blue-300 rounded-t-sm hover:bg-blue-400 transition-colors" style={{ height: `${item.text}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-text-tertiary">{item.day}</span>
                  </div>
                ))}
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
            ) : (
              <div className="h-40 flex items-end gap-3 justify-between pt-4">
                {[
                  { day: 'T2', input: 45, output: 25 },
                  { day: 'T3', input: 60, output: 35 },
                  { day: 'T4', input: 30, output: 15 },
                  { day: 'T5', input: 80, output: 50 },
                  { day: 'T6', input: 95, output: 60 },
                  { day: 'T7', input: 50, output: 30 },
                  { day: 'CN', input: 40, output: 20 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                    <div className="flex flex-col w-full gap-[1px] items-center justify-end h-full relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        In: {item.input}k | Out: {item.output}k
                      </div>
                      <div className="w-[80%] bg-purple-300 rounded-t-sm transition-colors" style={{ height: `${item.output}%` }} />
                      <div className="w-[80%] bg-purple-600 rounded-b-sm transition-colors" style={{ height: `${item.input}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-text-tertiary">{item.day}</span>
                  </div>
                ))}
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
              ) : (
                <div className="flex flex-col gap-1">
                  {MOCK_INTERVIEWS.map((interview) => (
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
                            <span className="material-symbols-outlined text-[12px]">{interview.type === 'Voice' ? 'mic' : 'chat'}</span>
                            {interview.job}
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

// Mock Data
const MOCK_TRANSACTIONS = [
  { id: 1, user: 'Nguyen Van A', amount: '200,000 đ', credits: 50, date: '10:30 25/06/2026' },
  { id: 2, user: 'Tran Thi B', amount: '500,000 đ', credits: 150, date: '09:15 25/06/2026' },
  { id: 3, user: 'Le Minh C', amount: '1,000,000 đ', credits: 350, date: '18:45 24/06/2026' },
  { id: 4, user: 'Pham D', amount: '200,000 đ', credits: 50, date: '14:20 24/06/2026' },
  { id: 5, user: 'Hoang E', amount: '1,000,000 đ', credits: 350, date: '11:00 23/06/2026' },
];

const MOCK_INTERVIEWS = [
  { id: 1, user: 'Hoang E', job: 'Senior Frontend Developer', type: 'Voice', score: 85, date: 'Vừa xong' },
  { id: 2, user: 'Ngo F', job: 'Product Manager', type: 'Text', score: 92, date: '2 giờ trước' },
  { id: 3, user: 'Vu G', job: 'Data Scientist', type: 'Voice', score: 65, date: '5 giờ trước' },
  { id: 4, user: 'Bui H', job: 'Backend Engineer (NodeJS)', type: 'Text', score: 78, date: 'Hôm qua' },
];
