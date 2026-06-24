import apiClient from "../../../shared/services/apiClient";

export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  totalCvs: number;
  averageScore: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  status?: string;
  description: string;
  createdAt: string;
}

export interface SuggestedJob {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  performanceTrend: number[];
  recentActivities: RecentActivity[];
  suggestedJobs: SuggestedJob[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export const dashboardApi = {
  getDashboardData: () =>
    apiClient.get<any, DashboardResponse>("/user/dashboard"),
};

export default dashboardApi;
