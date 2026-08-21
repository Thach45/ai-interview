import { useQuery } from "@tanstack/react-query";
import { queueOperationsApi } from "../api/queue-operations.api";
import type {
  QueueChartBucket,
  QueueJobsQuery,
} from "../types/queue-operations.types";

export const useQueueOverview = (bucket: QueueChartBucket) =>
  useQuery({
    queryKey: ["operate-system", "queues", "overview", bucket],
    queryFn: () => queueOperationsApi.getOverview(bucket),
    refetchInterval: 30000,
  });

export const useQueueJobs = (query: QueueJobsQuery, enabled = true) =>
  useQuery({
    queryKey: [
      "operate-system",
      "queues",
      "jobs",
      query.queueName,
      query.state,
      query.search,
      query.page,
      query.limit,
    ],
    queryFn: () => queueOperationsApi.getJobs(query),
    enabled,
    placeholderData: (previousData) => previousData,
  });

export const useQueueJobDetail = (
  queueName: string | null,
  jobId: string | null,
) =>
  useQuery({
    queryKey: ["operate-system", "queues", "job", queueName, jobId],
    queryFn: () => queueOperationsApi.getJobDetail(queueName!, jobId!),
    enabled: Boolean(queueName && jobId),
  });
