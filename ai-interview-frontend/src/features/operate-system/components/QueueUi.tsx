"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";
import type {
  QueueJobDetail,
  QueueJobState,
} from "../types/queue-operations.types";

const STATE_LABELS: Record<Exclude<QueueJobState, "all">, string> = {
  waiting: "Đang chờ",
  active: "Đang chạy",
  delayed: "Trì hoãn",
  completed: "Hoàn tất",
  failed: "Thất bại",
};

export const QueueStateBadge = ({ state }: { state: string }) => {
  const normalizedState = state as Exclude<QueueJobState, "all">;
  const isActive = normalizedState === "active";
  const isFailed = normalizedState === "failed";

  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-sm px-2 text-xs font-semibold",
        isActive
          ? "bg-primary text-on-primary"
          : "bg-bg-surface text-text-primary",
        isFailed && "border border-border-hairline-strong",
      )}
    >
      {STATE_LABELS[normalizedState] ?? state}
    </span>
  );
};

export const EmptyQueueState = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-dashed border-border-hairline bg-bg-surface-soft px-5 py-10 text-center text-sm text-text-secondary">
    {message}
  </div>
);

const formatJson = (value: unknown) => {
  const result = JSON.stringify(value, null, 2);
  return result ?? "Không có dữ liệu";
};

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
      {label}
    </dt>
    <dd className="mt-1 break-all text-sm text-text-primary">{value ?? "—"}</dd>
  </div>
);

type QueueJobDetailDrawerProps = {
  job: QueueJobDetail | undefined;
  isLoading: boolean;
  error: boolean;
  onClose: () => void;
};

export const QueueJobDetailDrawer = ({
  job,
  isLoading,
  error,
  onClose,
}: QueueJobDetailDrawerProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        aria-label="Đóng chi tiết job"
        className="absolute inset-0 cursor-default bg-text-primary/20"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="queue-job-dialog-title"
        onKeyDown={handleKeyDown}
        className="relative h-full w-full max-w-2xl overflow-y-auto border-l border-border-hairline bg-bg-canvas p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-hairline pb-5">
          <div>
            <p className="text-sm font-semibold text-primary">
              Chi tiết tác vụ
            </p>
            <h2
              id="queue-job-dialog-title"
              className="mt-1 text-xl font-bold text-text-primary"
            >
              {job?.jobName ?? "Đang tải job"}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-border-hairline text-text-primary transition-colors hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {isLoading ? (
          <p className="py-10 text-sm text-text-secondary" aria-busy="true">
            Đang tải chi tiết job...
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="py-10 text-sm text-text-secondary">
            Không thể tải chi tiết job này.
          </p>
        ) : null}
        {job ? (
          <div className="space-y-7 py-6">
            <section>
              <div className="flex flex-wrap items-center gap-2">
                <QueueStateBadge state={job.state} />
                <span className="text-sm text-text-secondary">
                  {job.queueLabel}
                </span>
              </div>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <DetailField label="Job ID" value={job.jobId} />
                <DetailField label="Queue" value={job.queueName} />
                <DetailField label="User ID" value={job.identifiers.userId} />
                <DetailField label="CV ID" value={job.identifiers.cvId} />
                <DetailField
                  label="Session ID"
                  value={job.identifiers.sessionId}
                />
                <DetailField
                  label="Analysis ID"
                  value={job.identifiers.analysisId}
                />
                <DetailField
                  label="Tạo lúc"
                  value={formatDateTime(job.createdAt)}
                />
                <DetailField
                  label="Bắt đầu"
                  value={formatDateTime(job.processedAt)}
                />
                <DetailField
                  label="Hoàn tất"
                  value={formatDateTime(job.finishedAt)}
                />
                <DetailField
                  label="Thời gian xử lý"
                  value={formatDuration(job.durationMs)}
                />
                <DetailField
                  label="Attempts"
                  value={`${job.attemptsMade} / ${job.attemptsAllowed}`}
                />
                <DetailField
                  label="Progress"
                  value={
                    typeof job.progress === "object"
                      ? formatJson(job.progress)
                      : String(job.progress ?? "—")
                  }
                />
              </dl>
            </section>

            <DetailJson title="Payload (đầy đủ)" value={job.payload} />
            <DetailJson title="Return value" value={job.returnValue} />
            <DetailJson title="Options" value={job.options} />
            {job.failedReason ? (
              <DetailJson title="Lý do lỗi" value={job.failedReason} />
            ) : null}
            {job.stacktrace.length ? (
              <DetailJson title="Stack trace" value={job.stacktrace} />
            ) : null}
            {job.logs.length ? (
              <DetailJson title={`Logs (${job.logCount})`} value={job.logs} />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const DetailJson = ({ title, value }: { title: string; value: unknown }) => (
  <section>
    <h3 className="text-sm font-bold text-text-primary">{title}</h3>
    <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border-hairline bg-bg-surface-soft p-4 text-xs leading-5 text-text-primary">
      {formatJson(value)}
    </pre>
  </section>
);

export const formatDuration = (durationMs: number | null) => {
  if (durationMs === null) return "—";
  if (durationMs < 1000) return `${durationMs} ms`;
  if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)} giây`;
  return `${Math.floor(durationMs / 60000)} phút ${Math.floor((durationMs % 60000) / 1000)} giây`;
};

export const formatDateTime = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date(date))
    : "—";
