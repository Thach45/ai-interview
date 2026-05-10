import React from 'react';
import { useNavigate } from 'react-router-dom';

interface JobDetailProps {
  job: {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    postedAt: string;
  } | null;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
  const navigate = useNavigate();
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 h-full flex flex-col overflow-hidden shadow-sm">
      {/* Header Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="size-16 border border-gray-100 rounded-xl flex items-center justify-center text-primary bg-white shadow-sm">
            <span className="material-symbols-outlined text-4xl font-light">corporate_fare</span>
          </div>
          {/* Đã bỏ nút Favorite và Share */}
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-2">{job.title}</h2>
        <p className="text-primary font-bold text-[15px] mb-4">{job.company}</p>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span className="material-symbols-outlined text-lg">location_on</span>
            {job.location}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span className="material-symbols-outlined text-lg">payments</span>
            <span className="text-[#22c55e] font-bold">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span className="material-symbols-outlined text-lg">schedule</span>
            {job.postedAt}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <section>
          <h3 className="text-[16px] font-bold text-text-primary mb-3">Mô tả công việc</h3>
          <ul className="list-disc list-inside text-[14px] text-text-secondary space-y-2 leading-relaxed">
            <li>Tham gia phát triển các dự án Web sử dụng ReactJS / NextJS.</li>
            <li>Phối hợp với team Design để chuyển đổi UI/UX sang code Frontend.</li>
            <li>Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng.</li>
            <li>Xây dựng các component dùng chung, có khả năng tái sử dụng cao.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-[16px] font-bold text-text-primary mb-3">Yêu cầu ứng viên</h3>
          <ul className="list-disc list-inside text-[14px] text-text-secondary space-y-2 leading-relaxed">
            <li>Ít nhất 2 năm kinh nghiệm làm việc với ReactJS.</li>
            <li>Thành thạo HTML5, CSS3 (TailwindCSS, SCSS).</li>
            <li>Hiểu biết sâu về JavaScript (ES6+), TypeScript.</li>
            <li>Có tư duy về UX/UI tốt.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-[16px] font-bold text-text-primary mb-3">Quyền lợi</h3>
          <ul className="list-disc list-inside text-[14px] text-text-secondary space-y-2 leading-relaxed">
            <li>Mức lương cạnh tranh theo năng lực.</li>
            <li>Thưởng dự án, thưởng năm hấp dẫn.</li>
            <li>Môi trường làm việc trẻ trung, năng động.</li>
            <li>Hỗ trợ thiết bị làm việc hiện đại.</li>
          </ul>
        </section>
      </div>

      {/* Sticky Action Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
        <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-[14px] hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
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
    </div>
  );
};
