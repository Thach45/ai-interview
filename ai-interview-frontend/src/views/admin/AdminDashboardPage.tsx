import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useDashboardStats } from '../../features/dashboard/hooks/useDashboardStats';
import { StatCard } from '../../features/dashboard/components/admin/StatCard';
import { FilterBar } from '../../features/dashboard/components/admin/FilterBar';
import { RevenueChart } from '../../features/dashboard/components/admin/RevenueChart';
import { InterviewChart } from '../../features/dashboard/components/admin/InterviewChart';
import { TokenChart } from '../../features/dashboard/components/admin/TokenChart';
import { RecentTransactions, RecentInterviews } from '../../features/dashboard/components/admin/RecentActivities';

export const AdminDashboardPage = () => {
  const [dateRange, setDateRange] = useState<'7days' | 'this_month' | 'last_month' | 'custom'>('7days');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const { data: stats, isLoading } = useDashboardStats({
    dateRange,
    ...(dateRange === 'custom' ? { startDate, endDate } : {}),
  });

  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="flex flex-col gap-6">
        <FilterBar
          dateRange={dateRange}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={setDateRange as (r: string) => void}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Doanh thu" value={stats?.cards?.revenue?.value ? `${stats.cards.revenue.value.toLocaleString()} đ` : '0 đ'} trend={stats?.cards?.revenue?.trend || '0%'} icon="payments" color="green" />
          <StatCard title="Người dùng mới" value={stats?.cards?.newUsers?.value?.toLocaleString() || '0'} trend={stats?.cards?.newUsers?.trend || '0%'} icon="group_add" color="primary" />
          <StatCard title="Phỏng vấn hoàn thành" value={stats?.cards?.completedInterviews?.value?.toLocaleString() || '0'} trend={stats?.cards?.completedInterviews?.trend || '0%'} icon="task_alt" color="blue" />
          <StatCard title="Chi phí AI (Ước tính)" value={stats?.cards?.aiCost?.value ? `${stats.cards.aiCost.value.toLocaleString()} đ` : '0 đ'} trend={stats?.cards?.aiCost?.trend || '0%'} icon="smart_toy" color="orange" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RevenueChart data={stats?.revenueChart} totalRevenue={stats?.cards?.revenue?.value} isLoading={isLoading} />
          <RecentTransactions
            transactions={stats?.recentTransactions?.map((tx: any) => ({
              id: tx.id, user: tx.user, date: tx.date, amount: tx.amount, credits: tx.credits,
            }))}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InterviewChart voice={stats?.interviewStats?.voice} text={stats?.interviewStats?.text} isLoading={isLoading} />
          <TokenChart data={stats?.tokenChart} isLoading={isLoading} />
          <RecentInterviews
            interviews={stats?.recentInterviews?.map((i: any) => ({
              id: i.id, user: i.user, jobTitle: i.jobTitle, score: i.score, date: i.date,
            }))}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
};


