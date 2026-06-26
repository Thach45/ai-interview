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
