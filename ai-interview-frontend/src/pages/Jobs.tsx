import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { JobSearch } from '../features/jobs/components/JobSearch';
import { JobFilters } from '../features/jobs/components/JobFilters';
import { JobCard } from '../features/jobs/components/JobCard';
import { JobDetail } from '../features/jobs/components/JobDetail';

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer (React)',
    company: 'TechFlow Solutions',
    location: 'Hà Nội',
    salary: '25 - 45 Triệu',
    type: 'Toàn thời gian',
    postedAt: 'Đăng vào 2 giờ trước'
  },
  {
    id: 2,
    title: 'Junior Backend Engineer',
    company: 'DataScale AI',
    location: 'TP. Hồ Chí Minh',
    salary: '15 - 25 Triệu',
    type: 'Toàn thời gian',
    postedAt: 'Đăng vào 5 giờ trước'
  },
  {
    id: 3,
    title: 'UI/UX Designer (Product)',
    company: 'Creative Studio',
    location: 'Đà Nẵng',
    salary: 'Thỏa thuận',
    type: 'Hợp đồng',
    postedAt: 'Đăng vào 1 ngày trước'
  },
  {
    id: 4,
    title: 'Tuyển dụng Mobile App Developer',
    company: 'Job Agent Network',
    location: 'Làm việc từ xa',
    salary: '30 - 50 Triệu',
    type: 'Toàn thời gian',
    postedAt: 'Đăng vào 2 ngày trước'
  },
  {
    id: 5,
    title: 'Fullstack Developer (Node/React)',
    company: 'E-Commerce Pro',
    location: 'Hà Nội',
    salary: 'Thỏa thuận',
    type: 'Toàn thời gian',
    postedAt: 'Đăng vào 3 ngày trước'
  }
];

const JobsPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);

  return (
    <MainLayout title="Việc làm">
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-6 pb-20">
            
            <JobSearch />
            <JobFilters />

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="px-3 py-1.5 bg-primary/5 text-primary text-[12px] font-semibold rounded-lg flex items-center gap-2 border border-primary/10">
                Ngành nghề: Fullstack Developer (+1) 
                <span className="material-symbols-outlined text-[16px] cursor-pointer hover:opacity-70">close</span>
              </div>
              <button className="text-[12px] text-text-secondary hover:text-primary font-bold ml-2 transition-colors">Xóa tất cả</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Master: Job List */}
              <div className="w-full lg:w-[420px] flex-shrink-0 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[13px] text-text-secondary font-medium">
                    Hiển thị <span className="text-text-primary font-bold">{MOCK_JOBS.length}</span> việc làm
                  </span>
                  <button className="flex items-center gap-1.5 text-[12px] font-bold bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">sort</span>
                    Mới nhất
                    <span className="material-symbols-outlined text-[18px] opacity-40">expand_more</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {MOCK_JOBS.map((job) => (
                    <JobCard 
                      key={job.id} 
                      {...job} 
                      isSelected={selectedJob?.id === job.id}
                      onClick={() => setSelectedJob(job)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 pt-6 pb-4">
                  <button className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="size-9 rounded-lg bg-primary text-white flex items-center justify-center text-[13px] font-bold shadow-md shadow-primary/20">1</button>
                  <button className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-[13px] font-semibold text-text-secondary hover:bg-gray-50 transition-colors">2</button>
                  <button className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-[13px] font-semibold text-text-secondary hover:bg-gray-50 transition-colors">3</button>
                  <span className="text-gray-300 mx-1">...</span>
                  <button className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-text-secondary hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Detail Column */}
              <div className="hidden lg:block flex-1 sticky top-0 h-[calc(100vh-200px)]">
                <JobDetail job={selectedJob} />
              </div>

            </div>
          </div>
          
          <footer className="max-w-[1600px] mx-auto px-6 py-8 text-center border-t border-gray-200">
             <p className="text-[13px] text-text-secondary font-medium italic opacity-70">
                © 2026 Công ty cổ phần TMI. Tất cả quyền được bảo lưu.
             </p>
          </footer>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;
