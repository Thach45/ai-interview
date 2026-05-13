import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectCvModal from '../../cvs/components/SelectCvModal';

interface JobDetailProps {
  job: {
    id: string;
    title: string;
    companyName: string;
    location: string;
    salaryRange: string;
    employmentType: string;
    experienceLevel: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    createdAt?: string;
  } | null;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const navigate = useNavigate();
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-2xl border border-gray-200 border-dashed">
        <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-gray-300 text-5xl font-light">touch_app</span>
        </div>
        <h3 className="text-[18px] font-bold text-text-primary mb-2">Chọn một việc làm</h3>
        <p className="text-[14px] text-text-secondary max-w-xs mx-auto">
          Nhấp vào việc làm ở danh sách bên trái để xem thông tin chi tiết và ứng tuyển.
        </p>
      </div>
    );
  }

  // Hàm tiện ích để render text xuống dòng hoặc danh sách
  const renderContent = (content: string) => {
    if (!content) return null;
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-2 last:mb-0">{line}</p>
    ));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="size-16 border border-gray-100 rounded-xl flex items-center justify-center text-primary bg-white shadow-sm">
            <span className="material-symbols-outlined text-4xl font-light">corporate_fare</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-2">{job.title}</h2>
        <p className="text-primary font-bold text-[15px] mb-4">{job.companyName}</p>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span className="material-symbols-outlined text-lg">location_on</span>
            {job.location || 'Địa điểm chưa cập nhật'}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="text-[#22c55e] font-bold">{job.salaryRange || 'Thỏa thuận'}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span className="material-symbols-outlined text-lg">work</span>
            {job.employmentType}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-1.5 rounded-full bg-primary" />
            <h3 className="text-[16px] font-bold text-text-primary">Mô tả công việc</h3>
          </div>
          <div className="text-[14px] text-text-secondary space-y-1 leading-relaxed pl-3.5">
            {renderContent(job.responsibilities)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-1.5 rounded-full bg-primary" />
            <h3 className="text-[16px] font-bold text-text-primary">Yêu cầu ứng viên</h3>
          </div>
          <div className="text-[14px] text-text-secondary space-y-1 leading-relaxed pl-3.5">
            {renderContent(job.requirements)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-1.5 rounded-full bg-primary" />
            <h3 className="text-[16px] font-bold text-text-primary">Quyền lợi</h3>
          </div>
          <div className="text-[14px] text-text-secondary space-y-1 leading-relaxed pl-3.5">
            {renderContent(job.benefits)}
          </div>
        </section>
      </div>

      {/* Sticky Action Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
        <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-[14px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          onClick={() => setIsCvModalOpen(true)}>
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          Phân tích CV
        </button>
        <button 
          onClick={() => navigate('/interviews/setup')}
          className="flex-1 border border-primary/20 bg-white text-primary py-3 rounded-xl font-bold text-[14px] hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
          Luyện phỏng vấn
        </button>
      </div>

      <SelectCvModal 
        isOpen={isCvModalOpen} 
        onClose={() => setIsCvModalOpen(false)} 
        onSelect={(cvId) => {
          setIsCvModalOpen(false);
          navigate(`/jobs/cv-analysis/${job.id}?cvId=${cvId}`);
        }} 
      />
    </div>
  );
};
