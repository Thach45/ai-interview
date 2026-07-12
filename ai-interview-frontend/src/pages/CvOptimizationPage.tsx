import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, CheckCircle, ChevronDown, PenTool, TrendingUp, ChevronRight, XCircle } from 'lucide-react';
import { useOptimizedCv } from '../features/cvs/hooks/useCvAnalysis';
import { cvApi } from '../features/cvs/api/cv.api';
import { generateCvHtml } from '../features/cvs/utils/cvTemplateGenerator';
import Handlebars from 'handlebars';
import { useCvTemplatesClient } from '../features/cvs/hooks/useCvTemplatesClient';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { LoadingIndicator } from '../shared/components/LoadingIndicator';

const CvOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisId } = useParams();
  
  const { data: optimizedResultResult, isLoading, error } = useOptimizedCv(analysisId);
  const optimizedResult = optimizedResultResult?.data || optimizedResultResult;

  const { templates, isLoading: isLoadingTemplates } = useCvTemplatesClient();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('mock-1');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!analysisId) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <p className="text-lg font-bold">Thiếu thông tin phân tích để tối ưu {analysisId}</p>
           <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg">Quay lại</button>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
        <LoadingIndicator />
        <p className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu CV đã tối ưu...</p>
      </div>
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

  const aiModifications = optimizedResult.modifications || [];

  // Xác định Template được chọn
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Compile HTML với Handlebars
  let generatedHtml = '';
  if (selectedTemplate && selectedTemplate.htmlStructure) {
    try {
      const templateFn = Handlebars.compile(selectedTemplate.htmlStructure);
      generatedHtml = templateFn(optimizedResult.optimizedData);
    } catch (err) {
      console.error("Lỗi khi render Handlebars:", err);
      generatedHtml = `<div class="p-10 text-red-500 font-bold">Lỗi Render Template CV!</div>`;
    }
  } else {
    // Fallback về cái cứng nếu chưa có DB template (mock-1)
    // generatedHtml = generateCvHtml(optimizedResult.optimizedData);
  }

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 py-4 bg-[#f8fafc]">
      <div className="flex gap-6 h-[calc(100vh-100px)]">

        <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="flex-1 overflow-auto custom-scrollbar pb-10 pt-10">
            <div className="flex items-start justify-center min-w-max px-10 gap-10 mx-auto">
              
              {/* Khung giấy A4 - Render từ chuỗi HTML qua iFrame để cách ly CSS và chạy Tailwind CDN */}
              <div className="flex flex-col gap-4 shrink-0 bg-white shadow-xl relative overflow-hidden border border-gray-200 rounded-sm w-[800px]">
                <iframe 
                  title="CV Preview"
                  srcDoc={generatedHtml}
                  style={{ width: '100%', height: '1131px', border: 'none' }}
                />
              </div>

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
                    {/* Export PDF Button */}
                    <button 
                      disabled={isExporting}
                      className={`w-full text-white px-5 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all ${
                        isExporting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-[#1c385c] hover:bg-[#152a45] shadow-indigo-900/20'
                      }`}
                      onClick={async () => {
                        if (!analysisId) return;
                        setIsExporting(true);
                        try {
                          const blob = await cvApi.exportPdf(analysisId, generatedHtml);
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `CV_Optimized_${optimizedResult.optimizedData?.fullName?.replace(/\s+/g, '_') || 'Export'}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err) {
                          console.error("Lỗi khi xuất PDF:", err);
                          alert("Đã có lỗi xảy ra khi xuất PDF. Vui lòng thử lại!");
                        } finally {
                          setIsExporting(false);
                        }
                      }}
                    >
                      {isExporting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang tạo PDF...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">file_download</span> 
                          Lưu & Xuất PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Template Selector Panel */}
                <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-5 overflow-hidden flex flex-col">
                  <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500" />
                    Đổi giao diện CV
                  </h3>
                  
                  {isLoadingTemplates ? (
                    <div className="text-center py-4 text-sm text-gray-500">Đang tải mẫu...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] custom-scrollbar p-1">
                      {templates.map(tpl => (
                        <div 
                          key={tpl.id}
                          onClick={() => setSelectedTemplateId(tpl.id)}
                          className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                            selectedTemplateId === tpl.id 
                              ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                              : 'border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={tpl.thumbnailUrl || 'https://via.placeholder.com/150'} 
                            alt={tpl.name}
                            className="w-full h-32 object-cover bg-gray-50" 
                          />
                          <div className="p-2 text-center bg-gray-50 border-t border-gray-100">
                            <span className="text-[11px] font-bold text-gray-700 block truncate">{tpl.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
