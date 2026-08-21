'use client';

import { AdminLayout } from '../../layouts/AdminLayout';
import type { DependencyStatus } from '../../features/system/api/systemHealth.api';
import { useSystemHealth } from '../../features/system/hooks/useSystemHealth';

const statusContent: Record<DependencyStatus, { label: string; className: string }> = {
  up: { label: 'Hoạt động', className: 'bg-primary/10 text-primary' },
  down: { label: 'Không phản hồi', className: 'bg-bg-surface text-text-primary' },
  not_configured: { label: 'Chưa cấu hình', className: 'bg-bg-surface text-text-secondary' },
};

const formatUptime = (uptimeSeconds: number) => {
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  return `${hours} giờ ${minutes} phút`;
};

type ServiceCardProps = {
  name: string;
  description: string;
  icon: string;
  status: DependencyStatus;
  responseTimeMs?: number;
};

const ServiceCard = ({ name, description, icon, status, responseTimeMs }: ServiceCardProps) => {
  const content = statusContent[status];

  return (
    <article className="rounded-lg border border-border-hairline bg-bg-canvas p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <span className={`rounded-md px-3 py-1 text-xs font-bold ${content.className}`}>{content.label}</span>
      </div>
      <h2 className="mt-6 text-base font-bold text-text-primary">{name}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
      <p className="mt-5 text-sm font-semibold text-text-primary">
        {typeof responseTimeMs === 'number' ? `${responseTimeMs} ms phản hồi` : 'Chưa có độ trễ'}
      </p>
    </article>
  );
};

export const AdminSystemStatusPage = () => {
  const { data: health, error, isLoading, refetch, isFetching } = useSystemHealth();

  return (
    <AdminLayout
      title="Tình trạng hệ thống"
      rightAction={
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="min-h-10 rounded-md bg-primary px-4 text-sm font-bold text-on-primary transition-colors hover:bg-primary-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFetching ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
        </button>
      }
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold text-primary">Vận hành hệ thống</p>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Tình trạng hệ thống</h1>
          <p className="mt-3 text-base leading-7 text-text-secondary">Kiểm tra trực tiếp sức khỏe API, MongoDB và Redis. Dữ liệu tự làm mới mỗi 30 giây.</p>
        </header>

        {error ? (
          <section role="alert" className="rounded-lg border border-border-hairline bg-bg-surface p-6">
            <h2 className="text-base font-bold text-text-primary">Không thể kiểm tra hệ thống</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">Endpoint health không phản hồi. Hãy kiểm tra backend và kết nối mạng trước.</p>
          </section>
        ) : null}

        {isLoading ? (
          <section aria-busy="true" className="rounded-lg border border-border-hairline bg-bg-canvas p-8 text-sm text-text-secondary">Đang kiểm tra các dịch vụ...</section>
        ) : health ? (
          <>
            <section className="rounded-lg border border-border-hairline bg-bg-canvas p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Trạng thái tổng thể: {health.status === 'ok' ? 'Ổn định' : 'Cần chú ý'}</h2>
                  <p className="mt-1 text-sm text-text-secondary">Cập nhật lúc {new Date(health.timestamp).toLocaleTimeString('vi-VN')} · Uptime {formatUptime(health.uptimeSeconds)}</p>
                </div>
                <p className="text-sm font-semibold text-text-primary">Health check {health.responseTimeMs} ms</p>
              </div>
            </section>
            <section aria-label="Các dịch vụ" className="grid gap-4 md:grid-cols-3">
              <ServiceCard name="API backend" description="NestJS API phục vụ toàn bộ luồng sản phẩm." icon="api" status={health.services.api.status} />
              <ServiceCard name="MongoDB" description="Cơ sở dữ liệu chính của Arion." icon="database" status={health.services.database.status} responseTimeMs={health.services.database.responseTimeMs} />
              <ServiceCard name="Redis" description="Hàng đợi BullMQ, cache và tác vụ nền." icon="memory" status={health.services.redis.status} responseTimeMs={health.services.redis.responseTimeMs} />
            </section>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
};
