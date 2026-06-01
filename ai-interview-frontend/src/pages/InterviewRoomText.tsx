import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, BrainCircuit, Clock, X, Bot, User, Settings, Shield, PhoneOff, MessageSquare,
  CheckCircle2, Sparkles, AlertCircle, FileText, ChevronRight, Trophy, HelpCircle, Eye,
  LayoutDashboard, ShieldAlert, Cpu
} from 'lucide-react';
import { cn } from '../shared/utils/cn';
import { ExperienceLevel, InterviewLanguage, InterviewPersona } from '../shared/types/interview';
import { useInterviewSession, useStartInterview, useSendChatMessage, useSubmitInterviewResult } from '../features/interviews/hooks/useInterviewAI';

import { PERSONA_DETAILS } from '../shared/constants/personas';

interface InterviewProgressCardProps {
  currentQuestionIdx: number;
  questions: Array<{
    title: string;
    reason: string;
  }>;
}

const InterviewProgressCard: React.FC<InterviewProgressCardProps> = ({
  currentQuestionIdx,
  questions,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e3df] shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#ede9e4]">
        <span className="text-[11px] font-bold text-slate-400 uppercase">Tiến trình phỏng vấn</span>
        <span className="text-xs font-mono font-bold text-primary">
          Đã xong {currentQuestionIdx} / {questions.length} câu
        </span>
      </div>

      {/* Premium Minimal Progress Bar */}
      <div className="w-full bg-[#f6f5f4] h-1.5 rounded-full overflow-hidden mb-6 border border-[#e5e3df]/40">
        <div 
          className="bg-primary h-full transition-all duration-500 rounded-full" 
          style={{ width: `${(currentQuestionIdx / questions.length) * 100}%` }}
        />
      </div>

      {/* Active Topic Spotlight (Beautiful soft card tint depending on index) */}
      <div className={cn(
        "rounded-xl p-4.5 mb-5 border transition-all duration-300",
        currentQuestionIdx === 0 
          ? "bg-[#e6e0f5]/40 border-[#d3c9ed] text-purple-950" 
          : currentQuestionIdx === 1
            ? "bg-[#dcecfa]/40 border-[#c4dbf2] text-blue-950"
            : currentQuestionIdx === 2
              ? "bg-[#ffe8d4]/40 border-[#f2d3bd] text-orange-950"
              : "bg-[#d9f3e1]/40 border-[#bee8cb] text-emerald-950"
      )}>
        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
          Chủ đề đang diễn ra
        </span>
        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
          {currentQuestionIdx < questions.length 
            ? `${currentQuestionIdx + 1}. ${questions[currentQuestionIdx].title}`
            : "Hoàn tất phỏng vấn!"}
        </h4>
        {currentQuestionIdx < questions.length ? (
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-normal">
            {questions[currentQuestionIdx].reason}
          </p>
        ) : (
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-normal">
            Buổi phỏng vấn đã kết thúc thành công. Hãy bấm nút Kết thúc ở dưới để xem báo cáo đánh giá.
          </p>
        )}
      </div>

      {/* Upcoming topics in simple elegant timeline bullet list */}
      <div className="space-y-3.5 mt-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
          Danh sách chủ đề đánh giá
        </span>
        {questions.map((q, idx) => {
          const isPassed = currentQuestionIdx > idx;
          const isCurrent = currentQuestionIdx === idx;
          
          return (
            <div key={idx} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isPassed 
                    ? "bg-emerald-500" 
                    : isCurrent 
                      ? "bg-primary animate-pulse shadow-sm shadow-primary/40" 
                      : "bg-slate-300"
                )} />
                <span className={cn(
                  "font-medium transition-all duration-300",
                  isCurrent 
                    ? "text-slate-800 font-bold" 
                    : isPassed 
                      ? "text-slate-400 line-through decoration-slate-300" 
                      : "text-slate-500"
                )}>
                  {idx + 1}. {q.title}
                </span>
              </div>
              {isCurrent && (
                <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase">
                  Đang hỏi
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InterviewRoomTextPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';
  const { data: session, isLoading } = useInterviewSession(sessionId);

  // Nhận thông tin cấu hình từ Session DB
  const config = session ? {
    jobTitle: session.jobTitle || 'Vị trí phỏng vấn',
    persona: (session.persona as InterviewPersona) || InterviewPersona.PROFESSIONAL,
    language: (session.language as InterviewLanguage) || InterviewLanguage.VIETNAMESE,
    duration: session.duration || 30,
    level: (session.level as ExperienceLevel) || ExperienceLevel.SENIOR
  } : {
    jobTitle: 'Vị trí phỏng vấn',
    persona: InterviewPersona.PROFESSIONAL,
    language: InterviewLanguage.VIETNAMESE,
    duration: 30,
    level: ExperienceLevel.SENIOR
  };

  // Xác định chi tiết Persona được chọn dựa trên dữ liệu phiên phỏng vấn từ API
  const activePersona = session
    ? (PERSONA_DETAILS[session.persona as InterviewPersona] || PERSONA_DETAILS[InterviewPersona.PROFESSIONAL])
    : PERSONA_DETAILS[InterviewPersona.PROFESSIONAL];

  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Sử dụng câu hỏi cốt lõi thực tế từ DB nếu có
  const activeQuestions = (session?.coreQuestions || []) as Array<{ title: string; reason: string }>;

  // Lịch sử tin nhắn
  const [messages, setMessages] = useState<Array<{
    role: 'bot' | 'user';
    content: string;
    time: string;
    isQuestion?: boolean;
    questionTitle?: string;
    questionIndex?: number;
  }>>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Hooks gọi API thực tế
  const startInterviewMutation = useStartInterview(session?.id || '');
  const sendChatMutation = useSendChatMessage(session?.id || '');
  const submitInterviewMutation = useSubmitInterviewResult(session?.id || '');
  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  // Bộ đếm thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Khi session tải xong, đồng bộ thời gian và gọi API start để nhận câu hỏi đầu tiên từ AI
  useEffect(() => {
    if (session && !isStarted) {
    
      setTimeLeft(session.duration * 60);
      setIsStarted(true);
      setIsBotTyping(true);

      startInterviewMutation.mutate(undefined, {
        onSuccess: (data) => {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newMessages = data.map((msg: any) => ({
            role: 'bot' as const,
            content: msg.content,
            time: now,
            isQuestion: !msg.isFollowUp,
            questionTitle: activeQuestions[msg.questionIndex]?.title,
            questionIndex: msg.questionIndex != null ? msg.questionIndex + 1 : undefined,
          }));
          setMessages(newMessages);
          setIsBotTyping(false);
        },
        onError: () => {
          setIsBotTyping(false);
        },
      });
    }
  }, [session]);

  if (isLoading && sessionId) {
    return (
      <div className="h-screen w-full bg-[#f6f5f4] flex flex-col items-center justify-center text-[#1a1a1a]">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="text-primary animate-pulse size-12" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider animate-pulse">Đang tải phòng phỏng vấn...</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gửi tin nhắn thực tế tới API backend
  const handleSend = () => {
    if (!inputText.trim() || isBotTyping || sendChatMutation.isPending) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const trimmedInput = inputText.trim();
    const userMessage = { role: 'user' as const, content: trimmedInput, time: now, isQuestion: false };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsBotTyping(true);

    sendChatMutation.mutate(trimmedInput, {
      onSuccess: (data) => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const aiMsg = data.message;
        const qIdx = data.currentQuestionIndex;

        const replyMessage = {
          role: 'bot' as const,
          content: aiMsg.content,
          time: replyTime,
          isQuestion: !aiMsg.isFollowUp,
          questionTitle: activeQuestions[qIdx]?.title,
          questionIndex: !aiMsg.isFollowUp ? qIdx + 1 : undefined,
        };

        setMessages(prev => [...prev, replyMessage]);
        
        // Nếu backend trả về trạng thái COMPLETED, ép index lên max để hiển thị Hoàn tất
        if (data.status === 'COMPLETED') {
          setCurrentQuestionIdx(activeQuestions.length);
        } else {
          setCurrentQuestionIdx(qIdx);
        }
        
        setIsBotTyping(false);
      },
      onError: () => {
        setIsBotTyping(false);
      },
    });
  };

  return (
    <div className="h-screen w-full bg-[#f6f5f4] flex flex-col overflow-hidden text-[#1a1a1a] font-sans relative">
      
      {/* 1. HEADER (NOTION-INSPIRED STYLING) */}
      <header className="h-16 px-8 flex items-center justify-between z-30 shrink-0 bg-white border-b border-[#e5e3df] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <BrainCircuit size={20} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-gray-950 leading-none">
              {config.jobTitle}
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              PHIÊN PHỎNG VẤN CHAT TRỰC TUYẾN
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#f6f5f4] border border-[#e5e3df] rounded-lg shadow-inner">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-mono font-bold text-slate-700">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => navigate('/interviews/setup')} 
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-[#e5e3df]"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* 2. MAIN AREA */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative justify-center max-w-[1600px] w-full mx-auto">
        
        {/* LEFT COLUMN: CHAT INTERACTION (70%) */}
        <div className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-[#e5e3df] shadow-sm overflow-hidden relative">
          
          {/* Subheader info block */}
          <div className="px-8 py-5 border-b border-[#ede9e4] flex items-center gap-4 bg-[#fafaf9]">
            <div className="relative">
              <img 
                src={activePersona.avatar} 
                alt={activePersona.name} 
                className="w-12 h-12 rounded-xl object-cover border border-[#e5e3df] shadow-sm bg-slate-100" 
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {activePersona.name}
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">
                Đang trực tuyến
              </p>
            </div>
            
            <div className="ml-auto flex gap-2">
              <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase">
                {config.level}
              </div>
              <div className="text-[11px] font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 uppercase">
                Ngôn ngữ: {config.language === InterviewLanguage.VIETNAMESE ? 'Tiếng Việt' : 'English'}
              </div>
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30" ref={scrollRef}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    key={i} 
                    className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
                  >
                    {!isUser && (
                      <img 
                        src={activePersona.avatar} 
                        alt={activePersona.name} 
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#e5e3df] shadow-sm bg-slate-50" 
                      />
                    )}
                    <div className="flex-1">
                    {!isUser && msg.isQuestion ? (
                      <div className="flex flex-col w-full">
                        <div className="bg-white border-2 border-primary/20 rounded-2xl rounded-tl-none shadow-md overflow-hidden relative max-w-2xl">
                          {/* Top Tag Bar */}
                          <div className="px-5 py-3 bg-gradient-to-r from-primary/5 to-indigo-50/30 border-b border-primary/10 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-primary uppercase flex items-center gap-1.5">
                              <Sparkles size={12} className="animate-spin text-primary shrink-0" style={{ animationDuration: '4s' }} />
                              CÂU HỎI CỐT LÕI {msg.questionIndex} / {activeQuestions.length}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase shrink-0">
                              Đang đánh giá trực tiếp
                            </span>
                          </div>
                          
                          {/* Question Content */}
                          <div className="p-6">
                            <h4 className="text-sm font-extrabold text-slate-900 mb-2.5 leading-snug">
                              🎯 {msg.questionTitle}
                            </h4>
                            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 mt-2 uppercase">
                          {msg.time}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className={cn(
                          "px-6 py-4 rounded-2xl text-[14px] leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.05)] font-normal border",
                          isUser 
                            ? "bg-primary text-white border-primary/20 rounded-tr-none ml-auto" 
                            : "bg-white text-slate-800 border-[#e5e3df] rounded-tl-none mr-auto"
                        )} style={{ maxWidth: '85%' }}>
                          {msg.content}
                        </div>
                        <span className={cn("text-[9px] font-bold text-slate-300 mt-2 uppercase", isUser ? "text-right" : "text-left")}>
                          {msg.time}
                        </span>
                      </div>
                    )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Simulated Bot Typing Animation */}
            {isBotTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-[80%]"
              >
                <img 
                  src={activePersona.avatar} 
                  alt={activePersona.name} 
                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#e5e3df] bg-slate-50" 
                />
                <div className="flex flex-col">
                  <div className="px-6 py-4 bg-white border border-[#e5e3df] rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 w-20 justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 mt-2 uppercase">
                    AI đang phân tích câu trả lời...
                  </span>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Bottom Chat Input Form Area */}
          <div className="p-6 border-t border-[#e5e3df] bg-white">
            {currentQuestionIdx >= activeQuestions.length || session?.status === 'COMPLETED' ? (
              <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                <CheckCircle2 className="text-emerald-500 mb-2 size-8" />
                <h4 className="text-sm font-bold text-emerald-900 mb-1">Hoàn tất buổi phỏng vấn</h4>
                <p className="text-[11px] text-emerald-700/80 mb-4">Dữ liệu của bạn đã được ghi nhận. Hãy xem báo cáo chi tiết.</p>
                <button 
                  onClick={() => {
                    submitInterviewMutation.mutate(undefined, {
                      onSuccess: () => navigate(`/interviews/report?sessionId=${session?.id}`)
                    });
                  }} 
                  disabled={submitInterviewMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitInterviewMutation.isPending ? 'Đang phân tích dữ liệu...' : 'Xem Báo Cáo Phỏng Vấn'}
                  {!submitInterviewMutation.isPending && <ChevronRight size={16} />}
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-3 bg-[#f6f5f4] border border-[#e5e3df] p-2.5 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all focus-within:ring-2 focus-within:ring-primary/10 shadow-inner">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder={`Nhập câu trả lời bằng tiếng ${config.language === InterviewLanguage.ENGLISH ? 'Anh' : 'Việt'}... (Nhấn Enter để gửi)`} 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 py-3 px-4 resize-none min-h-[50px] max-h-[140px] custom-scrollbar leading-relaxed"
                  disabled={isBotTyping}
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim() || isBotTyping}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md group shrink-0 active:scale-95",
                    inputText.trim() && !isBotTyping
                      ? "bg-primary text-white shadow-primary/20 hover:bg-primary-deep hover:scale-[1.05]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                >
                  <Send size={18} className={cn("group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform", inputText.trim() && "text-white")} />
                </button>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-center gap-6 opacity-40">
              <div className="flex items-center gap-2">
                <Shield size={13} className="text-slate-500" />
                <span className="text-[9px] font-bold uppercase text-slate-600">Dữ liệu bảo mật</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI PROFILE & LIVE EVALUATION SIDEBAR (30%) */}
        <div className="w-[30%] hidden lg:flex flex-col gap-6 h-full overflow-y-auto pr-1 pb-1 custom-scrollbar">
          
          <InterviewProgressCard 
            currentQuestionIdx={currentQuestionIdx}
            questions={activeQuestions}
          />

          {/* Card C: Resume Snippet & Parameters */}
          <div className="bg-white rounded-2xl border border-[#e5e3df] shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <FileText size={18} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase">Hồ sơ ứng viên</span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-400">Ứng tuyển vị trí</span>
                <span className="font-bold text-slate-800 text-right">{config.jobTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-400">Trình độ cấu hình</span>
                <span className="font-bold text-slate-800 uppercase">{config.level}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-400">Thời gian quy định</span>
                <span className="font-bold text-slate-800">{config.duration} Phút</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-400">Độ khó mô phỏng</span>
                <span className="font-bold text-slate-800">Cấp độ 3/5</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.16);
        }
      `}} />
    </div>
  );
};

export default InterviewRoomTextPage;

