import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, JobType, Queue } from 'bullmq';
import {
  QueueChartBucket,
  QueueJobsQueryDto,
  QueueJobState,
} from './dto/operate-system.dto';
import { QUEUE_DEFINITIONS, QueueName } from './operate-system.constants';

const COMPLETED_SAMPLE_SIZE = 100;
const JOB_SCAN_LIMIT = 1000;
const HISTORY_SAMPLE_SIZE = 1000;
const RECENT_FAILURE_LIMIT = 10;
const QUEUE_OPERATION_TIMEOUT_MS = 5000;
const WAITING_ALERT_AGE_MS = 5 * 60 * 1000;
const WAITING_ALERT_COUNT = 10;

type QueueDefinition = (typeof QUEUE_DEFINITIONS)[number];
type QueueCounts = Record<Exclude<QueueJobState, QueueJobState.ALL>, number>;
type QueueJobData = Record<string, unknown>;

@Injectable()
export class OperateSystemService {
  private readonly queues: Record<QueueName, Queue<QueueJobData>>;

  constructor(
    @InjectQueue('analysisCvQueue') analysisCvQueue: Queue<QueueJobData>,
    @InjectQueue('optimizeCvQueue') optimizeCvQueue: Queue<QueueJobData>,
    @InjectQueue('interviewTimerQueue')
    interviewTimerQueue: Queue<QueueJobData>,
    @InjectQueue('interviewAnalysisQueue')
    interviewAnalysisQueue: Queue<QueueJobData>,
    @InjectQueue('emailQueue') emailQueue: Queue<QueueJobData>,
    @InjectQueue('notificationQueue') notificationQueue: Queue<QueueJobData>,
  ) {
    this.queues = {
      analysisCvQueue,
      optimizeCvQueue,
      interviewTimerQueue,
      interviewAnalysisQueue,
      emailQueue,
      notificationQueue,
    };
  }

  async getQueueOverview(bucket: QueueChartBucket) {
    return this.withTimeout(this.getQueueOverviewData(bucket));
  }

  async getJobs(query: QueueJobsQueryDto) {
    return this.withTimeout(this.getJobsData(query));
  }

  async getJobDetail(queueName: QueueName, jobId: string) {
    return this.withTimeout(this.getJobDetailData(queueName, jobId));
  }

  private async getQueueOverviewData(bucket: QueueChartBucket) {
    const queues = await Promise.all(
      QUEUE_DEFINITIONS.map((definition) => this.getQueueSnapshot(definition)),
    );
    const totals = queues.reduce(
      (summary, queue) => ({
        waiting: summary.waiting + queue.counts.waiting,
        active: summary.active + queue.counts.active,
        delayed: summary.delayed + queue.counts.delayed,
        completed: summary.completed + queue.counts.completed,
        failed: summary.failed + queue.counts.failed,
        retries: summary.retries + queue.retries,
      }),
      {
        waiting: 0,
        active: 0,
        delayed: 0,
        completed: 0,
        failed: 0,
        retries: 0,
      },
    );
    const recentFailures = queues
      .flatMap((queue) => queue.recentFailures)
      .sort((left, right) => right.failedAt.localeCompare(left.failedAt))
      .slice(0, RECENT_FAILURE_LIMIT);
    const history = this.mergeHistory(
      queues.flatMap((queue) => queue.historyJobs),
      bucket,
    );
    const congestedQueues = queues
      .filter((queue) => queue.isCongested)
      .map((queue) => ({
        name: queue.name,
        label: queue.label,
        waiting: queue.counts.waiting,
        oldestWaitingAgeMs: queue.oldestWaitingAgeMs,
      }));
    const queueSummaries = queues.map(({ historyJobs, ...queue }) => {
      void historyJobs;
      return queue;
    });

    return {
      generatedAt: new Date().toISOString(),
      totals: {
        ...totals,
        failureRate:
          totals.completed + totals.failed > 0
            ? Number(
                (
                  (totals.failed / (totals.completed + totals.failed)) *
                  100
                ).toFixed(2),
              )
            : 0,
      },
      queues: queueSummaries,
      congestedQueues,
      recentFailures,
      history,
    };
  }

  private async getJobsData(query: QueueJobsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const definitions: QueueDefinition[] = query.queueName
      ? QUEUE_DEFINITIONS.filter((queue) => queue.name === query.queueName)
      : [...QUEUE_DEFINITIONS];
    const states = this.getStates(query.state);
    const jobs = (
      await Promise.all(
        definitions.map(async (definition) => {
          const queue = this.queues[definition.name];
          const jobsByState = await Promise.all(
            states.map(async (state) => {
              const records = await queue.getJobs(
                [state],
                0,
                JOB_SCAN_LIMIT - 1,
                false,
              );
              return records.map((job) =>
                this.toJobListItem(job, definition, state),
              );
            }),
          );
          return jobsByState.flat();
        }),
      )
    ).flat();
    const searchTerm = query.search?.trim().toLowerCase();
    const filteredJobs = searchTerm
      ? jobs.filter((job) => this.jobMatchesSearch(job, searchTerm))
      : jobs;
    const sortedJobs = [...filteredJobs].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
    const totalItems = sortedJobs.length;
    const offset = (page - 1) * limit;

    return {
      items: sortedJobs.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
      },
    };
  }

  private async getJobDetailData(queueName: QueueName, jobId: string) {
    const definition = this.getQueueDefinition(queueName);
    const queue = this.queues[queueName];
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('Không tìm thấy job');
    }

    const [state, jobLogs] = await Promise.all([
      job.getState(),
      queue.getJobLogs(jobId, 0, 99, false),
    ]);

    return {
      ...this.toJobListItem(job, definition, state),
      payload: job.data,
      returnValue: job.returnvalue,
      options: job.opts,
      delay: job.delay,
      stacktrace: job.stacktrace ?? [],
      logs: jobLogs.logs,
      logCount: jobLogs.count,
    };
  }

  private async getQueueSnapshot(definition: QueueDefinition) {
    const queue = this.queues[definition.name];
    const [
      rawCounts,
      oldestWaitingJobs,
      completedJobs,
      failedJobs,
      completedHistoryJobs,
      failedHistoryJobs,
      workerCount,
    ] = await Promise.all([
      queue.getJobCounts('waiting', 'active', 'delayed', 'completed', 'failed'),
      queue.getWaiting(0, 0),
      queue.getCompleted(0, COMPLETED_SAMPLE_SIZE - 1),
      queue.getFailed(0, RECENT_FAILURE_LIMIT - 1),
      queue.getCompleted(0, HISTORY_SAMPLE_SIZE - 1),
      queue.getFailed(0, HISTORY_SAMPLE_SIZE - 1),
      queue.getWorkersCount(),
    ]);
    const counts: QueueCounts = {
      waiting: rawCounts.waiting ?? 0,
      active: rawCounts.active ?? 0,
      delayed: rawCounts.delayed ?? 0,
      completed: rawCounts.completed ?? 0,
      failed: rawCounts.failed ?? 0,
    };
    const durations = completedJobs
      .map((job) => this.getDuration(job))
      .filter((duration): duration is number => duration !== null)
      .sort((left, right) => left - right);
    const oldestWaitingJob = oldestWaitingJobs[0];
    const oldestWaitingAgeMs = oldestWaitingJob
      ? Math.max(0, Date.now() - oldestWaitingJob.timestamp)
      : null;
    const retries = [...completedHistoryJobs, ...failedHistoryJobs].reduce(
      (total, job) => total + Math.max(0, job.attemptsMade - 1),
      0,
    );
    const totalFinished = counts.completed + counts.failed;

    return {
      name: definition.name,
      label: definition.label,
      businessGroup: definition.businessGroup,
      concurrency: definition.concurrency,
      workers: workerCount,
      counts,
      oldestWaitingAgeMs,
      averageDurationMs: this.getAverage(durations),
      p95DurationMs: this.getPercentile(durations, 95),
      retries,
      failureRate:
        totalFinished > 0
          ? Number(((counts.failed / totalFinished) * 100).toFixed(2))
          : 0,
      isCongested:
        counts.waiting >= WAITING_ALERT_COUNT ||
        (oldestWaitingAgeMs !== null &&
          oldestWaitingAgeMs >= WAITING_ALERT_AGE_MS),
      recentFailures: failedJobs.map((job) =>
        this.toFailureItem(job, definition),
      ),
      historyJobs: [
        ...completedHistoryJobs.map((job) => ({
          state: 'completed' as const,
          finishedAt: job.finishedOn ?? job.timestamp,
        })),
        ...failedHistoryJobs.map((job) => ({
          state: 'failed' as const,
          finishedAt: job.finishedOn ?? job.timestamp,
        })),
      ],
    };
  }

  private toFailureItem(job: Job<QueueJobData>, definition: QueueDefinition) {
    return {
      queueName: definition.name,
      queueLabel: definition.label,
      jobId: String(job.id),
      jobName: job.name,
      failedAt: new Date(job.finishedOn ?? job.timestamp).toISOString(),
      reason: this.truncate(job.failedReason || 'Không có lý do lỗi', 180),
      attemptsMade: job.attemptsMade,
    };
  }

  private toJobListItem(
    job: Job<QueueJobData>,
    definition: QueueDefinition,
    providedState?: string,
  ) {
    const data = job.data;
    return {
      queueName: definition.name,
      queueLabel: definition.label,
      businessGroup: definition.businessGroup,
      jobId: String(job.id),
      jobName: job.name,
      state: providedState ?? 'unknown',
      identifiers: {
        userId: this.getIdentifier(data, 'userId'),
        cvId: this.getIdentifier(data, 'cvId'),
        sessionId: this.getIdentifier(data, 'sessionId'),
        analysisId: this.getIdentifier(data, 'analysisId'),
      },
      createdAt: new Date(job.timestamp).toISOString(),
      processedAt: job.processedOn
        ? new Date(job.processedOn).toISOString()
        : null,
      finishedAt: job.finishedOn
        ? new Date(job.finishedOn).toISOString()
        : null,
      durationMs: this.getDuration(job),
      progress: job.progress,
      attemptsMade: job.attemptsMade,
      attemptsAllowed: job.opts.attempts ?? 1,
      failedReason: job.failedReason ?? null,
    };
  }

  private getStates(state?: QueueJobState): JobType[] {
    if (!state || state === QueueJobState.ALL) {
      return ['waiting', 'active', 'delayed', 'completed', 'failed'];
    }
    return [state];
  }

  private getQueueDefinition(queueName: QueueName) {
    const definition = QUEUE_DEFINITIONS.find(
      (queue) => queue.name === queueName,
    );
    if (!definition) throw new NotFoundException('Không tìm thấy queue');
    return definition;
  }

  private getIdentifier(data: Record<string, unknown>, key: string) {
    const value = data?.[key];
    return typeof value === 'string' ? value : null;
  }

  private getDuration(job: Job<QueueJobData>) {
    if (!job.processedOn || !job.finishedOn) return null;
    return Math.max(0, job.finishedOn - job.processedOn);
  }

  private getAverage(values: number[]) {
    if (!values.length) return null;
    return Math.round(
      values.reduce((total, value) => total + value, 0) / values.length,
    );
  }

  private getPercentile(values: number[], percentile: number) {
    if (!values.length) return null;
    const index = Math.min(
      values.length - 1,
      Math.ceil((percentile / 100) * values.length) - 1,
    );
    return values[index];
  }

  private mergeHistory(
    jobs: Array<{ state: 'completed' | 'failed'; finishedAt: number }>,
    bucket: QueueChartBucket,
  ) {
    const numberOfBuckets = bucket === QueueChartBucket.HOUR ? 24 : 14;
    const buckets = this.createBuckets(bucket, numberOfBuckets);
    const history = new Map(
      buckets.map((date) => [date, { date, completed: 0, failed: 0 }]),
    );

    jobs.forEach((job) => {
      const key = this.toBucketKey(new Date(job.finishedAt), bucket);
      const point = history.get(key);
      if (point) point[job.state] += 1;
    });

    return [...history.values()];
  }

  private createBuckets(bucket: QueueChartBucket, count: number) {
    const result: string[] = [];
    const cursor = new Date();
    cursor.setMinutes(0, 0, 0);
    if (bucket === QueueChartBucket.DAY) cursor.setHours(0, 0, 0, 0);

    for (let index = count - 1; index >= 0; index -= 1) {
      const date = new Date(cursor);
      if (bucket === QueueChartBucket.HOUR)
        date.setHours(date.getHours() - index);
      else date.setDate(date.getDate() - index);
      result.push(this.toBucketKey(date, bucket));
    }
    return result;
  }

  private toBucketKey(date: Date, bucket: QueueChartBucket) {
    const iso = date.toISOString();
    return bucket === QueueChartBucket.HOUR
      ? `${iso.slice(0, 13)}:00:00.000Z`
      : `${iso.slice(0, 10)}T00:00:00.000Z`;
  }

  private jobMatchesSearch(
    job: ReturnType<OperateSystemService['toJobListItem']>,
    search: string,
  ) {
    return [
      job.jobId,
      job.jobName,
      job.queueName,
      job.identifiers.userId,
      job.identifiers.cvId,
      job.identifiers.sessionId,
      job.identifiers.analysisId,
    ].some((value) => value?.toLowerCase().includes(search));
  }

  private truncate(value: string, maxLength: number) {
    return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
  }

  private withTimeout<T>(operation: Promise<T>) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(
          new ServiceUnavailableException(
            'Queue không phản hồi trong 5 giây. Hãy kiểm tra Redis và worker.',
          ),
        );
      }, QUEUE_OPERATION_TIMEOUT_MS);
    });

    return Promise.race([operation, timeout]).finally(() => {
      if (timer) clearTimeout(timer);
    });
  }
}
