import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Grid2X2,
  Layers3,
  LayoutList,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { useCvTemplatesClient } from '../../features/cvs/hooks/useCvTemplatesClient';

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ats', label: 'Chuẩn ATS' },
  { id: 'modern', label: 'Hiện đại' },
];

const templateMeta = [
  { label: 'ATS ready', icon: CheckCircle2 },
  { label: 'AI content', icon: Sparkles },
  { label: 'PDF export', icon: FileText },
];

const readinessItems = [
  { label: 'Bố cục ưu tiên nội dung', value: 'High' },
  { label: 'Tương thích ATS', value: 'Ready' },
  { label: 'Phù hợp tối ưu bằng AI', value: 'Yes' },
];

const templateMatchesFilter = (templateName: string, templateId: string, filter: string) => {
  if (filter === 'all') return true;

  const searchable = `${templateName} ${templateId}`.toLowerCase();
  if (filter === 'ats') {
    return ['ats', 'classic', 'standard', 'professional', 'basic', 'simple'].some((token) => searchable.includes(token));
  }

  return ['modern', 'creative', 'premium', 'executive', 'designer'].some((token) => searchable.includes(token));
};

export const CvTemplatesPage: React.FC = () => {
  const router = useRouter();
  const { templates, isLoading } = useCvTemplatesClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesQuery = template.name.toLowerCase().includes(keyword);
      const matchesFilter = templateMatchesFilter(template.name, template.id, activeFilter);

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query, templates]);

  const selectedTemplate = useMemo(() => {
    return filteredTemplates.find((template) => template.id === selectedTemplateId) || filteredTemplates[0] || null;
  }, [filteredTemplates, selectedTemplateId]);

  const totalTemplates = templates.length;

  return (
    <MainLayout hideSearch maxWidth="1440px" className="px-6 lg:px-10 pt-3 pb-12">
      <div className="space-y-6">
        <section className="border-b border-border-hairline pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-[30px] font-bold tracking-tight text-text-primary sm:text-[34px]">
                Chọn giao diện CV để AI dựng hồ sơ ứng tuyển
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-text-secondary">
                Bắt đầu từ một mẫu có cấu trúc rõ, sau đó để AI tinh chỉnh nội dung, từ khóa và cách trình bày theo vị trí ứng tuyển.
              </p>
            </div>

            
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            <div className="overflow-hidden rounded-lg border border-border-hairline bg-white shadow-sm">
              {isLoading ? (
                <div className="p-4">
                  <div className="aspect-[4/5] animate-pulse rounded-md bg-gray-100" />
                  <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="mt-3 h-10 animate-pulse rounded-md bg-gray-100" />
                </div>
              ) : selectedTemplate ? (
                <>
                  <div className="border-b border-border-hairline bg-bg-surface-soft p-3">
                    <div className="relative mx-auto aspect-[4/5] max-h-[520px] overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border-hairline">
                      <img
                        src={selectedTemplate.thumbnailUrl}
                        alt={selectedTemplate.name}
                        className="h-full w-full object-cover object-top"
                        onError={(event) => {
                          const target = event.target as HTMLImageElement;
                          target.src = 'https://placehold.co/640x800/f6f5f4/787671?text=CV+Template';
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-tertiary">Preview đang chọn</p>
                    <h2 className="mt-1 text-[20px] font-bold tracking-tight text-text-primary">{selectedTemplate.name}</h2>
                    <p className="mt-1 text-[13px] leading-5 text-text-secondary">
                      Dùng preview này để đánh giá bố cục trước khi để AI dựng nội dung chi tiết.
                    </p>

                    <button
                      onClick={() => router.push(`/cv-builder/${selectedTemplate.id}`)}
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-[13px] font-bold text-white transition-colors hover:bg-primary-pressed"
                    >
                      Tạo CV với mẫu này
                      <ChevronRight className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="mx-auto size-8 text-text-tertiary" strokeWidth={1.7} />
                  <p className="mt-3 text-[13px] font-medium text-text-secondary">Chọn một mẫu để xem preview.</p>
                </div>
              )}
            </div>

            
          </aside>

          <div className="min-w-0 space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border border-border-hairline bg-white p-3 shadow-sm xl:flex-row xl:items-center xl:justify-between">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.8} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm mẫu CV..."
                  className="h-10 w-full rounded-md border border-border-hairline bg-bg-surface-soft pl-9 pr-3 text-[14px] font-medium text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-primary focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-md border border-border-hairline bg-bg-surface-soft p-1">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`h-8 rounded px-3 text-[12px] font-bold transition-colors ${
                        activeFilter === filter.id
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-text-tertiary hover:text-text-primary'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="flex rounded-md border border-border-hairline bg-bg-surface-soft p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex size-8 items-center justify-center rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary'
                    }`}
                    title="Hiển thị dạng lưới"
                  >
                    <Grid2X2 className="size-4" strokeWidth={1.8} />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`flex size-8 items-center justify-center rounded transition-colors ${
                      viewMode === 'compact' ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary'
                    }`}
                    title="Hiển thị gọn"
                  >
                    <LayoutList className="size-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              {isLoading ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'space-y-2'}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="rounded-md border border-border-hairline bg-white p-1.5 shadow-sm">
                        <div className={viewMode === 'grid' ? 'space-y-2' : 'flex gap-3'}>
                          <div className={`${viewMode === 'grid' ? 'aspect-[4/5] w-full' : 'h-20 w-14'} animate-pulse rounded bg-gray-100`} />
                          <div className="min-w-0 flex-1 space-y-2 py-1">
                            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                            <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-100" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTemplates.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'space-y-2'}>
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate?.id === template.id;

                      return (
                        <article
                          key={template.id}
                          onClick={() => setSelectedTemplateId(template.id)}
                          className={`group cursor-pointer rounded-md border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${
                            isSelected ? 'border-primary ring-2 ring-primary/10' : 'border-border-hairline'
                          } ${viewMode === 'compact' ? 'flex gap-3 p-2' : 'p-1.5'}`}
                        >
                          <div className={`relative shrink-0 overflow-hidden rounded bg-bg-surface ${
                            viewMode === 'compact' ? 'h-20 w-14' : 'aspect-[4/5] w-full'
                          }`}>
                            <img
                              src={template.thumbnailUrl}
                              alt={template.name}
                              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                              onError={(event) => {
                                const target = event.target as HTMLImageElement;
                                target.src = 'https://placehold.co/640x800/f6f5f4/787671?text=CV+Template';
                              }}
                            />
                            <div className="absolute left-1 top-1 rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-text-primary shadow-sm ring-1 ring-border-hairline">
                              ATS
                            </div>
                          </div>

                          <div className={`${viewMode === 'compact' ? 'flex min-w-0 flex-1 flex-col justify-between py-0.5' : 'pt-1.5'}`}>
                            <div>
                              <div className="flex items-start justify-between gap-1.5">
                                <h3 className="min-w-0 truncate text-[11px] font-bold leading-4 text-text-primary">{template.name}</h3>
                                {viewMode === 'grid' && (
                                  <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      router.push(`/cv-builder/${template.id}`);
                                    }}
                                    className="flex size-6 shrink-0 items-center justify-center rounded bg-bg-surface text-text-tertiary transition-colors hover:bg-primary hover:text-white"
                                    title="Dùng mẫu này"
                                  >
                                    <ArrowRight className="size-3" strokeWidth={1.9} />
                                  </button>
                                )}
                              </div>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {templateMeta.slice(0, viewMode === 'grid' ? 1 : 3).map(({ label, icon: Icon }) => (
                                  <span
                                    key={label}
                                    className="inline-flex items-center gap-1 rounded border border-border-hairline bg-bg-surface-soft px-1 py-0.5 text-[9px] font-semibold text-text-tertiary"
                                  >
                                    <Icon className="size-2.5" strokeWidth={1.8} />
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                router.push(`/cv-builder/${template.id}`);
                              }}
                              className={`mt-2 inline-flex h-7 items-center justify-center gap-1 rounded bg-primary px-2 text-[11px] font-bold text-white transition-colors hover:bg-primary-pressed ${
                                viewMode === 'compact' ? 'w-fit' : 'w-full'
                              }`}
                            >
                              Dùng
                              <ArrowRight className="size-3" strokeWidth={1.9} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-border-hairline bg-white px-6 text-center">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-bg-surface text-text-tertiary">
                      <FileText className="size-6" strokeWidth={1.7} />
                    </div>
                    <h3 className="text-[16px] font-bold text-text-primary">Không có mẫu CV phù hợp</h3>
                    <p className="mt-1 max-w-sm text-[14px] leading-6 text-text-secondary">
                      Thử bỏ từ khóa tìm kiếm hoặc quay lại bộ lọc tất cả mẫu.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('');
                        setActiveFilter('all');
                      }}
                      className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-border-hairline bg-white px-4 text-[13px] font-bold text-text-primary shadow-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};
