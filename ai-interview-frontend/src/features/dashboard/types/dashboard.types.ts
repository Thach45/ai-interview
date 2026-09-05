export type DashboardStatsQuery = {
  dateRange?: '7days' | 'this_month' | 'last_month' | 'custom';
  startDate?: string;
  endDate?: string;
};

export type DashboardStatsResponse = {
  cards: {
    revenue: { value: number; trend: string };
    newUsers: { value: number; trend: string };
    completedInterviews: { value: number; trend: string };
    aiCost: { value: number; trend: string };
  };
  revenueChart: {
    date: string;
    amount: number;
  }[];
  recentTransactions: {
    id: string;
    user: string;
    date: string;
    amount: string;
    credits: number;
  }[];
  recentInterviews?: {
    id: string;
    user: string;
    jobTitle: string;
    date: string;
    score: number;
  }[];
  tokenChart?: {
    date: string;
    input: number;
    output: number;
  }[];
};
