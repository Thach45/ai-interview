import { AdminLayout } from '../../layouts/AdminLayout';

type PreviewItem = { label: string; description: string; icon: string };

type AdminPreviewPageProps = {
  title: string;
  description: string;
  groupLabel: string;
  items: PreviewItem[];
};

export const AdminPreviewPage = ({ title, description, groupLabel, items }: AdminPreviewPageProps) => (
  <AdminLayout title={title}>
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-primary">{groupLabel}</p>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">{title}</h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">{description}</p>
      </header>
      <section aria-labelledby="preview-heading" className="rounded-lg border border-border-hairline bg-bg-canvas shadow-sm">
        <div className="border-b border-border-hairline px-6 py-5">
          <h2 id="preview-heading" className="text-lg font-bold text-text-primary">Khu vực quản trị</h2>
          <p className="mt-1 text-sm text-text-secondary">Giao diện đã sẵn sàng; dữ liệu và thao tác sẽ được kết nối ở bước tiếp theo.</p>
        </div>
        <div className="grid gap-px bg-border-hairline sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.label} className="min-h-44 bg-bg-canvas p-6">
              <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="mt-5 text-base font-bold text-text-primary">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  </AdminLayout>
);
