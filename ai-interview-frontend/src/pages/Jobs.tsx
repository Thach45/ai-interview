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
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1440px" className="px-8 lg:px-12 pt-2 overflow-hidden">
      <div className="flex flex-col h-full pb-14">
        
        {/* Header Section */}
        <div className="mb-2 space-y-3">
          <div>
            <h1 className="text-[26px] font-bold text-text-primary tracking-tight">Việc làm</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">
              {isLoading ? 'Đang tìm kiếm...' : `Khám phá ${meta?.total ?? 0} cơ hội việc làm dành cho bạn`}
            </p>
          </div>

          <JobSearch onSearch={(val) => setSearch(val)} />
          
          <JobFilters 
            selectedFilters={filters}
            onFilterChange={handleFilterChange} 
          />

          {filters.categoryIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {filters.categoryIds.map(id => {
                const category = flatCategories.find(c => c.id === id);
                return (
                  <div key={id} className="px-2.5 py-1 bg-primary/5 text-primary text-[11px] font-semibold rounded-lg flex items-center gap-2 border border-primary/10">
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
                className="text-[11px] text-text-secondary hover:text-primary font-bold ml-2 transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* Content Section: Independent Scroll with Explicit Heights */}
        <div className="flex gap-8 h-[calc(100vh-180px)] mt-0">
          
          {/* Master: Job List Column */}
          <div className="w-[420px] flex-shrink-0 flex flex-col h-full">
            <div className="flex items-center justify-between px-1 mb-4 shrink-0">
              <span className="text-[13px] text-text-secondary font-medium">
                {isLoading ? 'Đang tìm kiếm...' : <>Hiển thị <span className="text-text-primary font-bold">{templates.length}</span> việc làm</>}
              </span>
              <div className="flex items-center gap-2">
                 <button className="flex items-center gap-1.5 text-[12px] font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">sort</span>
                  Mới nhất
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 space-y-3 pb-6">
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

              {/* Standard Numbered Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-6 pb-4">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1} 
                    className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                  >
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
                        <button 
                          key={i} 
                          onClick={() => setPage(p as number)} 
                          className={`size-9 rounded-lg text-[13px] font-bold transition-all shadow-sm ${
                            page === p 
                              ? 'bg-primary text-white' 
                              : 'bg-white border border-gray-200 text-text-secondary hover:border-primary hover:text-primary'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    ));
                  })()}

                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page === totalPages} 
                    className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detail: Floating Panel Column */}
          <div className="flex-1 h-full hidden lg:block">
            <div className="h-full bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden flex flex-col">
              {/* Top Accent Gradient */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-sky-400 shrink-0" />
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {selectedJob ? (
                  <div key={selectedJob.id} className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <JobDetail job={selectedJob} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30 select-none">
                    <div className="size-24 rounded-full bg-bg-surface flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-6xl font-light">work_outline</span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">Chọn một công việc</h3>
                    <p className="text-base text-text-secondary max-w-xs">Nhấp vào danh sách bên trái để xem chi tiết yêu cầu công việc.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;
