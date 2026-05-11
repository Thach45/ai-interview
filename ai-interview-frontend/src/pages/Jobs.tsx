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
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Lấy dữ liệu thật từ API
  const { templates, meta, isLoading } = useJobTemplates({ 
    search, 
    categoryIds,
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
  }, [search, categoryIds]);

  const handleClearCategory = (id: string) => {
    const newIds = categoryIds.filter(cid => cid !== id);
    setCategoryIds(newIds);
  };

  const handleClearAll = () => {
    setCategoryIds([]);
  };

  const totalPages = meta?.totalPages || 1;

  return (
    <MainLayout title="Việc làm" fullHeight maxWidth="1600px" className="p-4 lg:p-6 pb-20 h-full overflow-y-auto custom-scrollbar">
      <>
        {/* Search Bar */}
        <JobSearch onSearch={(val) => setSearch(val)} />
        
        {/* Filters */}
        <JobFilters 
          selectedCategoryIds={categoryIds}
          onFilterChange={(f) => setCategoryIds(f.categoryIds)} 
        />

        {/* Filter Chips */}
        {categoryIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categoryIds.map(id => {
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
              onClick={handleClearAll}
              className="text-[12px] text-text-secondary hover:text-primary font-bold ml-2 transition-colors"
            >
              Xóa tất cả
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
                // Skeleton loading
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
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                
                {(() => {
                  const pages = [];
                  const showEllipsis = totalPages > 5;
                  
                  if (!showEllipsis) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    // Luôn hiện trang 1
                    pages.push(1);
                    
                    if (page > 3) pages.push('...');
                    
                    // Hiện các trang quanh trang hiện tại
                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                      if (!pages.includes(i)) pages.push(i);
                    }
                    
                    if (page < totalPages - 2) pages.push('...');
                    
                    // Luôn hiện trang cuối
                    if (!pages.includes(totalPages)) pages.push(totalPages);
                  }

                  return pages.map((p, i) => (
                    p === '...' ? (
                      <span key={`el-${i}`} className="size-9 flex items-center justify-center text-text-tertiary text-[13px]">...</span>
                    ) : (
                      <button 
                        key={`p-${p}`}
                        onClick={() => setPage(p as number)}
                        className={`size-9 rounded-lg text-[13px] font-bold transition-all ${
                          page === p 
                          ? 'bg-primary text-white shadow-md shadow-primary/20 border border-primary' 
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
                  className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
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

        <footer className="max-w-[1600px] mx-auto px-6 py-8 text-center border-t border-gray-200 mt-10">
           <p className="text-[13px] text-text-secondary font-medium italic opacity-70">
              © 2026 Công ty cổ phần TMI. Tất cả quyền được bảo lưu.
           </p>
        </footer>
      </>
    </MainLayout>
  );
};

export default JobsPage;
