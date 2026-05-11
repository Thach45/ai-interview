
const StatCard = ({ title, value, icon, colorClass, textColorClass }: { title: string, value: string | number, icon: string, colorClass: string, textColorClass: string }) => (
  <div className="bg-bg-canvas p-6 rounded-lg border border-border-hairline flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <span className="text-[11px] font-semibold text-text-secondary uppercase">{title}</span>
      <div className={`size-9 rounded-md ${colorClass} flex items-center justify-center`}>
        <span className={`material-symbols-outlined text-[20px] ${textColorClass}`}>{icon}</span>
      </div>
    </div>
    <div className="text-[28px] font-semibold text-text-primary leading-tight">{value}</div>
  </div>
);

const JobListItem = ({ title, company }: { title: string, company: string }) => (
  <div className="flex items-center gap-3 py-3 border-b border-border-hairline last:border-0 hover:bg-bg-surface-soft transition-colors cursor-pointer px-2 rounded-md group">
    <div className="size-10 bg-bg-surface border border-border-hairline rounded-md flex items-center justify-center font-bold text-text-secondary group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
       <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[14px] font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{title}</div>
      <div className="text-[12px] text-text-secondary truncate">{company}</div>
    </div>
    <span className="material-symbols-outlined text-text-tertiary group-hover:text-primary text-[18px] transition-colors">chevron_right</span>
  </div>
);

export const DashboardOverview = () => {
  return (
    <div className="max-w-[1280px] mx-auto p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Middle Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-10">
            <h1 className="text-[36px] font-semibold text-text-primary mb-2 leading-[1.2]">
              Chào mừng trở lại, <span className="text-primary">Hoang Thach!</span>
            </h1>
            <p className="text-[18px] text-text-secondary">
              Bạn đã sẵn sàng để chinh phục buổi phỏng vấn tiếp theo chưa?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Tổng số phỏng vấn" 
              value="12" 
              icon="video_call" 
              colorClass="bg-primary/10" 
              textColorClass="text-primary" 
            />
            <StatCard 
              title="Đã hoàn thành" 
              value="8" 
              icon="check_circle" 
              colorClass="bg-bg-surface" 
              textColorClass="text-emerald-600" 
            />
            <StatCard 
              title="CV phân tích" 
              value="24" 
              icon="description" 
              colorClass="bg-bg-surface" 
              textColorClass="text-sky-600" 
            />
            <StatCard 
              title="Điểm trung bình" 
              value="85%" 
              icon="monitoring" 
              colorClass="bg-bg-surface" 
              textColorClass="text-orange-600" 
            />
          </div>

          <div className="bg-bg-canvas p-3 rounded-lg border border-border-hairline mb-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1 group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">search</span>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm câu hỏi, việc làm hoặc tài nguyên..."
                  className="w-full pl-12 pr-4 py-3 bg-bg-surface border border-transparent rounded-md outline-none focus:bg-bg-canvas focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-[16px] text-text-primary"
                />
              </div>
              <div className="flex gap-2">
                <select className="bg-bg-canvas border border-border-hairline rounded-md px-4 py-2 text-[14px] font-medium text-text-primary outline-none focus:border-primary transition-colors cursor-pointer min-w-[140px]">
                  <option>Tất cả danh mục</option>
                </select>
                <select className="bg-bg-canvas border border-border-hairline rounded-md px-4 py-2 text-[14px] font-medium text-text-primary outline-none focus:border-primary transition-colors cursor-pointer min-w-[120px]">
                  <option>Độ khó</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-bg-canvas p-8 rounded-lg border border-border-hairline min-h-[400px] flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">history</span>
                Hoạt động gần đây
              </h2>
              <a href="#" className="text-[14px] font-medium text-primary hover:underline">Xem tất cả</a>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
              <div className="size-20 bg-bg-surface rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-text-tertiary text-4xl font-light">pending_actions</span>
              </div>
              <p className="text-[16px] font-medium text-text-secondary">Chưa có hoạt động nào được ghi lại</p>
              <button className="text-[14px] font-semibold text-primary border border-border-hairline px-6 py-2 rounded-md hover:bg-bg-surface transition-all">
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="w-full lg:w-[320px] space-y-6">
          <div className="bg-bg-canvas rounded-lg text-text-primary relative overflow-hidden group border border-border-hairline shadow-sm min-h-[340px] flex flex-col">
            {/* Hiệu ứng Nhẩm nhẩm (Subtle Mumbling) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <style>{`
                @keyframes whisper {
                  0% { transform: scale(0.8) translateY(0); opacity: 0; }
                  20% { opacity: 0.6; }
                  80% { opacity: 0.6; }
                  100% { transform: scale(1) translateY(-20px); opacity: 0; }
                }
                .whisper-text {
                  position: absolute;
                  font-size: 10px;
                  font-weight: 500;
                  color: var(--color-text-secondary);
                  background: white;
                  padding: 3px 10px;
                  border-radius: 8px;
                  border: 1px solid var(--color-border-hairline);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                  opacity: 0;
                  animation: whisper 3s infinite ease-in-out;
                }
              `}</style>
              <span className="whisper-text" style={{ right: '140px', bottom: '200px', animationDelay: '0s' }}>"Hello, I'm..."</span>
              <span className="whisper-text" style={{ right: '180px', bottom: '230px', animationDelay: '1s' }}>"My strengths..."</span>
              <span className="whisper-text" style={{ right: '120px', bottom: '250px', animationDelay: '2.2s' }}>"Experience..."</span>
            </div>

            {/* Hình ảnh người ảo (Avatar Nữ - Bản tách nền) */}
            <div className="absolute right-[-30px] bottom-[-10px] w-[260px] h-[260px] opacity-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out z-0">
              <img 
                src="/avatar-practice-female.png" 
                alt="Practicing Avatar"
                className="w-full h-full object-contain object-bottom drop-shadow-2xl"
              />
            </div>

            <div className="relative z-20 p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="size-10 bg-bg-surface border border-border-hairline rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-primary">record_voice_over</span>
                </div>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md">
                  Practice Mode
                </span>
              </div>
              
              <div className="max-w-[160px] flex-1">
                <h2 className="text-[20px] font-semibold mb-2 leading-tight text-text-primary">
                  Nhẩm lại kiến thức
                </h2>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Tự tin hơn khi ôn lại các ý chính trước buổi phỏng vấn.
                </p>
              </div>
              
              <div className="mt-8">
                <button className="w-fit bg-primary text-white px-3 py-2 rounded-md font-semibold text-[11px] hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2">
                  Bắt đầu ngay <span className="material-symbols-outlined text-[18px]">mic</span>
                </button>
              </div>
            </div>
          </div>


          <div className="bg-bg-canvas p-6 rounded-lg border border-border-hairline shadow-sm">
            <div className="flex justify-between items-center mb-6 px-1">
              <h2 className="text-[14px] font-semibold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">work</span>
                Việc làm gợi ý
              </h2>
              <a href="#" className="text-[11px] font-semibold text-primary hover:underline uppercase">Xem thêm</a>
            </div>
            <div className="space-y-1">
              <JobListItem title="Senior Frontend Developer" company="TechFlow Solutions" />
              <JobListItem title="UI/UX Designer (Product)" company="Creative Studio" />
              <JobListItem title="Backend Engineer" company="DataScale AI" />
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};


