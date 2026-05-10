import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: 'primary' | 'success' | 'warning' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    success: 'text-green-600 bg-green-50',
    warning: 'text-amber-600 bg-amber-50',
    info: 'text-blue-600 bg-blue-50',
  };

  return (
    <div className="bg-bg-canvas p-6 rounded-xl border border-border-hairline shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[12px] font-bold ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            <span className="material-symbols-outlined text-[16px]">{trend.isUp ? 'trending_up' : 'trending_down'}</span>
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <div className="text-text-tertiary text-[13px] font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold text-text-primary tracking-tight">{value}</div>
      </div>
    </div>
  );
};

export const UserStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Tổng người dùng" 
        value="1,284" 
        icon="group" 
        trend={{ value: 12, isUp: true }}
        color="primary"
      />
      <StatCard 
        title="Người dùng mới (24h)" 
        value="24" 
        icon="person_add" 
        trend={{ value: 8, isUp: true }}
        color="success"
      />
      <StatCard 
        title="Tổng Credit lưu thông" 
        value="45,200" 
        icon="toll" 
        color="warning"
      />
      <StatCard 
        title="Tỷ lệ hoạt động" 
        value="86%" 
        icon="bolt" 
        trend={{ value: 2, isUp: false }}
        color="info"
      />
    </div>
  );
};
