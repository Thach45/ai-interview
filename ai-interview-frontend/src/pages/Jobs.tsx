import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { JobSearch } from '../features/jobs/components/JobSearch';
import { JobFilters } from '../features/jobs/components/JobFilters';
import { JobCard } from '../features/jobs/components/JobCard';
import { JobDetail } from '../features/jobs/components/JobDetail';
import { useJobTemplates } from '../features/jobs/hooks/useJobTemplates';
import { useJobCategories } from '../features/jobs/hooks/useJobCategoriesAdmin';

const JobsPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    categoryIds: [] as string[],
    location: '',
    salaryRange: '',
    experienceLevel: '',
    employmentType: '',
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  // Lấy dữ liệu thật từ API
  const { templates, meta, isLoading } = useJobTemplates({ 
    search, 
    ...filters,
    page,
    limit
  });

  const { useFlatCategories } = useJobCategories();
  const { data: flatCategoriesData } = useFlatCategories({ limit: 1000 });
  const flatCategories = flatCategoriesData?.data.data || [];

  // Tự động chọn công việc đầu tiên khi danh sách tải xong hoặc chuyển trang
  useEffect(() => {
    if (templates.length > 0) {
      setSelectedJob(templates[0]);
    } else {
      setSelectedJob(null);
    }
  }, [templates]);

  // Reset về trang 1 khi tìm kiếm hoặc lọc
  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearCategory = (id: string) => {
    const newIds = filters.categoryIds.filter(cid => cid !== id);
    setFilters(prev => ({ ...prev, categoryIds: newIds }));
  };

  const totalPages = meta?.totalPages || 1;

  return (
    <MainLayout title="Việc làm" fullHeight maxWidth="1600px" className="p-4 lg:p-6 pb-20 h-full overflow-y-auto custom-scrollbar">
      <>
        {/* Search Bar */}
        <JobSearch onSearch={(val) => setSearch(val)} />
        
        {/* Filters */}
        <JobFilters 
          selectedFilters={filters}
          onFilterChange={handleFilterChange} 
        />

        {/* Filter Chips - Only for Categories for now to keep UI clean */}
        {filters.categoryIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filters.categoryIds.map(id => {
              const category = flatCategories.find(c => c.id === id);
              return (
                <div key={id} className="px-3 py-1.5 bg-primary/5 text-primary text-[12px] font-semibold rounded-lg flex items-center gap-2 border border-primary/10">
                  {category?.name || 'Đang tải...'}
                  <span 
                    onClick={() => handleClearCategory(id)}
                    className="material-symbols-outlined text-[16px] cursor-pointer hover:opacity-70"
                  >
                    close
                  </span>
                </div>
              );
            })}
            <button 
              onClick={() => setFilters(prev => ({ ...prev, categoryIds: [] }))}
              className="text-[12px] text-text-secondary hover:text-primary font-bold ml-2 transition-colors"
            >
              Xóa tất cả ngành nghề
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Master: Job List */}
          <div className="w-full lg:w-[420px] flex-shrink-0 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] text-text-secondary font-medium">
                {isLoading ? (
                  'Đang tìm kiếm...'
                ) : (
                  <>Hiển thị <span className="text-text-primary font-bold">{templates.length}</span> việc làm</>
                )}
              </span>
              <button className="flex items-center gap-1.5 text-[12px] font-bold bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">sort</span>
                Mới nhất
                <span className="material-symbols-outlined text-[18px] opacity-40">expand_more</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                [1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-2xl" />)
              ) : templates.length > 0 ? (
                templates.map((job: any) => (
                  <JobCard 
                    key={job.id} 
                    id={job.id}
                    title={job.title}
                    company={job.companyName}
                    location={job.location}
                    salary={job.salaryRange}
                    type={job.employmentType}
                    postedAt="Vừa xong"
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-bg-surface rounded-2xl border border-dashed border-gray-200">
                  <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">search_off</span>
                  <p className="text-[14px] text-text-secondary">Không tìm thấy việc làm phù hợp</p>
                </div>
              )}
            </div>

            {/* Smart Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-6 pb-4">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-30 transition-all">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                {(() => {
                  const pages = [];
                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (page > 3) pages.push('...');
                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                      if (!pages.includes(i)) pages.push(i);
                    }
                    if (page < totalPages - 2) pages.push('...');
                    if (!pages.includes(totalPages)) pages.push(totalPages);
                  }
                  return pages.map((p, i) => (
                    p === '...' ? (
                      <span key={i} className="size-9 flex items-center justify-center text-text-tertiary text-[13px]">...</span>
                    ) : (
                      <button key={i} onClick={() => setPage(p as number)} className={`size-9 rounded-lg text-[13px] font-bold transition-all ${page === p ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-text-secondary hover:border-primary'}`}>
                        {p}
                      </button>
                    )
                  ));
                })()}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-30 transition-all">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* Detail Column */}
          <div className="hidden lg:block flex-1 sticky top-0 h-[calc(100vh-200px)]">
            <JobDetail job={selectedJob} />
          </div>
        </div>
      </>
    </MainLayout>
  );
};

export default JobsPage;
