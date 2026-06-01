import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../layouts/MainLayout';
import { interviewAiApi } from '../features/interviews/api/interview-ai.api';
import { LoadingIndicator } from '../shared/components/LoadingIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, BrainCircuit } from 'lucide-react';

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
      <LoadingIndicator 
        type="ai" 
        title="AI đang tải báo cáo đánh giá..." 
        subtitle="Chúng tôi đang chuẩn bị dữ liệu phân tích buổi phỏng vấn của bạn." 
        fullScreen={true} 
      />
    );
  }

  if (error || !response) {
    return (
      <MainLayout hideSearch={true} fullHeight={true}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)]">
           <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
           <p className="text-xl font-semibold text-text-primary">Không thể tải Báo cáo phỏng vấn</p>
           <p className="text-text-secondary mt-2 mb-6">Bạn đã nộp kết quả phỏng vấn chưa?</p>
           <button onClick={() => navigate(-1)} className="px-6 py-2 bg-bg-surface border border-border-hairline text-text-primary font-medium rounded-md hover:bg-gray-100 transition-colors">Quay lại</button>
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
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="100%" className="px-4 lg:px-12 py-8 bg-bg-canvas">
      <div className="flex flex-col gap-6 w-full mx-auto">
        
        {/* Top AI Banner */}
        <div className="bg-bg-canvas p-8 rounded-xl border border-border-hairline flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
          <CircularProgress score={evalData.overall.score} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[28px]">verified</span>
              <h2 className="text-[24px] font-semibold text-text-primary tracking-tight">
                Đánh giá tổng quan: <span className={result.recommendation === 'PASS' ? 'text-emerald-600' : result.recommendation === 'FAIL' ? 'text-red-600' : 'text-amber-600'}>{result.recommendation}</span>
              </h2>
            </div>
            <p className="text-text-secondary text-[15px] leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Middle Section (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Radar Chart */}
          <div className="lg:col-span-5 bg-bg-canvas p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col items-center justify-center relative min-h-[400px]">
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
              <h3 className="text-[16px] font-semibold text-text-primary">Phân tích đa chiều</h3>
            </div>
            <p className="text-[12px] text-text-tertiary absolute top-12 left-6">Di chuột vào điểm để xem chi tiết</p>
            <div className="mt-8 w-full flex justify-center">
              <ScoringRadarChart data={radarData} />
            </div>
          </div>

          {/* Right: Strengths, Weaknesses, Learning Path */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Strengths */}
              <div className="bg-bg-canvas p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col h-full">
                <h3 className="text-[16px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span> 
                  Điểm mạnh
                </h3>
                <ul className="space-y-4 flex-1">
                  {result.strengths.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                      <span className="text-[14px] text-text-secondary leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-bg-canvas p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col h-full">
                <h3 className="text-[16px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[20px]">cancel</span> 
                  Cần cải thiện
                </h3>
                <ul className="space-y-4 flex-1">
                  {result.weaknesses.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                      <span className="text-[14px] text-text-secondary leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Learning Path */}
            <div className="bg-bg-canvas p-6 rounded-xl border border-border-hairline shadow-sm flex-1">
              <h3 className="text-[16px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500 text-[20px]">lightbulb</span> 
                Lộ trình đề xuất
              </h3>
              <ul className="space-y-3">
                {result.learningPath.map((path: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-bg-surface border border-border-hairline text-text-primary flex items-center justify-center shrink-0 font-medium text-[12px]">
                       {i + 1}
                     </div>
                     <p className="text-[14px] text-text-secondary leading-relaxed pt-0.5">
                       {path}
                     </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Section: Question Analysis */}
        <div className="bg-bg-canvas p-8 rounded-xl border border-border-hairline shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border-hairline pb-4">
            <span className="material-symbols-outlined text-primary text-[22px]">forum</span>
            <h3 className="text-[18px] font-semibold text-text-primary">Phân tích chi tiết từng câu hỏi</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.questionEvaluations.map((qe: any, i: number) => (
              <div key={i} className="bg-bg-surface p-6 rounded-xl border border-border-hairline flex flex-col h-full hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <h4 className="text-[15px] font-medium text-text-primary flex-1 leading-snug">
                    <span className="text-text-tertiary mr-2 text-[14px]">#{qe.questionIndex + 1}</span>
                    {qe.questionTitle}
                  </h4>
                  <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-md shrink-0 border ${
                    qe.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                    qe.score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                    'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {qe.score}/100
                  </span>
                </div>
                <div className="flex-1 mt-auto bg-white p-4 rounded-lg border border-border-hairline">
                  <div className="flex items-center gap-1.5 mb-2">
                     <span className="material-symbols-outlined text-primary text-[16px]">smart_toy</span>
                     <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">AI Phản hồi</span>
                  </div>
                  <p className="text-[14px] text-text-secondary leading-relaxed">
                    {qe.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>      
    </MainLayout>
  );
}
