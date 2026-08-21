import { useQuery } from '@tanstack/react-query';
import { systemHealthApi } from '../api/systemHealth.api';

export const useSystemHealth = () =>
  useQuery({
    queryKey: ['system-health'],
    queryFn: systemHealthApi.getHealth,
    refetchInterval: 30000,
    retry: 1,
  });
