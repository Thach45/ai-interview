import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useCvs } from '../features/cvs/hooks/useCvs';
import { useCvAnalysisById, useOptimizeCv } from '../features/cvs/hooks/useCvAnalysis';
import { XCircle, AlertTriangle, Target, BrainCircuit, Lightbulb, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingIndicator } from '../shared/components/LoadingIndicator';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { CircularProgress } from '../features/cvs/components/cv-analysis/CircularProgress';
import { ScoringRadarChart } from '../features/cvs/components/cv-analysis/ScoringRadarChart';
import { OverviewTab } from '../features/cvs/components/cv-analysis/OverviewTab';
import { SkillsTab } from '../features/cvs/components/cv-analysis/SkillsTab';
import { RecommendationsTab } from '../features/cvs/components/cv-analysis/RecommendationsTab';

export default function CVAnalysisResultPage() {
  const { id } = useParams(); // analysisId
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'recommendations'>('overview');
  
  const { cvs } = useCvs();

  const { data: historyResponse, isLoading, error } = useCvAnalysisById(id);
  const { optimizeCv, isOptimizing } = useOptimizeCv();

  const analysisResponse = historyResponse?.data;
  const selectedCv = cvs.find((c: any) => c.id === analysisResponse?.cvId);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleOptimize = () => {
    if (analysisResponse?.id) {
      optimizeCv(analysisResponse.id);
    }
  };

  if (!id) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <AlertTriangle size={48} className="text-amber-500 mb-4" />
           <p className="text-lg font-bold">Thiếu thông tin phân tích</p>
           <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Quay lại</button>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <LoadingIndicator 
        type="ai"
        title="Đang tải dữ liệu phân tích..."
        subtitle="Vui lòng đợi trong giây lát"
        fullScreen={true}
        aiSteps={[]}
      />
    );
  }

  if (isOptimizing) {
    return (
      <LoadingIndicator 
        type="ai"
        title="AI đang viết lại CV của bạn..."
        subtitle="Hệ thống đang cấu trúc lại CV dựa trên các đề xuất cải thiện và bổ sung từ khóa tối ưu cho ATS."
        fullScreen={true}
        aiSteps={[
          "Đang tải ngữ cảnh và các đề xuất cải thiện...",
          "Bổ sung các từ khóa chuyên môn còn thiếu...",
          "Viết lại mục tiêu nghề nghiệp...",
          "Cấu trúc lại kinh nghiệm làm việc theo phương pháp STAR...",
          "Đang tối ưu hóa định dạng và tạo bản xem trước..."
        ]}
      />
    );
  }

  if (error || !analysisResponse) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <XCircle size={60} className="text-red-500 mb-4" />
           <p className="text-xl font-bold text-gray-800">Lỗi khi tải kết quả phân tích</p>
           <p className="text-gray-500 mt-2 mb-6">Không thể kết nối hoặc dữ liệu không tồn tại.</p>
           <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Quay lại</button>
        </div>
      </MainLayout>
    );
  }

  const result = analysisResponse;

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 pt-2 overflow-hidden bg-[#fafafa]">
      <div className="flex gap-6 h-[calc(100vh-140px)] p-3">
        {/* LEFT COLUMN: PDF / CV Viewer */}
        <div className="w-[45%] flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
          <div className="flex-1 overflow-hidden relative">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={selectedCv?.fileUrl || ''}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Insights */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          
          {/* AI Banner */}
          <div className="bg-white p-6 shrink-0 border-b border-gray-100 flex gap-6 items-center">
            <CircularProgress score={result.matchScore} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Đánh giá mức độ phù hợp</h2>
              </div>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                {result.summary}
              </p>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => setShowDetail(prev => !prev)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-1.5"
                >
                  {showDetail ? 'Thu gọn' : 'Xem chi tiết'}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showDetail ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-70"
                >
                  <BrainCircuit size={16} />
                  Tối ưu CV với AI
                </button>
              </div>
            </div>
          </div>

          {/* Scoring Detail Panel (default view) */}
          <AnimatePresence>
            {!showDetail && (
              <motion.div
                key="scoring"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/30 flex flex-col items-center"
              >
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 w-full">Mức độ phù hợp theo từng hạng mục</p>
                <p className="text-[12px] text-gray-400 mb-4 w-full">Di chuột vào từng điểm để xem nhận xét chi tiết</p>
                <ScoringRadarChart data={result.scoringDetails} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Tabs (shown when 'Xem chi tiết' clicked) */}
          <AnimatePresence>
            {showDetail && (
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="flex px-6 border-b border-gray-100 mt-2 shrink-0">
                  {[
                    { id: 'overview', label: 'Tổng quan', icon: Target },
                    { id: 'skills', label: 'Phân tích kỹ năng', icon: BrainCircuit },
                    { id: 'recommendations', label: 'Đề xuất cải thiện', icon: Lightbulb }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-[14px] font-bold border-b-2 transition-all ${
                          isActive 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400'} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/30">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && <OverviewTab result={result} />}
                    {activeTab === 'skills' && <SkillsTab result={result} />}
                    {activeTab === 'recommendations' && <RecommendationsTab result={result} handleOptimize={handleOptimize} isOptimizing={isOptimizing} />}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>      
    </MainLayout>
  );
}
