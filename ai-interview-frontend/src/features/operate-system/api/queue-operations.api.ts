import apiClient from '../../../shared/services/apiClient';
import type {
  QueueChartBucket,
  QueueJobDetail,
  QueueJobsQuery,
  QueueJobsResponse,
  QueueOverview,
} from '../types/queue-operations.types';

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const queueOperationsApi = {
  getOverview: async (bucket: QueueChartBucket) => {
    const response = await apiClient.get<never, ApiEnvelope<QueueOverview>>(
      '/admin/operate-system/queues/overview',
      { params: { bucket } },
    );
    return response.data;
  },
  getJobs: async (params: QueueJobsQuery) => {
    const response = await apiClient.get<never, ApiEnvelope<QueueJobsResponse>>(
      '/admin/operate-system/queues/jobs',
      { params },
    );
    return response.data;
  },
  getJobDetail: async (queueName: string, jobId: string) => {
    const response = await apiClient.get<never, ApiEnvelope<QueueJobDetail>>(
      `/admin/operate-system/queues/${encodeURIComponent(queueName)}/jobs/${encodeURIComponent(jobId)}`,
    );
    return response.data;
  },
};
