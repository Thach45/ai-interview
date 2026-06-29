import apiClient from "../../../shared/services/apiClient";
import type { DashboardStatsQuery, DashboardStatsResponse } from "../types/dashboard.types";

export const dashboardAdminApi = {
  getStats: async (params: DashboardStatsQuery): Promise<DashboardStatsResponse> => {
    // The backend uses sendResponse which nests the response under 'data'
    // Let's assume apiClient unwraps it, or we may need to access .data
    const response = await apiClient.get<any, { data: DashboardStatsResponse }>("/admin/dashboard", {
      params,
    });
    // @ts-ignore
    return response.data || response;
  },
};

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
