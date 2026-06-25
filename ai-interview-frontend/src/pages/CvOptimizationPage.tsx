import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, CheckCircle, ChevronDown, PenTool, TrendingUp, ChevronRight, XCircle } from 'lucide-react';
import { useCvs } from '../features/cvs/hooks/useCvs';
import { useQuery } from '@tanstack/react-query';
import { cvApi } from '../features/cvs/api/cv.api';
import { generateCvHtml } from '../features/cvs/utils/cvTemplateGenerator';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { LoadingIndicator } from '../shared/components/LoadingIndicator';

const CvOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  
  const { data: optimizedResult, isLoading, error } = useQuery({
    queryKey: ['optimize-cv', analysisId],
    queryFn: () => cvApi.optimizeCv(analysisId!),
    enabled: !!analysisId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  if (!analysisId) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <p className="text-lg font-bold">Thiếu thông tin phân tích để tối ưu</p>
           <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg">Quay lại</button>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <LoadingIndicator 
        type="ai"
        title="AI đang viết lại CV của bạn..."
        subtitle="Quá trình này có thể mất vài chục giây để hệ thống cấu trúc lại CV dựa trên các đề xuất cải thiện."
        fullScreen={true}
        aiSteps={[
          "Đang lấy dữ liệu và ngữ cảnh...",
          "Viết lại mục tiêu nghề nghiệp và kỹ năng...",
          "Cấu trúc lại kinh nghiệm làm việc...",
          "Hoàn thiện bản xem trước CV..."
        ]}
      />
    );
  }

  if (error || !optimizedResult) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <XCircle size={60} className="text-red-500 mb-4" />
           <p className="text-xl font-bold text-gray-800">Lỗi khi tối ưu CV</p>
           <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Quay lại</button>
        </div>
      </MainLayout>
    );
  }

  const generatedHtml = generateCvHtml(optimizedResult.optimizedData);
  const aiModifications = optimizedResult.modifications || [];

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 py-4 bg-[#f8fafc]">
      <div className="flex gap-6 h-[calc(100vh-100px)]">

        <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="flex-1 overflow-auto custom-scrollbar pb-10 pt-10">
            <div className="flex items-start justify-center min-w-max px-10 gap-10 mx-auto">
              
              {/* Khung giấy A4 - Render từ chuỗi HTML */}
              <div 
                className="bg-white w-[800px] min-w-[800px] shadow-xl relative overflow-hidden shrink-0 border border-gray-200 rounded-sm"
                style={{ minHeight: '1131px' }}
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />

              {/* Vertical Divider */}
              <div className="w-[2px] bg-gray-200 self-stretch rounded-full"></div>

              {/* Lịch sử chỉnh sửa AI Panel */}
              <div className="sticky top-10 flex flex-col w-[380px] shrink-0">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[800px]">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BrainCircuit size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 leading-tight">Lịch sử chỉnh sửa</h3>
                        <p className="text-[12px] text-gray-500 font-medium">Bởi Trợ lý AI</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle size={12} /> Đã xong
                    </span>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                    {aiModifications.map((mod: any) => {
                      return (
                        <div key={mod.id} className="group flex gap-3 relative">
                          {/* Dấu chấm timeline */}
                          <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-gray-100 group-last:hidden"></div>
                          
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 bg-indigo-50 text-primary shadow-sm border border-white">
                            <Sparkles size={14} />
                          </div>
                          
                          <div className="flex-1 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-primary/30 group-hover:shadow-md transition-all">
                            <h4 className="text-[13px] font-bold text-gray-800 mb-1">{mod.title}</h4>
                            <p className="text-[12px] text-gray-600 leading-relaxed">{mod.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-bold text-gray-500">Mẫu hiện tại</span>
                      <button className="text-[12px] font-bold text-primary hover:underline flex items-center gap-1">
                        Thay đổi <ChevronRight size={14} />
                      </button>
                    </div>
                    <button className="w-full bg-[#1c385c] text-white px-5 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#152a45] shadow-lg shadow-indigo-900/20 hover:shadow-xl transition-all">
                      <span className="material-symbols-outlined text-[20px]">file_download</span> Xuất PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CvOptimizationPage;
