import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

const MOCK_CVS = [
  { id: 'cv1', title: 'CV Frontend Developer - 2024', updated: '2 ngày trước' },
  { id: 'cv2', title: 'CV Fullstack (React/Node)', updated: '1 tuần trước' },
];

const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCv, setSelectedCv] = useState<string>('');

  const handleStart = () => {
    if (!selectedCv) return;
    navigate('/interviews/practice');
  };

  return (
    <MainLayout title="Thiết lập phỏng vấn">
      <div className="max-w-4xl mx-auto p-6 lg:p-10">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Sẵn sàng phỏng vấn?</h2>
          <p className="text-text-secondary">Vui lòng chọn CV bạn muốn sử dụng cho vị trí <span className="font-bold text-primary">Senior Frontend Developer</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Job Info Summary */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">work</span>
              Thông tin vị trí
            </h3>
            <div className="flex-1">
              <p className="text-[18px] font-bold text-text-primary mb-1">Senior Frontend Developer</p>
              <p className="text-[14px] text-primary font-semibold mb-4">TechFlow Solutions</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  25 - 45 Triệu
                </div>
                <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Hà Nội
                </div>
              </div>
            </div>
          </div>

          {/* CV Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              Chọn CV của bạn
            </h3>
            <div className="space-y-3 flex-1">
              {MOCK_CVS.map(cv => (
                <label 
                  key={cv.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedCv === cv.id ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="cv" 
                      className="accent-primary"
                      checked={selectedCv === cv.id}
                      onChange={() => setSelectedCv(cv.id)}
                    />
                    <div>
                      <p className="text-[13px] font-bold text-text-primary">{cv.title}</p>
                      <p className="text-[11px] text-text-secondary">Cập nhật {cv.updated}</p>
                    </div>
                  </div>
                </label>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-text-secondary text-[12px] font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Tải lên CV mới
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handleStart}
            disabled={!selectedCv}
            className="px-12 py-4 bg-primary text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-primary/20 hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-3"
          >
            Bắt đầu phỏng vấn ngay
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <p className="text-[12px] text-text-secondary">Bằng cách bắt đầu, bạn sẽ tiêu tốn <span className="font-bold text-primary">1 lượt (credit)</span></p>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewSetupPage;
