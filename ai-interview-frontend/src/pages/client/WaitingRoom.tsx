import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInterviewSession, useInterviewSSE } from '../../features/interviews/hooks/useInterviewAI';
import { MainLayout } from '../../layouts/MainLayout';
import { Loader2, Sparkles, RefreshCw, ArrowLeft, ShieldCheck, Mail, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WaitingRoom: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId') || '';

  // Lấy dữ liệu session
  const { data: session, isLoading, refetch } = useInterviewSession(sessionId);

  // Lắng nghe SSE realtime để tự động đồng bộ khi hoàn thành
  useInterviewSSE(sessionId);

  // Theo dõi trạng thái session để tự động chuyển hướng khi chấm điểm xong
  useEffect(() => {
    if (session?.status === 'COMPLETED') {
      navigate(`/interviews/report?sessionId=${sessionId}`);
    }
  }, [session?.status, sessionId, navigate]);

  // Lời khuyên thư giãn trong lúc chờ
  const tips = [
    "Hít thở sâu bằng cơ hoành để giảm nhịp tim và thư giãn hệ thần kinh.",
    "Báo cáo chi tiết sẽ phân tích kỹ năng chuyên môn, tư duy logic và kỹ năng mềm.",
    "Kết quả đánh giá AI này sẽ được lưu trữ vĩnh viễn trong Dashboard của bạn.",
    "Hãy nhấp một ngụm nước ấm để thanh lọc cổ họng và lấy lại cân bằng.",
    "Hệ thống đang đối chiếu câu trả lời của bạn với các tiêu chí năng lực trong JD tuyển dụng."
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <MainLayout maxWidth="100%" hideSearch={true} className="px-4 lg:px-12 py-8 bg-[#FAF9F6] relative min-h-screen">
      {/* Injecting premium CSS Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #faf9f6 25%, #f4f3ef 50%, #faf9f6 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        .shimmer-dark-bg {
          background: linear-gradient(90deg, #f4f3ef 25%, #eae8e3 50%, #f4f3ef 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      {/* BACKGROUND MESH GLOWS */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* MINIMAL FLOATING STATUS HUD */}
      <div className="fixed bottom-6 right-6 md:right-12 z-50 max-w-sm w-[calc(100vw-3rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e3df]/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-4">
        
        {/* Status & Loader */}
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
          <span className="text-sm font-semibold text-slate-800 tracking-tight">Hệ thống đang chấm điểm...</span>
        </div>

        {/* Reassurance text */}
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Kết quả đang được hệ thống phân tích. Bạn sẽ nhận được <strong>Email</strong> và <strong>Thông báo</strong> ngay khi hoàn tất. Bạn có thể yên tâm đóng tab này.
        </p>

        {/* Minimal CTAs */}
        <div className="mt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3 rounded-xl active:scale-[0.98] transition-all shadow-md shadow-primary/20"
          >
            Quay về Dashboard
          </button>
        </div>

      </div>

      {/* EXACT REPORT PAGE SKELETON SIMULATION */}
      <div className="flex flex-col gap-6 w-full mx-auto animate-pulse select-none pointer-events-none filter blur-[0.5px] opacity-70 pb-20">
        
        {/* TOP AI BANNER SKELETON */}
        <div className="bg-white p-8 rounded-xl border border-[#e5e3df]/60 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
          {/* Circular Progress Placeholder */}
          <div className="w-20 h-20 rounded-full border-[5px] border-slate-100 flex items-center justify-center shrink-0">
            <div className="w-8 h-4 shimmer-dark-bg rounded-md" />
          </div>
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 shimmer-dark-bg rounded-full" />
              <div className="w-1/3 h-6 shimmer-dark-bg rounded-lg" />
            </div>
            <div className="space-y-2 w-full">
              <div className="w-full h-3.5 shimmer-bg rounded-md" />
              <div className="w-11/12 h-3.5 shimmer-bg rounded-md" />
              <div className="w-3/4 h-3.5 shimmer-bg rounded-md" />
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION (GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Radar Chart Placeholder */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#e5e3df]/60 shadow-sm flex flex-col items-center justify-center min-h-[400px] relative">
            <div className="absolute top-6 left-6 space-y-2">
              <div className="w-28 h-4 shimmer-dark-bg rounded-md" />
              <div className="w-20 h-3 shimmer-bg rounded-md" />
            </div>
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#e5e3df]/40 flex items-center justify-center mt-6">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#e5e3df]/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#e5e3df]/20" />
              </div>
            </div>
          </div>

          {/* Right: Strengths, Weaknesses, Learning Path */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths */}
              <div className="bg-white p-6 rounded-xl border border-[#e5e3df]/60 shadow-sm flex flex-col space-y-4">
                <div className="w-24 h-4.5 shimmer-dark-bg rounded-md" />
                <div className="space-y-4 flex-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-2 h-2 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                      <div className="space-y-2 w-full">
                        <div className="w-full h-3 shimmer-bg rounded-md" />
                        <div className="w-4/5 h-3 shimmer-bg rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses ("Cần cải thiện") */}
              <div className="bg-white p-6 rounded-xl border border-[#e5e3df]/60 shadow-sm flex flex-col space-y-4">
                <div className="w-24 h-4.5 shimmer-dark-bg rounded-md" />
                <div className="space-y-4 flex-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-2 h-2 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                      <div className="space-y-2 w-full">
                        <div className="w-full h-3 shimmer-bg rounded-md" />
                        <div className="w-4/5 h-3 shimmer-bg rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Learning Path ("Lộ trình đề xuất") */}
            <div className="bg-white p-6 rounded-xl border border-[#e5e3df]/60 shadow-sm space-y-4 flex-1">
              <div className="w-32 h-4.5 shimmer-dark-bg rounded-md" />
              <div className="space-y-4 w-full">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full shimmer-dark-bg flex items-center justify-center shrink-0" />
                    <div className="space-y-2 w-full mt-0.5">
                      <div className="w-11/12 h-3.5 shimmer-bg rounded-md" />
                      <div className="w-3/4 h-3.5 shimmer-bg rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: QUESTION ANALYSIS SKELETON */}
        <div className="bg-white p-8 rounded-xl border border-[#e5e3df]/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-[#e5e3df]/40 pb-4">
            <div className="w-24 h-5 shimmer-dark-bg rounded-md" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#faf9f6]/40 p-6 rounded-xl border border-[#e5e3df]/40 flex flex-col space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 w-full">
                    <div className="w-12 h-3 shimmer-dark-bg rounded-md" />
                    <div className="w-3/4 h-4 shimmer-dark-bg rounded-md" />
                  </div>
                  <div className="w-14 h-6 shimmer-dark-bg rounded-md shrink-0" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 shimmer-bg rounded-md" />
                  <div className="w-5/6 h-3 shimmer-bg rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </MainLayout>
  );
};
