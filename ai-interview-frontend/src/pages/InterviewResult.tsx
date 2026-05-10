import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

const InterviewResultPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data matching Schema InterviewResult fields
  const result = {
    overallScore: 85,
    clarityScore: 90,
    confidenceScore: 75,
    relevanceScore: 88,
    feedbackJson: [
      { q: "Giới thiệu bản thân", feedback: "Rất tốt, mạch lạc.", score: 9 },
      { q: "Kinh nghiệm React", feedback: "Cần nói sâu hơn về Virtual DOM.", score: 7 },
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <MainLayout title="Kết quả phỏng vấn">
      <div className="max-w-5xl mx-auto p-6 lg:p-10 pb-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-8 lg:p-12 text-center border-b border-gray-50 bg-gradient-to-b from-primary/5 to-transparent">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Đánh giá tổng quát</h2>
            
            <div className="relative size-40 mx-auto mb-6">
              <svg className="size-full" viewBox="0 0 36 36">
                <path className="text-gray-100" strokeDasharray="100, 100" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-primary" strokeDasharray={`${result.overallScore}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-text-primary">{result.overallScore}</span>
                <span className="text-[12px] font-bold text-text-secondary uppercase">Điểm số</span>
              </div>
            </div>
            
            <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">
              Bạn đã hoàn thành buổi phỏng vấn rất ấn tượng! Khả năng diễn đạt của bạn rất tốt, tuy nhiên cần cải thiện thêm sự tự tin khi trả lời các câu hỏi hóc búa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6 text-center">
              <p className="text-[12px] font-bold text-text-secondary uppercase mb-2">Clarity (Mạch lạc)</p>
              <p className={`text-2xl font-black ${getScoreColor(result.clarityScore)}`}>{result.clarityScore}%</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-[12px] font-bold text-text-secondary uppercase mb-2">Confidence (Tự tin)</p>
              <p className={`text-2xl font-black ${getScoreColor(result.confidenceScore)}`}>{result.confidenceScore}%</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-[12px] font-bold text-text-secondary uppercase mb-2">Relevance (Phù hợp)</p>
              <p className={`text-2xl font-black ${getScoreColor(result.relevanceScore)}`}>{result.relevanceScore}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Phân tích chi tiết
            </h3>
            {result.feedbackJson.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-text-primary text-[15px]">{f.q}</h4>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[12px] font-bold">{f.score}/10</span>
                </div>
                <p className="text-[14px] text-text-secondary leading-relaxed">{f.feedback}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              Gợi ý cải thiện
            </h3>
            <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <p className="text-[13px] font-medium">Hãy luyện tập thêm về các câu hỏi thuật toán cơ bản.</p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <p className="text-[13px] font-medium">Cải thiện tốc độ phản xạ khi gặp câu hỏi bất ngờ.</p>
                </li>
              </ul>
              <button className="w-full mt-6 py-3 bg-white text-primary rounded-xl font-bold text-[13px] hover:bg-gray-50 transition-colors">
                Xem tài liệu ôn tập
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/jobs')}
              className="w-full py-4 border-2 border-gray-200 rounded-2xl font-bold text-text-primary hover:bg-gray-50 transition-all"
            >
              Phỏng vấn vị trí khác
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewResultPage;
