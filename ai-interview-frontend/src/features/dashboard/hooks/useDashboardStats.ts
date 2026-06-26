import { useQuery } from "@tanstack/react-query";
import { dashboardAdminApi } from "../api/dashboard.api";
import type { DashboardStatsQuery, DashboardStatsResponse } from "../types/dashboard.types";

export const useDashboardStats = (params: DashboardStatsQuery) => {
  return useQuery<DashboardStatsResponse, Error>({
    queryKey: ["admin-dashboard-stats", params],
    queryFn: () => dashboardAdminApi.getStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
