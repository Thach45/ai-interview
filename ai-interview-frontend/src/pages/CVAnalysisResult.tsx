import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cvApi } from '../features/cvs/api/cv.api';
import { useCvs } from '../features/cvs/hooks/useCvs';
import { 
  FileText, CheckCircle, XCircle, AlertTriangle, 
  ChevronLeft, Download, Share2, ZoomIn, ZoomOut, Maximize,
  Briefcase, GraduationCap, Award, Lightbulb, TrendingUp,
  BrainCircuit, Target, Sparkles, ChevronRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// PDF Viewer Imports
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// PDF Viewer Styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// API data is fetched directly using React Query.

const CATEGORY_LABELS: Record<string, string> = {
  TECHNICAL_SKILLS: 'Kỹ năng kỹ thuật',
  EXPERIENCE: 'Kinh nghiệm',
  SOFT_SKILLS: 'Kỹ năng mềm',
  EDUCATION: 'Học vấn',
  PROJECT_RELEVANCE: 'Độ phù hợp dự án',
};

const CATEGORY_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  TECHNICAL_SKILLS: { bg: 'bg-blue-50', bar: 'bg-blue-500', text: 'text-blue-700' },
  EXPERIENCE:       { bg: 'bg-purple-50', bar: 'bg-purple-500', text: 'text-purple-700' },
  SOFT_SKILLS:      { bg: 'bg-green-50', bar: 'bg-green-500', text: 'text-green-700' },
  EDUCATION:        { bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-700' },
  PROJECT_RELEVANCE:{ bg: 'bg-rose-50', bar: 'bg-rose-500', text: 'text-rose-700' },
};

// --- Scoring Radar Chart with Tooltip ---

const ScoringRadarChart = ({ data }: { data: any[] }) => {
  const [tooltip, setTooltip] = useState<{ mouseX: number; mouseY: number; detail: any } | null>(null);
  const hideTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const size = 320;
  const center = size / 2;
  const radius = (size / 2) - 55;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (value: number, index: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.sin(index * angleStep);
    const y = center - r * Math.cos(index * angleStep);
    return { x, y };
  };

  const polygon = data.map((d, i) => { const p = getPoint(d.score, i); return `${p.x},${p.y}`; }).join(' ');

  const showTooltip = (e: React.MouseEvent, d: any) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setTooltip({ mouseX: e.clientX, mouseY: e.clientY, detail: d });
  };

  const scheduleHide = () => {
    hideTimeout.current = setTimeout(() => setTooltip(null), 120);
  };

  const cancelHide = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <svg width={size} height={size} className="overflow-visible">
        {[20, 40, 60, 80, 100].map(level => (
          <polygon
            key={level}
            points={data.map((_, i) => { const p = getPoint(level, i); return `${p.x},${p.y}`; }).join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray={level === 100 ? '0' : '4 4'}
          />
        ))}
        {data.map((_, i) => {
          const outer = getPoint(100, i);
          return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="#e5e7eb" strokeWidth="1" />;
        })}
        <polygon points={polygon} fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth="2" />
        {data.map((d, i) => {
          const p = getPoint(d.score, i);
          const label = getPoint(114, i);
          return (
            <g key={i}>
              <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="600" fill="#6b7280">
                {CATEGORY_LABELS[d.category]?.split(' ').map((w: string, wi: number) => (
                  <tspan key={wi} x={label.x} dy={wi === 0 ? 0 : 13}>{w}</tspan>
                ))}
              </text>
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#7c3aed">
                {d.score}
              </text>
              <circle
                cx={p.x} cy={p.y} r="8"
                fill="#7c3aed"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, d)}
                onMouseLeave={scheduleHide}
              />
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="fixed z-50 w-60 max-h-44 overflow-y-auto rounded-2xl bg-gray-900 text-white shadow-2xl border border-white/10"
          style={{ left: tooltip.mouseX + 14, top: tooltip.mouseY - 20 }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <div className="sticky top-0 bg-gray-800 px-3 pt-3 pb-1.5 rounded-t-2xl border-b border-white/10">
            <p className="font-bold text-[12px] text-purple-300">
              {CATEGORY_LABELS[tooltip.detail.category]}
              <span className="ml-2 text-white font-extrabold">{tooltip.detail.score}/100</span>
            </p>
          </div>
          <div className="px-3 pb-3 pt-1.5">
            <p className="text-[11px] text-gray-300 leading-relaxed">{tooltip.detail.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Custom Components ---

const RadarChart = ({ data }: { data: any[] }) => {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (value: number, index: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.sin(index * angleStep);
    const y = center - r * Math.cos(index * angleStep);
    return `${x},${y}`;
  };

  const userPolygon = data.map((d, i) => getPoint(d.user, i)).join(" ");
  const reqPolygon = data.map((d, i) => getPoint(d.required, i)).join(" ");

  return (
    <div className="relative flex items-center justify-center w-full h-[320px]">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background webs */}
        {[20, 40, 60, 80, 100].map((level) => (
          <polygon
            key={level}
            points={data.map((_, i) => getPoint(level, i)).join(" ")}
            fill="none"
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="1"
            strokeDasharray={level === 100 ? "0" : "4 4"}
          />
        ))}
        
        {/* Axis lines */}
        {data.map((_, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.sin(i * angleStep)}
            y2={center - radius * Math.cos(i * angleStep)}
            stroke="currentColor"
            className="text-gray-200"
            strokeWidth="1"
          />
        ))}

        {/* Required Polygon */}
        <polygon
          points={reqPolygon}
          fill="rgba(245, 158, 11, 0.1)"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* User Polygon */}
        <polygon
          points={userPolygon}
          fill="rgba(124, 58, 237, 0.2)"
          stroke="#7c3aed"
          strokeWidth="2"
        />

        {/* Data points for user */}
        {data.map((d, i) => {
          const [x, y] = getPoint(d.user, i).split(",");
          return (
            <circle key={`user-pt-${i}`} cx={x} cy={y} r="4" fill="#7c3aed" />
          );
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.sin(i * angleStep);
          const y = center - labelRadius * Math.cos(i * angleStep);
          
          let textAnchor = "middle";
          if (Math.abs(Math.sin(i * angleStep)) > 0.1) {
            textAnchor = Math.sin(i * angleStep) > 0 ? "start" : "end";
          }
          
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="text-[11px] font-medium fill-gray-500"
            >
              {d.skill || d.name}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-[-10px] flex gap-4 text-[12px] font-medium">
        <div className="flex items-center gap-1.5 text-primary">
          <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
          CV của bạn
        </div>
        <div className="flex items-center gap-1.5 text-amber-500">
          <div className="w-3 h-3 rounded-full bg-amber-500/10 border border-amber-500 border-dashed"></div>
          Yêu cầu Job
        </div>
      </div>
    </div>
  );
};

const CircularProgress = ({ score }: { score: number }) => {
  const radius = 35;
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "text-green-500";
  if (score < 50) color = "text-red-500";
  else if (score < 75) color = "text-amber-500";
  else color = "text-primary";

  return (
    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-gray-100"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold tracking-tight ${color}`}>{score}%</span>
      </div>
    </div>
  );
};

export default function CVAnalysisResultPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const cvId = searchParams.get('cvId');
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'recommendations'>('overview');
  
  const { cvs } = useCvs();
  const selectedCv = cvs.find(c => c.id === cvId);

  const { data: analysisResponse, isLoading, error } = useQuery({
    queryKey: ['analyze-cv', cvId, id],
    queryFn: () => cvApi.analyzeCv(cvId!, id!),
    enabled: !!cvId && !!id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!cvId || !id) {
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
      <MainLayout hideSearch={true} fullHeight={true} className="bg-[#fafafa]">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] animate-in fade-in zoom-in duration-500">
           <div className="relative mb-8">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
             <BrainCircuit size={80} className="text-primary relative animate-bounce" />
           </div>
           <h2 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">AI đang phân tích CV của bạn...</h2>
           <p className="text-gray-500 font-medium max-w-md text-center">Quá trình này có thể mất vài chục giây để hệ thống đọc hiểu, trích xuất dữ liệu và đối chiếu đa chiều với yêu cầu tuyển dụng.</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !analysisResponse) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <XCircle size={60} className="text-red-500 mb-4" />
           <p className="text-xl font-bold text-gray-800">Lỗi khi phân tích CV</p>
           <p className="text-gray-500 mt-2 mb-6">Không thể kết nối với AI hoặc CV không hợp lệ.</p>
           <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Thử lại</button>
        </div>
      </MainLayout>
    );
  }

  const result = analysisResponse;

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 pt-2 overflow-hidden bg-[#fafafa]">
      
     

      {/* Main Split Content */}
      <div className="flex gap-6 h-[calc(100vh-140px)] p-3">
        
        {/* LEFT COLUMN: PDF / CV Viewer */}
        <div className="w-[45%] flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
          {/* Professional PDF Viewer using react-pdf-viewer */}
          <div className="flex-1 overflow-hidden relative">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
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
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1.5">
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
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" /> Điểm mạnh
                      </h3>
                      <ul className="space-y-3">
                        {result.strengths.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="mt-1 min-w-1.5 min-h-1.5 rounded-full bg-green-400"></div>
                            <span className="text-[13px] text-gray-700 leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <XCircle size={18} className="text-red-500" /> Điểm cần cải thiện
                      </h3>
                      <ul className="space-y-3">
                        {result.weaknesses.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="mt-1 min-w-1.5 min-h-1.5 rounded-full bg-red-400"></div>
                            <span className="text-[13px] text-gray-700 leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing Keywords Box */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/50">
                    <h3 className="text-[14px] font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-500" /> Từ khóa thiếu sót quan trọng
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.length > 0 ? result.missingKeywords.map((keyword: string) => (
                        <div key={keyword} className="px-3 py-1.5 bg-white text-amber-800 text-[12px] font-bold rounded-lg border border-amber-200 shadow-sm flex items-center gap-1.5">
                          {keyword}
                          <span className="material-symbols-outlined text-[14px] opacity-50">add_circle</span>
                        </div>
                      )) : (
                        <p className="text-[13px] text-amber-700 font-medium">CV của bạn đã bao gồm hầu hết các từ khóa quan trọng.</p>
                      )}
                    </div>
                    <p className="text-[12px] text-amber-700/80 mt-3 font-medium">
                      Việc bổ sung các từ khóa này vào CV có thể tăng tỷ lệ match lên đến <span className="font-bold text-amber-600">12%</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-8"
                >
                  <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-6 w-full text-left">Biểu đồ Kỹ năng</h3>
                    <RadarChart data={result.skillsAnalysis} />
                  </div>
                  
                  <div className="w-[40%] flex flex-col gap-3">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-2">Chi tiết mức độ phù hợp</h3>
                    {result.skillsAnalysis.map((skill: any, i: number) => {
                      const gap = skill.required - skill.user;
                      const isGood = gap <= 0;
                      
                      return (
                        <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[13px] font-bold text-gray-800">{skill.skill}</span>
                            <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${
                              isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {isGood ? 'Đạt yêu cầu' : `Thiếu hụt ${gap}%`}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 w-16 uppercase font-bold tracking-wider">Bạn có</span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${skill.user}%` }}
                                ></div>
                              </div>
                              <span className="text-[11px] font-medium text-gray-700 w-6 text-right">{skill.user}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-amber-500 w-16 uppercase font-bold tracking-wider">Yêu cầu</span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-amber-400 rounded-full" 
                                  style={{ width: `${skill.required}%` }}
                                ></div>
                              </div>
                              <span className="text-[11px] font-medium text-gray-700 w-6 text-right">{skill.required}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'recommendations' && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-[14px] text-gray-600 mb-6 bg-white p-4 rounded-xl border border-gray-200">
                    Dựa trên phân tích yêu cầu công việc và CV của bạn, AI của chúng tôi đề xuất các bước hành động sau để tối ưu hóa hồ sơ của bạn.
                  </p>
                  
                  {result.improvementSuggestions.map((rec: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          rec.priority === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                        }`}>
                          <TrendingUp size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors">{rec.title}</h4>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
                              rec.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              Mức độ: {rec.priority}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                            {rec.desc}
                          </p>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[12px] font-semibold text-gray-800">💡 Giải pháp AI gợi ý:</p>
                            <p className="text-[12px] text-gray-600 mt-1">{rec.solution}</p>
                          </div>
                          
                          <div className="mt-3">
                            <button className="text-[12px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                              Áp dụng gợi ý này bằng AI <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* CTA Update CV */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="text-primary" size={24} />
                    </div>
                    <h3 className="text-[16px] font-bold text-gray-900 mb-2">Sẵn sàng để nổi bật?</h3>
                    <p className="text-[13px] text-gray-600 mb-5 max-w-sm mx-auto">
                      Để AI của chúng tôi tự động viết lại CV của bạn dựa trên các đề xuất trên và yêu cầu công việc.
                    </p>
                    <button className="px-6 py-2.5 bg-primary text-white text-[14px] font-bold rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl transition-all">
                      Cập nhật CV tự động
                    </button>
                  </div>
                </motion.div>
              )}
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
