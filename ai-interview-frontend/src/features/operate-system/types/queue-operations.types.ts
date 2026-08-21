export type QueueJobState = 'all' | 'waiting' | 'active' | 'delayed' | 'completed' | 'failed';
export type QueueChartBucket = 'hour' | 'day';

export type QueueCounts = {
  waiting: number;
  active: number;
  delayed: number;
  completed: number;
  failed: number;
};

export type QueueSummary = {
  name: string;
  label: string;
  businessGroup: 'CV' | 'Interview' | 'Email' | 'Notification';
  concurrency: number;
  workers: number;
  counts: QueueCounts;
  oldestWaitingAgeMs: number | null;
  averageDurationMs: number | null;
  p95DurationMs: number | null;
  retries: number;
  failureRate: number;
  isCongested: boolean;
};

export type QueueFailure = {
  queueName: string;
  queueLabel: string;
  jobId: string;
  jobName: string;
  failedAt: string;
  reason: string;
  attemptsMade: number;
};

export type QueueHistoryPoint = {
  date: string;
  completed: number;
  failed: number;
};

export type QueueOverview = {
  generatedAt: string;
  totals: QueueCounts & { retries: number; failureRate: number };
  queues: QueueSummary[];
  congestedQueues: Array<{
    name: string;
    label: string;
    waiting: number;
    oldestWaitingAgeMs: number | null;
  }>;
  recentFailures: QueueFailure[];
  history: QueueHistoryPoint[];
};

export type QueueJob = {
  queueName: string;
  queueLabel: string;
  businessGroup: string;
  jobId: string;
  jobName: string;
  state: string;
  identifiers: {
    userId: string | null;
    cvId: string | null;
    sessionId: string | null;
    analysisId: string | null;
  };
  createdAt: string;
  processedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  progress: unknown;
  attemptsMade: number;
  attemptsAllowed: number;
  failedReason: string | null;
};

export type QueueJobsResponse = {
  items: QueueJob[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type QueueJobDetail = QueueJob & {
  payload: unknown;
  returnValue: unknown;
  options: unknown;
  delay: number;
  stacktrace: string[];
  logs: string[];
  logCount: number;
};

export type QueueJobsQuery = {
  queueName?: string;
  state?: QueueJobState;
  search?: string;
  page: number;
  limit: number;
};
