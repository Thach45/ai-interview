import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../layouts/MainLayout';
import { interviewAiApi } from '../features/interviews/api/interview-ai.api';
import { 
  CheckCircle, XCircle, AlertTriangle, 
  ChevronLeft, Award, Lightbulb,
  BrainCircuit, Target, ChevronRight, ChevronDown,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// CATEGORY LABELS for our 5-axis/6-axis radar
const CATEGORY_LABELS: Record<string, string> = {
  overall: 'Tổng quan',
  domain: 'Kiến thức chuyên môn',
  problemSolving: 'Giải quyết vấn đề',
  clarity: 'Sự mạch lạc',
  confidence: 'Sự tự tin',
  relevance: 'Bám sát trọng tâm'
};

const CATEGORY_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  overall: { bg: 'bg-blue-50', bar: 'bg-blue-500', text: 'text-blue-700' },
  domain: { bg: 'bg-purple-50', bar: 'bg-purple-500', text: 'text-purple-700' },
  problemSolving: { bg: 'bg-green-50', bar: 'bg-green-500', text: 'text-green-700' },
  clarity: { bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-700' },
  confidence: { bg: 'bg-rose-50', bar: 'bg-rose-500', text: 'text-rose-700' },
  relevance: { bg: 'bg-indigo-50', bar: 'bg-indigo-500', text: 'text-indigo-700' },
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
        <polygon points={polygon} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" />
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
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#3b82f6">
                {d.score}
              </text>
              <circle
                cx={p.x} cy={p.y} r="8"
                fill="#3b82f6"
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
          className="fixed z-50 w-64 max-h-48 overflow-y-auto rounded-2xl bg-gray-900 text-white shadow-2xl border border-white/10 p-3"
          style={{ left: tooltip.mouseX + 14, top: tooltip.mouseY - 20 }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <p className="font-bold text-[13px] text-blue-300 mb-2">
            {CATEGORY_LABELS[tooltip.detail.category]}
            <span className="ml-2 text-white font-extrabold">{tooltip.detail.score}/100</span>
          </p>
          <p className="text-[12px] text-gray-300 leading-relaxed">{tooltip.detail.reason}</p>
        </div>
      )}
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

export default function InterviewResultPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'recommendations'>('overview');

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['interview-result', sessionId],
    queryFn: () => interviewAiApi.getInterviewResult(sessionId!),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  if (!sessionId) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <AlertTriangle size={48} className="text-amber-500 mb-4" />
           <p className="text-lg font-bold">Thiếu thông tin phiên phỏng vấn</p>
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
           <h2 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">AI đang tải báo cáo đánh giá...</h2>
           <p className="text-gray-500 font-medium max-w-md text-center">Chúng tôi đang chuẩn bị dữ liệu phân tích buổi phỏng vấn của bạn.</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !response) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <XCircle size={60} className="text-red-500 mb-4" />
           <p className="text-xl font-bold text-gray-800">Không thể tải Báo cáo phỏng vấn</p>
           <p className="text-gray-500 mt-2 mb-6">Bạn đã nộp kết quả phỏng vấn chưa?</p>
           <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Quay lại</button>
        </div>
      </MainLayout>
    );
  }

  const result = response;
  const evalData = result.generalEvaluation;
  
  // Chuẩn bị data cho biểu đồ Radar
  const radarData = [
    { category: 'overall', score: evalData.overall.score, reason: evalData.overall.reason },
    { category: 'domain', score: evalData.domain.score, reason: evalData.domain.reason },
    { category: 'problemSolving', score: evalData.problemSolving.score, reason: evalData.problemSolving.reason },
    { category: 'clarity', score: evalData.clarity.score, reason: evalData.clarity.reason },
    { category: 'confidence', score: evalData.confidence.score, reason: evalData.confidence.reason },
    { category: 'relevance', score: evalData.relevance.score, reason: evalData.relevance.reason },
  ];

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 pt-2 overflow-hidden bg-[#fafafa]">
      <div className="flex flex-col gap-6 h-[calc(100vh-100px)] p-3">
        {/* RIGHT COLUMN: AI Insights (We use full width since no PDF viewer for interviews usually, or a wide center container) */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden max-w-5xl mx-auto w-full">
          
          {/* AI Banner */}
          <div className="bg-white p-6 shrink-0 border-b border-gray-100 flex gap-6 items-center">
            <CircularProgress score={evalData.overall.score} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Kết quả phỏng vấn: <span className={result.recommendation === 'PASS' ? 'text-green-600' : result.recommendation === 'FAIL' ? 'text-red-600' : 'text-amber-600'}>{result.recommendation}</span></h2>
                </div>
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
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 w-full text-center">Đánh giá đa chiều</p>
                <p className="text-[12px] text-gray-400 mb-4 w-full text-center">Di chuột vào từng điểm để xem nhận xét chi tiết</p>
                <ScoringRadarChart data={radarData} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Tabs */}
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
              { id: 'overview', label: 'Tổng quan điểm mạnh yếu', icon: Target },
              { id: 'questions', label: 'Phân tích từng câu hỏi', icon: MessageSquare },
              { id: 'recommendations', label: 'Lộ trình cải thiện', icon: Lightbulb }
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
                </motion.div>
              )}

              {activeTab === 'questions' && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-[14px] text-gray-600 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    Dưới đây là điểm số và phản hồi từ AI dành cho từng câu hỏi cốt lõi mà bạn đã trả lời trong buổi phỏng vấn.
                  </p>
                  
                  {result.questionEvaluations.map((qe: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors">
                              Câu hỏi {qe.questionIndex + 1}: {qe.questionTitle}
                            </h4>
                            <span className={`text-[12px] font-bold px-2.5 py-1 rounded-md ${
                              qe.score >= 80 ? 'bg-green-100 text-green-700' : qe.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                              Điểm: {qe.score}/100
                            </span>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 rounded-l-xl"></div>
                            <p className="text-[13px] text-gray-700 leading-relaxed italic">
                              "{qe.feedback}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <p className="text-[14px] text-gray-600 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    Dựa trên quá trình phân tích kỹ năng trả lời và kiến thức, AI của chúng tôi xây dựng lộ trình học tập để giúp bạn hoàn thiện hơn.
                  </p>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <ul className="space-y-4">
                      {result.learningPath.map((path: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                           <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-[12px]">
                             {i + 1}
                           </div>
                           <p className="text-[14px] text-gray-700 leading-relaxed pt-0.5">
                             {path}
                           </p>
                        </li>
                      ))}
                    </ul>
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
