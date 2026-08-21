import apiClient from '../../../shared/services/apiClient';

export type HealthStatus = 'ok' | 'degraded';
export type DependencyStatus = 'up' | 'down' | 'not_configured';

export type HealthResponse = {
  status: HealthStatus;
  timestamp: string;
  uptimeSeconds: number;
  responseTimeMs: number;
  services: {
    api: { status: 'up' };
    database: { status: DependencyStatus; responseTimeMs?: number };
    redis: { status: DependencyStatus; responseTimeMs?: number };
  };
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const systemHealthApi = {
  getHealth: async () => {
    const response = await apiClient.get<never, ApiEnvelope<HealthResponse>>('/health');
    
    return response.data;
  },
};
