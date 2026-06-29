import { useQuery } from "@tanstack/react-query";
import dashboardApi from "../api/dashboard.api";

export const useDashboard = () => {
  const { data: dashboardResponse, isLoading, refetch, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => dashboardApi.getDashboardData(),
    staleTime: 1 * 60 * 1000, // 1 phút
  });

  const dashboardData = dashboardResponse?.data;

  return {
    dashboardData,
    isLoading,
    refetch,
    error,
  };
};
