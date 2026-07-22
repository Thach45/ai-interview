import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { useCv } from '../../features/cvs/hooks/useCvs';
import { useAnalyzeCvExternal } from '../../features/cvs/hooks/useCvAnalysis';
import {
  FileText,
  AlertCircle,
  Loader2,
  BrainCircuit,
  Upload,
  Calendar,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { CvHtmlPreview } from '../../features/cvs/components/my-cv/CvHtmlPreview';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const AnalyzeExternalCvPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cvId = searchParams.get('cvId');
  const { data: selectedCv, isLoading: isLoadingCv, isError: isCvError, error: cvError } = useCv(cvId);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [jobDescription, setJobDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { analyzeCvExternal, isSubmitting } = useAnalyzeCvExternal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cvId) {
      setError('Không tìm thấy CV. Vui lòng chọn CV từ trang My CV.');
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError('Mô tả công việc quá ngắn (tối thiểu 50 ký tự).');
      return;
    }
    if (jobDescription.trim().length > 1000) {
      setError('Mô tả công việc quá dài (tối đa 1000 ký tự).');
      return;
    }

    try {
      await analyzeCvExternal({ cvId, jobDescription });
      setJobDescription('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const charCount = jobDescription.length;
  const isShort = charCount > 0 && charCount < 50;
  const canSubmit = cvId && charCount >= 50 && charCount <= 1000 && !isLoadingCv && selectedCv;

  return (
    <MainLayout hideSearch={true} maxWidth="1600px" className="px-4 lg:px-8 py-4 flex flex-col">
      <div className="animate-in fade-in duration-500 flex flex-col h-full w-full">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Phân tích CV theo JD</h1>
          </div>
        </div>

        {/* Khung chính chia cột với chiều cao khống chế chặt chẽ */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] min-h-0 w-full">

          {/* Left Column: Form Controls (1/3 width) */}
          <div className="w-full lg:w-1/3 flex flex-col h-full min-h-0 shrink-0">
            <div className="flex flex-col bg-white border border-gray-100 rounded-3xl p-5 shadow-sm h-full min-h-0">

              <div className="mb-4 shrink-0">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <BrainCircuit size={16} className="text-primary" />
                  Cấu hình phân tích
                </h3>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 shrink-0 animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <span className="text-red-700 text-xs font-medium">{error}</span>
                </div>
              )}

              {/* CV Đã Chọn */}
              <div className="mb-5 shrink-0">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  CV đã chọn
                </label>

                {!cvId ? (
                  <div className="p-3 border border-amber-100 rounded-xl bg-amber-50 text-amber-700 text-xs font-medium">
                    <span>Vui lòng chọn CV từ trang </span>
                    <Link to="/my-cvs" className="text-xs font-bold text-primary hover:underline">My CV</Link>
                  </div>
                ) : isLoadingCv ? (
                  <div className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 text-xs font-medium">
                    <Loader2 className="animate-spin text-primary" size={14} /> Đang tải thông tin CV...
                  </div>
                ) : isCvError ? (
                  <div className="p-3 border border-red-100 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                    {(cvError as any)?.response?.data?.message || 'Không thể tải thông tin CV. Vui lòng thử lại.'}
                  </div>
                ) : selectedCv ? (
                  <div className="flex items-center gap-2.5 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                    <FileText size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-bold text-gray-900 truncate">{selectedCv.title}</span>
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-visible">
                {/* JD Textarea */}
                <div className="flex-1 flex flex-col min-h-0 mb-4">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Mô tả công việc (JD)
                    </label>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${charCount > 900 ? 'bg-red-50 text-red-500' : isShort ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
                      {charCount}/1000
                    </span>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Dán yêu cầu công việc (JD) vào đây để phân tích độ phù hợp với CV của bạn..."
                    maxLength={1000}
                    className="w-full flex-1 p-4 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-xs font-medium text-gray-800 resize-none custom-scrollbar leading-relaxed min-h-0"
                  />
                  {isShort && (
                    <span className="text-[10px] text-amber-600 font-medium mt-1.5 shrink-0">
                      Yêu cầu nhập tối thiểu 50 ký tự (còn thiếu {50 - charCount} ký tự).
                    </span>
                  )}
                </div>

                {/* Submit Block */}
                <div className="shrink-0 flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Chi phí: 1 credit
                  </span>
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-pressed transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <BrainCircuit size={14} />
                        <span>Phân tích</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

          {/* Right Column: PDF Viewer / Preview (2/3 width) */}
          <div className="flex-1 min-h-0 lg:w-2/3 h-full relative">
            <div className="absolute inset-0 flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

              {/* CV Toolbar Header */}
              <div className="shrink-0 border-b border-gray-100 px-5 py-4 bg-white z-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400">
                      <FileText size={14} className="text-primary shrink-0" />
                      CV đang chọn
                    </div>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-gray-950 min-w-0">
                      <span className="truncate">{selectedCv?.title || 'Chưa chọn CV'}</span>
                      {selectedCv?.createdAt && (
                        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500 sm:inline-flex">
                          <Calendar size={12} />
                          {new Date(selectedCv.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Viewer Area - Cấu trúc flex-1 relative để khống chế absolute child */}
              <div className="flex-1 min-h-0 relative bg-[#f3f4f6]">
                {!cvId ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white overflow-y-auto">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-amber-100">
                      <ArrowLeft size={36} className="text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">Chưa chọn CV</h3>
                    <p className="text-[13px] text-gray-400 max-w-xs mx-auto mb-4">
                      Vui lòng vào trang My CV và chọn một CV để phân tích.
                    </p>
                    <Link
                      to="/my-cvs"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:bg-primary-pressed transition-all"
                    >
                      <Upload size={15} />
                      Đi tới My CV
                    </Link>
                  </div>
                ) : isLoadingCv ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <Loader2 className="animate-spin text-primary" size={28} />
                  </div>
                ) : isCvError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white overflow-y-auto">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-red-100">
                      <AlertCircle className="text-red-400" size={36} />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">Không thể tải CV</h3>
                    <p className="text-[13px] text-gray-400 max-w-xs mx-auto mb-4">
                      {(cvError as any)?.response?.data?.message || 'Đã có lỗi xảy ra khi tải CV.'}
                    </p>
                    <Link
                      to="/my-cvs"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:bg-primary-pressed transition-all"
                    >
                      <Upload size={15} />
                      Quay lại My CV
                    </Link>
                  </div>
                ) : selectedCv?.fileUrl ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={selectedCv.fileUrl}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                ) : selectedCv?.renderedHtml ? (
                  <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#f3f4f6] p-4 flex justify-center items-start custom-scrollbar">
                    <CvHtmlPreview html={selectedCv.renderedHtml} />
                  </div>
                ) : selectedCv?.templateId ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 overflow-y-auto">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
                      <BrainCircuit className="text-indigo-500" size={36} />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">CV từ Builder</h3>
                    <p className="text-[13px] text-gray-400 max-w-xs mx-auto mb-4">
                      Mở trong CV Builder để xem và chỉnh sửa.
                    </p>
                    <button
                      onClick={() => navigate(`/cv-builder/${selectedCv.templateId}?id=${selectedCv.id}`)}
                      className="px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-bold shadow-lg shadow-primary/20 hover:bg-primary-pressed transition-all"
                    >
                      <BrainCircuit size={16} className="inline mr-1.5" />
                      Mở trong CV Builder
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 overflow-y-auto">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                      <ExternalLink className="text-gray-300" size={36} />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">Xem trước CV</h3>
                    <p className="text-[13px] text-gray-400 max-w-xs mx-auto">
                      CV này chưa có file đính kèm.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyzeExternalCvPage;