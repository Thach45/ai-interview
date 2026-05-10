import React from 'react';

export const JobSearch = () => {
  return (
    <div className="search-section bg-white dark:bg-card-dark rounded-xl border border-[#e5e7eb] dark:border-gray-700/50 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <form id="job-search-form" action="https://x-interview.com/mypage/jobs" method="GET">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">
                search
              </span>
              <input
                type="text"
                name="keyword"
                id="job-keyword"
                defaultValue=""
                placeholder="Tìm kiếm việc làm..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-light dark:bg-background-dark border-none text-text-primary dark:text-white placeholder-text-secondary focus:ring-2 focus:ring-primary/20 transition-all text-base outline-none"
              />
            </div>
          </div>

          {/* Location Search */}
          <div className="lg:w-64">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">
                location_on
              </span>
              <input
                type="text"
                name="location"
                id="job-location"
                defaultValue=""
                placeholder="Địa điểm"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-light dark:bg-background-dark border-none text-text-primary dark:text-white placeholder-text-secondary focus:ring-2 focus:ring-primary/20 transition-all text-base outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
