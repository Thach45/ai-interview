"use client";

import { useMemo, useRef, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import {
  EmptyQueueState,
  formatDateTime,
  formatDuration,
  QueueJobDetailDrawer,
  QueueStateBadge,
} from "../../features/operate-system/components/QueueUi";
import {
  useQueueJobDetail,
  useQueueJobs,
  useQueueOverview,
} from "../../features/operate-system/hooks/useQueueOperations";
import type {
  QueueChartBucket,
  QueueJob,
  QueueJobState,
  QueueSummary,
} from "../../features/operate-system/types/queue-operations.types";

const PAGE_LIMIT = 20;
const BUSINESS_GROUPS = ["CV", "Interview", "Email", "Notification"] as const;
const sections = [
  { id: "monitor", label: "Theo dõi queue" },
  { id: "history", label: "Lịch sử & lỗi" },
  { id: "jobs", label: "Tra cứu job" },
] as const;
const stateOptions: Array<{ value: QueueJobState; label: string }> = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "waiting", label: "Đang chờ" },
  { value: "active", label: "Đang chạy" },
  { value: "delayed", label: "Trì hoãn" },
  { value: "completed", label: "Hoàn tất" },
  { value: "failed", label: "Thất bại" },
];

type DashboardSection = (typeof sections)[number]["id"];
type SelectedJob = Pick<QueueJob, "queueName" | "jobId">;

const formatCount = (count: number) =>
  new Intl.NumberFormat("vi-VN").format(count);

const QueueMetric = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) => (
  <div className="min-w-0 px-4 py-4 first:pl-0 last:pr-0">
    <dt className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
      <span
        className="material-symbols-outlined text-base text-text-tertiary"
        aria-hidden="true"
      >
        {icon}
      </span>
      {label}
    </dt>
    <dd className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
      {value}
    </dd>
  </div>
);

const QueueSummaryStrip = ({
  totals,
}: {
  totals: {
    waiting: number;
    active: number;
    delayed: number;
    completed: number;
    failed: number;
    retries: number;
    failureRate: number;
  };
}) => (
  <section
    aria-label="Tóm tắt trạng thái queue"
    className="rounded-lg border border-border-hairline bg-bg-canvas px-5 shadow-sm"
  >
    <dl className="grid divide-y divide-border-hairline sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-5">
      <QueueMetric
        label="Đang chờ"
        value={formatCount(totals.waiting)}
        icon="schedule"
      />
      <QueueMetric
        label="Đang chạy"
        value={formatCount(totals.active)}
        icon="play_circle"
      />
      <QueueMetric
        label="Trì hoãn"
        value={formatCount(totals.delayed)}
        icon="event"
      />
      <QueueMetric
        label="Hoàn tất"
        value={formatCount(totals.completed)}
        icon="task_alt"
      />
      <QueueMetric
        label="Thất bại"
        value={`${formatCount(totals.failed)} · ${totals.failureRate}%`}
        icon="error"
      />
    </dl>
  </section>
);

const QueueSignal = ({
  congestedQueues,
  retryCount,
}: {
  congestedQueues: Array<{
    name: string;
    label: string;
    waiting: number;
    oldestWaitingAgeMs: number | null;
  }>;
  retryCount: number;
}) => (
  <section
    className="grid gap-4 rounded-lg border border-border-hairline bg-bg-surface-soft p-5 lg:grid-cols-[minmax(0,1fr)_auto]"
    aria-labelledby="queue-signal-title"
  >
    <div className="flex gap-3">
      <span
        className="material-symbols-outlined mt-0.5 text-xl text-primary"
        aria-hidden="true"
      >
        monitoring
      </span>
      <div>
        <h2 id="queue-signal-title" className="font-bold text-text-primary">
          {congestedQueues.length
            ? "Có queue cần xử lý"
            : "Queue đang vận hành ổn định"}
        </h2>
        {congestedQueues.length ? (
          <ul className="mt-2 space-y-1 text-sm leading-6 text-text-secondary">
            {congestedQueues.map((queue) => (
              <li key={queue.name}>
                <span className="font-semibold text-text-primary">
                  {queue.label}
                </span>
                : {formatCount(queue.waiting)} job chờ, lâu nhất{" "}
                {formatDuration(queue.oldestWaitingAgeMs)}.
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Không queue nào vượt ngưỡng chờ hoặc tuổi job cho phép.
          </p>
        )}
      </div>
    </div>
    <div className="border-t border-border-hairline pt-4 text-sm lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
      <p className="text-text-tertiary">Retry trong mẫu lịch sử</p>
      <p className="mt-1 text-xl font-bold text-text-primary">
        {formatCount(retryCount)}
      </p>
    </div>
  </section>
);

const QueueDetail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs text-text-tertiary">{label}</dt>
    <dd className="mt-1 font-semibold text-text-primary">{value}</dd>
  </div>
);

const QueueGroupCard = ({
  group,
  queues,
}: {
  group: string;
  queues: QueueSummary[];
}) => (
  <section className="overflow-hidden rounded-lg border border-border-hairline bg-bg-canvas shadow-sm">
    <header className="flex items-baseline justify-between border-b border-border-hairline px-5 py-4">
      <h2 className="text-base font-bold text-text-primary">{group}</h2>
      <span className="text-sm text-text-tertiary">{queues.length} queue</span>
    </header>
    <div className="divide-y divide-border-hairline">
      {queues.map((queue) => (
        <article key={queue.name} className="px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary">
                  {queue.label}
                </h3>
                {queue.isCongested ? (
                  <span className="rounded-sm border border-border-hairline-strong px-2 py-0.5 text-xs font-semibold text-text-primary">
                    Cần chú ý
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-text-tertiary">
                {queue.workers} worker · concurrency {queue.concurrency}
              </p>
            </div>
            <p className="text-sm font-semibold text-text-primary">
              {formatCount(queue.counts.waiting)} chờ
            </p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
            <QueueDetail
              label="Chạy / trì hoãn"
              value={`${formatCount(queue.counts.active)} / ${formatCount(queue.counts.delayed)}`}
            />
            <QueueDetail
              label="Chờ lâu nhất"
              value={formatDuration(queue.oldestWaitingAgeMs)}
            />
            <QueueDetail
              label="Trung bình / p95"
              value={`${formatDuration(queue.averageDurationMs)} / ${formatDuration(queue.p95DurationMs)}`}
            />
            <QueueDetail
              label="Lỗi / retry"
              value={`${queue.failureRate}% / ${formatCount(queue.retries)}`}
            />
          </dl>
        </article>
      ))}
    </div>
  </section>
);

const QueueHistoryChart = ({
  bucket,
  data,
  onBucketChange,
}: {
  bucket: QueueChartBucket;
  data: Array<{ date: string; completed: number; failed: number }>;
  onBucketChange: (bucket: QueueChartBucket) => void;
}) => {
  const maximum = Math.max(
    1,
    ...data.flatMap((point) => [point.completed, point.failed]),
  );
  return (
    <section className="rounded-lg border border-border-hairline bg-bg-canvas p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Lịch sử xử lý</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Khối đậm là job hoàn tất; khối nhạt là job thất bại.
          </p>
        </div>
        <div
          className="inline-flex self-start rounded-md border border-border-hairline p-1"
          aria-label="Khoảng thời gian biểu đồ"
        >
          {(["hour", "day"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={bucket === value}
              onClick={() => onBucketChange(value)}
              className={`min-h-9 rounded-sm px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${bucket === value ? "bg-primary text-on-primary" : "text-text-secondary hover:bg-bg-surface"}`}
            >
              {value === "hour" ? "24 giờ" : "14 ngày"}
            </button>
          ))}
        </div>
      </div>
      {data.some((point) => point.completed || point.failed) ? (
        <div
          className="mt-8 grid h-56 grid-flow-col auto-cols-fr items-end gap-1 border-b border-border-hairline"
          aria-label="Biểu đồ lịch sử job"
        >
          {data.map((point) => (
            <div
              key={point.date}
              className="group relative flex h-full min-w-0 items-end justify-center gap-0.5"
            >
              <span
                className="w-1/2 rounded-t-sm bg-primary"
                style={{ height: `${(point.completed / maximum) * 100}%` }}
              />
              <span
                className="w-1/2 rounded-t-sm bg-text-tertiary"
                style={{ height: `${(point.failed / maximum) * 100}%` }}
              />
              <span className="pointer-events-none absolute bottom-full z-10 mb-2 hidden w-44 rounded-sm border border-border-hairline bg-bg-canvas p-2 text-center text-xs text-text-primary shadow-sm group-hover:block">
                {formatDateTime(point.date)}
                <br />
                {point.completed} hoàn tất · {point.failed} lỗi
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyQueueState message="Chưa có job hoàn tất hoặc thất bại trong khoảng thời gian này." />
        </div>
      )}
    </section>
  );
};

const RecentFailures = ({
  failures,
}: {
  failures: Array<{
    queueName: string;
    queueLabel: string;
    jobId: string;
    jobName: string;
    failedAt: string;
    reason: string;
    attemptsMade: number;
  }>;
}) => (
  <section className="overflow-hidden rounded-lg border border-border-hairline bg-bg-canvas shadow-sm">
    <header className="border-b border-border-hairline px-5 py-4">
      <h2 className="text-lg font-bold text-text-primary">Lỗi gần đây</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Mở Tra cứu job để xem payload và stack trace đầy đủ.
      </p>
    </header>
    {failures.length ? (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-bg-surface-soft text-xs uppercase tracking-wide text-text-tertiary">
            <tr>
              <th className="px-5 py-3">Queue</th>
              <th className="px-5 py-3">Job</th>
              <th className="px-5 py-3">Thời gian</th>
              <th className="px-5 py-3">Lý do</th>
              <th className="px-5 py-3">Attempts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {failures.map((failure) => (
              <tr key={`${failure.queueName}-${failure.jobId}`}>
                <td className="px-5 py-4 font-semibold text-text-primary">
                  {failure.queueLabel}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {failure.jobName}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {formatDateTime(failure.failedAt)}
                </td>
                <td
                  className="max-w-sm truncate px-5 py-4 text-text-secondary"
                  title={failure.reason}
                >
                  {failure.reason}
                </td>
                <td className="px-5 py-4 text-text-secondary">
                  {failure.attemptsMade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <EmptyQueueState message="Chưa ghi nhận job thất bại gần đây." />
    )}
  </section>
);

const JobLookup = ({
  queues,
  state,
  queueName,
  searchInput,
  jobs,
  isLoading,
  isError,
  onStateChange,
  onQueueChange,
  onSearchInputChange,
  onSearch,
  onSelectJob,
  onPreviousPage,
  onNextPage,
}: {
  queues: QueueSummary[];
  state: QueueJobState;
  queueName: string;
  searchInput: string;
  jobs: ReturnType<typeof useQueueJobs>["data"];
  isLoading: boolean;
  isError: boolean;
  onStateChange: (value: QueueJobState) => void;
  onQueueChange: (value: string) => void;
  onSearchInputChange: (value: string) => void;
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  onSelectJob: (job: QueueJob, target: HTMLButtonElement) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) => (
  <section className="overflow-hidden rounded-lg border border-border-hairline bg-bg-canvas shadow-sm">
    <header className="border-b border-border-hairline px-5 py-5">
      <h2 className="text-lg font-bold text-text-primary">Tra cứu job</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Tìm theo user ID, CV ID, session ID hoặc job ID. Dữ liệu chỉ tải khi bạn
        mở mục này.
      </p>
      <form
        className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
        onSubmit={onSearch}
      >
        <label className="relative block">
          <span className="sr-only">Tìm job</span>
          <span
            className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            aria-hidden="true"
          >
            search
          </span>
          <input
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="User ID, CV ID, session ID hoặc job ID"
            className="min-h-11 w-full rounded-md border border-border-hairline bg-bg-canvas py-2 pl-10 pr-3 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <label>
          <span className="sr-only">Queue</span>
          <select
            value={queueName}
            onChange={(event) => onQueueChange(event.target.value)}
            className="min-h-11 w-full rounded-md border border-border-hairline bg-bg-canvas px-3 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Mọi queue</option>
            {queues.map((queue) => (
              <option key={queue.name} value={queue.name}>
                {queue.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Trạng thái job</span>
          <select
            value={state}
            onChange={(event) =>
              onStateChange(event.target.value as QueueJobState)
            }
            className="min-h-11 w-full rounded-md border border-border-hairline bg-bg-canvas px-3 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {stateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-md bg-primary px-4 text-sm font-bold text-on-primary transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Tìm job
        </button>
      </form>
    </header>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="bg-bg-surface-soft text-xs uppercase tracking-wide text-text-tertiary">
          <tr>
            <th className="px-5 py-3">Job</th>
            <th className="px-5 py-3">Queue</th>
            <th className="px-5 py-3">Trạng thái</th>
            <th className="px-5 py-3">Định danh</th>
            <th className="px-5 py-3">Tạo lúc</th>
            <th className="px-5 py-3">Attempts</th>
            <th className="px-5 py-3">
              <span className="sr-only">Chi tiết</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-hairline">
          {isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-text-secondary"
                aria-busy="true"
              >
                Đang tải danh sách job...
              </td>
            </tr>
          ) : null}
          {isError ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-text-secondary"
                role="alert"
              >
                Không thể tải danh sách job.
              </td>
            </tr>
          ) : null}
          {jobs && !jobs.items.length ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-text-secondary"
              >
                Không có job phù hợp.
              </td>
            </tr>
          ) : null}
          {jobs?.items.map((job) => (
            <tr
              key={`${job.queueName}-${job.jobId}`}
              className="transition-colors hover:bg-bg-surface-soft"
            >
              <td className="px-5 py-4">
                <p className="font-semibold text-text-primary">{job.jobName}</p>
                <p className="mt-1 max-w-48 truncate font-mono text-xs text-text-tertiary">
                  {job.jobId}
                </p>
              </td>
              <td className="px-5 py-4 text-text-secondary">
                {job.queueLabel}
              </td>
              <td className="px-5 py-4">
                <QueueStateBadge state={job.state} />
              </td>
              <td className="px-5 py-4">
                <p className="max-w-48 truncate text-text-secondary">
                  {job.identifiers.userId ??
                    job.identifiers.cvId ??
                    job.identifiers.sessionId ??
                    "—"}
                </p>
              </td>
              <td className="px-5 py-4 text-text-secondary">
                {formatDateTime(job.createdAt)}
              </td>
              <td className="px-5 py-4 text-text-secondary">
                {job.attemptsMade} / {job.attemptsAllowed}
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={(event) => onSelectJob(job, event.currentTarget)}
                  className="min-h-10 rounded-md border border-border-hairline px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {jobs ? (
      <footer className="flex flex-col gap-3 border-t border-border-hairline px-5 py-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>
          Hiển thị{" "}
          {jobs.pagination.totalItems
            ? (jobs.pagination.page - 1) * jobs.pagination.limit + 1
            : 0}
          –
          {Math.min(
            jobs.pagination.page * jobs.pagination.limit,
            jobs.pagination.totalItems,
          )}{" "}
          / {formatCount(jobs.pagination.totalItems)} job
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPreviousPage}
            disabled={jobs.pagination.page === 1}
            className="min-h-10 rounded-md border border-border-hairline px-3 font-semibold text-text-primary transition-colors hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>
          <span className="inline-flex min-h-10 items-center px-2">
            Trang {jobs.pagination.page} / {jobs.pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={onNextPage}
            disabled={jobs.pagination.page === jobs.pagination.totalPages}
            className="min-h-10 rounded-md border border-border-hairline px-3 font-semibold text-text-primary transition-colors hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </footer>
    ) : null}
  </section>
);

export const AdminQueueOperationsPage = () => {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("monitor");
  const [bucket, setBucket] = useState<QueueChartBucket>("hour");
  const [queueName, setQueueName] = useState("");
  const [state, setState] = useState<QueueJobState>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const overviewQuery = useQueueOverview(bucket);
  const jobsQuery = useQueueJobs(
    {
      queueName: queueName || undefined,
      state,
      search: search || undefined,
      page,
      limit: PAGE_LIMIT,
    },
    activeSection === "jobs",
  );
  const detailQuery = useQueueJobDetail(
    selectedJob?.queueName ?? null,
    selectedJob?.jobId ?? null,
  );
  const overview = overviewQuery.data;
  const jobs = jobsQuery.data;
  const groupedQueues = useMemo(() => {
    const queues = overview?.queues ?? [];
    return BUSINESS_GROUPS.map((group) => ({
      group,
      queues: queues.filter((queue) => queue.businessGroup === group),
    }));
  }, [overview?.queues]);
  const resetPage = () => setPage(1);
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    resetPage();
  };
  const handleRefresh = () => {
    void overviewQuery.refetch();
    if (activeSection === "jobs") void jobsQuery.refetch();
  };
  const closeDetail = () => {
    setSelectedJob(null);
    window.requestAnimationFrame(() => detailTriggerRef.current?.focus());
  };
  const selectJob = (job: QueueJob, target: HTMLButtonElement) => {
    detailTriggerRef.current = target;
    setSelectedJob({ queueName: job.queueName, jobId: job.jobId });
  };

  return (
    <AdminLayout
      title="Tác vụ nền / Queue"
      rightAction={
        <button
          type="button"
          onClick={handleRefresh}
          disabled={
            overviewQuery.isFetching ||
            (activeSection === "jobs" && jobsQuery.isFetching)
          }
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-on-primary transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            className="material-symbols-outlined text-lg"
            aria-hidden="true"
          >
            refresh
          </span>
          Làm mới
        </button>
      }
    >
      <div className="space-y-6">
        <header className="flex flex-col gap-3 border-b border-border-hairline pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Vận hành hệ thống
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-primary">
              Tác vụ nền
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Ưu tiên queue cần xử lý trước, sau đó mới đi vào hiệu năng, lỗi và
              từng job.
            </p>
          </div>
          {overview ? (
            <p className="text-sm text-text-tertiary">
              Cập nhật {formatDateTime(overview.generatedAt)}
            </p>
          ) : null}
        </header>
        <nav
          className="border-b border-border-hairline"
          aria-label="Nội dung vận hành queue"
        >
          <div
            className="flex gap-5 overflow-x-auto"
            role="tablist"
            aria-label="Chuyển khu vực quản lý queue"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                id={`queue-tab-${section.id}`}
                type="button"
                role="tab"
                aria-selected={activeSection === section.id}
                aria-controls={`queue-panel-${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`min-h-11 whitespace-nowrap border-b-2 px-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${activeSection === section.id ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>
        {overviewQuery.isError ? (
          <section
            role="alert"
            className="rounded-lg border border-border-hairline bg-bg-surface p-5 text-sm text-text-secondary"
          >
            Không thể tải dữ liệu queue. Kiểm tra backend, Redis và quyền quản
            trị viên.
          </section>
        ) : null}
        {overviewQuery.isLoading ? (
          <section
            aria-busy="true"
            className="rounded-lg border border-border-hairline bg-bg-canvas p-8 text-sm text-text-secondary"
          >
            Đang tải số liệu queue...
          </section>
        ) : null}
        {overview && activeSection === "monitor" ? (
          <div
            id="queue-panel-monitor"
            role="tabpanel"
            aria-labelledby="queue-tab-monitor"
            className="space-y-6"
          >
            <QueueSummaryStrip totals={overview.totals} />
            <QueueSignal
              congestedQueues={overview.congestedQueues}
              retryCount={overview.totals.retries}
            />
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-text-primary">
                  Queue theo nghiệp vụ
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Chi tiết hiệu năng chỉ nằm ở đây, không trộn vào lỗi hay tra
                  cứu job.
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {groupedQueues.map(({ group, queues }) => (
                  <QueueGroupCard key={group} group={group} queues={queues} />
                ))}
              </div>
            </section>
          </div>
        ) : null}
        {overview && activeSection === "history" ? (
          <div
            id="queue-panel-history"
            role="tabpanel"
            aria-labelledby="queue-tab-history"
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]"
          >
            <QueueHistoryChart
              bucket={bucket}
              data={overview.history}
              onBucketChange={setBucket}
            />
            <RecentFailures failures={overview.recentFailures} />
          </div>
        ) : null}
        {overview && activeSection === "jobs" ? (
          <div
            id="queue-panel-jobs"
            role="tabpanel"
            aria-labelledby="queue-tab-jobs"
          >
            <JobLookup
              queues={overview.queues}
              state={state}
              queueName={queueName}
              searchInput={searchInput}
              jobs={jobs}
              isLoading={jobsQuery.isLoading}
              isError={jobsQuery.isError}
              onStateChange={(value) => {
                setState(value);
                resetPage();
              }}
              onQueueChange={(value) => {
                setQueueName(value);
                resetPage();
              }}
              onSearchInputChange={setSearchInput}
              onSearch={handleSearch}
              onSelectJob={selectJob}
              onPreviousPage={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              onNextPage={() =>
                setPage((current) =>
                  Math.min(jobs?.pagination.totalPages ?? current, current + 1),
                )
              }
            />
          </div>
        ) : null}
      </div>
      {selectedJob ? (
        <QueueJobDetailDrawer
          job={detailQuery.data}
          isLoading={detailQuery.isLoading}
          error={detailQuery.isError}
          onClose={closeDetail}
        />
      ) : null}
    </AdminLayout>
  );
};
