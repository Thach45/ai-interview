import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader2, Inbox, ExternalLink, Trash2, Calendar, BrainCircuit } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import UploadCvModal from '../features/cvs/components/UploadCvModal';
import { useCvs } from '../features/cvs/hooks/useCvs';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// PDF Viewer Imports
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// PDF Viewer Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useCvAnalysisHistory } from '../features/cvs/hooks/useCvAnalysis';
import { useNavigate } from 'react-router-dom';

const MyCvs: React.FC = () => {
  const navigate = useNavigate();
  const { cvs, isLoading, refetch } = useCvs();
  const { data: historyResponse, isLoading: isLoadingHistory } = useCvAnalysisHistory();
  const historyData = historyResponse?.data || [];
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const filteredCvs = cvs.filter((cv: any) => 
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Automatically select the first CV when loaded
  useEffect(() => {
    if (filteredCvs.length > 0 && !selectedCvId) {
      setSelectedCvId(filteredCvs[0].id);
    } else if (filteredCvs.length === 0) {
      setSelectedCvId(null);
    }
  }, [filteredCvs, selectedCvId]);

  const selectedCv = cvs.find((cv: any) => cv.id === selectedCvId);
  
  const selectedCvHistory = historyData.filter((item: any) => item.cv?.title === selectedCv?.title || item.cvId === selectedCv?.id);

  return (
    <MainLayout maxWidth="1600px" fullHeight={true} className="px-4 lg:px-8 py-6 flex flex-col">
      <div className="animate-in fade-in duration-500 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Quản lý CV của tôi</h1>
            <p className="text-gray-500 font-medium">Lưu trữ và quản lý các bản CV của bạn để phân tích AI nhanh chóng.</p>
          </div>
          
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-pressed hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Tải lên CV mới</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* Left Column: CV List and History */}
          <div className="w-full lg:w-1/3 flex flex-col h-full gap-4">
            {/* CV List */}
            <div className="flex flex-col bg-white border border-gray-100 rounded-3xl p-4 shadow-sm shrink-0 max-h-[50%]">
            {/* Filters & Search */}
            <div className="flex flex-col gap-3 mb-4 shrink-0">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm CV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="text-primary animate-spin mb-4" size={32} />
                  <p className="text-gray-500 font-medium italic text-sm">Đang tải danh sách...</p>
                </div>
              ) : filteredCvs.length > 0 ? (
                filteredCvs.map((cv: any) => (
                  <div 
                    key={cv.id} 
                    onClick={() => setSelectedCvId(cv.id)}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col gap-2 ${
                      selectedCvId === cv.id 
                        ? 'bg-primary/5 border-primary shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className={`font-bold truncate ${selectedCvId === cv.id ? 'text-primary' : 'text-gray-800 group-hover:text-primary'}`}>
                          {cv.title}
                        </h4>
                        <div className="flex items-center text-gray-400 gap-1.5 mt-1">
                          <Calendar size={12} />
                          <span className="text-[11px] font-medium">
                            {format(new Date(cv.createdAt), 'dd MMMM, yyyy', { locale: vi })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa CV"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add delete logic here
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đã trích xuất</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Inbox className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-500 text-sm max-w-xs mb-4">
                    {searchQuery ? 'Không tìm thấy CV nào.' : 'Chưa có CV nào được tải lên.'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* History Section below CV List */}
          {selectedCv && (
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm overflow-y-auto custom-scrollbar">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="text-primary" /> Lịch sử phân tích
              </h3>
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="text-primary animate-spin mb-2" size={24} />
                </div>
              ) : selectedCvHistory.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedCvHistory.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/30 hover:shadow-sm transition-all group">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider whitespace-nowrap">
                            {item.jobTemplate ? 'Mẫu' : 'Ngoài'}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar size={10} />
                            {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-xs truncate" title={item.jobTemplate?.title || item.externalJobDescription}>
                          {item.jobTemplate?.title || "Phân tích JD Bên Ngoài"}
                        </h4>
                      </div>
                      
                      <div className="flex flex-col items-end shrink-0 gap-1.5">
                        <span className={`text-xs font-extrabold ${item.matchScore >= 80 ? 'text-green-600' : item.matchScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                          {item.matchScore}%
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/jobs/cv-analysis/${item.id}`)}
                            className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary font-medium rounded-lg transition-colors text-[10px]"
                          >
                            Chi tiết
                          </button>
                          {item.isOptimized && (
                            <button
                              onClick={() => navigate(`/jobs/cv-analysis/${item.id}/optimize`)}
                              className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors text-[10px]"
                            >
                              <BrainCircuit size={10} />
                              <span>Đã Tối Ưu</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-gray-500 text-sm">CV này chưa được phân tích lần nào.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: PDF Viewer */}
        <div className="w-full lg:w-2/3 flex flex-col h-full relative">
            <div className="flex-1 flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-0">
              {selectedCv ? (
                <div className="flex-1 overflow-hidden">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                      fileUrl={selectedCv.fileUrl}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </Worker>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50/50">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <ExternalLink className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Xem trước CV</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Chọn một CV từ danh sách bên trái để hiển thị chi tiết tại đây.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <UploadCvModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default MyCvs;
