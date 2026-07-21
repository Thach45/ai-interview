import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: string;
  color: 'primary' | 'blue' | 'green' | 'orange';
}

const colorMap: Record<string, string> = {
  primary: 'text-primary bg-primary/10',
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  orange: 'text-orange-600 bg-orange-50',
};

export function StatCard({ title, value, trend, icon, color }: StatCardProps) {
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
}
