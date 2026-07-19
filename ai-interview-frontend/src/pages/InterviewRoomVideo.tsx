import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, MessageSquare, Settings, 
   BrainCircuit,
  X, User, Moon, Sun, Circle, ListOrdered, ChevronRight
} from 'lucide-react';
import { cn } from '../shared/utils/cn';
import { InterviewProgressCard } from '../features/interviews/components/InterviewProgressCard';
import { useInterviewSession, useStartInterview, useSendChatAudio, useSubmitInterviewResult, useInterviewSSE } from '../features/interviews/hooks/useInterviewAI';
import { useTTSPlayer } from '../features/interviews/hooks/useTTSPlayer';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingIndicator } from '../shared/components/LoadingIndicator';
import { PERSONA_DETAILS } from '../shared/constants/personas';
import { InterviewPersona } from '../shared/types/interview';
import { toast } from 'sonner';

const InterviewRoomVideoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';

  const { data: sessionResponse } = useInterviewSession(sessionId);
  const startInterviewMutation = useStartInterview(sessionId);
  const sendChatAudioMutation = useSendChatAudio(sessionId);
  const submitInterviewMutation = useSubmitInterviewResult(sessionId);

  const sessionData = sessionResponse || {};
  
  const formatPersona = (p?: string) => {
    if (!p) return 'Professional';
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  };

  const currentConfig = {
    jobTitle: sessionData.jobTitle || 'Loading...',
    companyName: sessionData.companyName || 'Công ty ẩn danh',
    persona: (sessionData.persona),
    duration: sessionData.duration || 30,
    level: sessionData.level || 'Unknown',
    difficulty: sessionData.difficulty || 1,
    coreQuestions: sessionData.coreQuestions || []
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProgressSidebarOpen, setIsProgressSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionResponse?.duration);
  const [currentStatus, setCurrentStatus] = useState(sessionResponse?.status || 'IN_PROGRESS');
  const [rawStreamText, setRawStreamText] = useState("");

  useInterviewSSE(sessionId, (text, isFinished) => {
    // Nếu text mới đến, setRawStreamText
    if (text) setRawStreamText(text);
  });

  const { isSpeaking, spokenText } = useTTSPlayer(sessionId, rawStreamText);

  const [endCountdown, setEndCountdown] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // Đánh dấu đã nộp bài khi server trả trạng thái EVALUATING
  useEffect(() => {
    if (sessionData?.status === 'EVALUATING') {
      setIsFinishing(true);
    }
  }, [sessionData?.status]);

  // Canh me khi AI ngừng nói hẳn 2.5s thì mới bật đếm ngược 5s
  useEffect(() => {
    if (isFinishing && !isSpeaking && endCountdown === null) {
      const timer = setTimeout(() => {
        toast.success("Nộp bài thành công! Đang chuyển hướng sang phòng chờ chấm điểm...");
        setEndCountdown(5);
      }, 300);
      return () => clearTimeout(timer); // Hủy nếu AI bất ngờ nói lại
    }
  }, [isFinishing, isSpeaking, endCountdown]);

  // Đếm ngược 5s rồi đá ra phòng chờ
  useEffect(() => {
    if (endCountdown === null) return;
    if (endCountdown > 0) {
      const timer = setTimeout(() => setEndCountdown(endCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate(`/interview/waiting?sessionId=${sessionId}`);
    }
  }, [endCountdown, navigate, sessionId]);

  useEffect(() => {
    if (sessionData.duration) {
      if (sessionData.startedAt) {
        const startTime = new Date(sessionData.startedAt).getTime();
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remaining = sessionData.duration * 60 - elapsedSeconds;
        setTimeLeft(remaining > 0 ? remaining : 0);
      } else {
        setTimeLeft(sessionData.duration * 60);
      }
    }
    if (sessionData.status) {
      setCurrentStatus(sessionData.status);
    }
  }, [sessionData.duration, sessionData.status, sessionData.startedAt]);

  // Mảng tin nhắn (xóa mock data, để mảng rỗng ban đầu)
  const [messages, setMessages] = useState<any[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Refs cho Media Recorder & Stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Mở luồng Media khi Component mount hoặc isVideoOn thay đổi
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true, // Lấy luôn Audio để ghi âm
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Tắt track hình ảnh nếu isVideoOn = false
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = isVideoOn;
        }
        
        // Tắt/bật track âm thanh (chỉ để mute local preview, không ảnh hưởng record nếu xử lý khéo, 
        // nhưng thực ra ta thu âm trực tiếp từ stream)
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !isMuted;
        }

      } catch (err) {
        console.error("Lỗi khi truy cập camera/micro:", err);
      }
    };
    initMedia();

    return () => {
      // Dọn dẹp stream khi unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Xử lý bật/tắt Video
  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = isVideoOn;
    }
  }, [isVideoOn]);

  // Xử lý Ghi âm khi isRecording thay đổi
  useEffect(() => {
    if (isRecording && streamRef.current) {
      // Lấy riêng track âm thanh để ghi âm (tránh lỗi NotSupportedError do dính track video)
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (!audioTrack) {
        console.error("Không tìm thấy micro!");
        setIsRecording(false);
        return;
      }
      
      const audioStream = new MediaStream([audioTrack]);

      // Bắt đầu ghi âm
      audioChunksRef.current = [];
      
      // Để trống options để trình duyệt tự quyết định định dạng tối ưu nhất cho audio-only
      const recorder = new MediaRecorder(audioStream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Lấy đúng mimeType mà trình duyệt đã dùng để encode
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Gọi Mutation gửi Audio lên Backend
        sendChatAudioMutation.mutate(audioBlob, {
          onSuccess: (res: any) => {
            const data = res.data || res;
            if (data) {
              // Cập nhật trạng thái của buổi phỏng vấn dựa trên AI trả về
              if (data.status) {
                setCurrentStatus(data.status);
              }

              // Thêm tin nhắn của User
              const userMsg = {
                role: 'user',
                content: data.userText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                questionIndex: data.message?.questionIndex || 0
              };
              
              setMessages(prev => [...prev, userMsg]);
            }
          }
        });
      };

      mediaRecorderRef.current = recorder;
      
      // Chuyển giao: Bế câu nói vừa rồi của AI vào Lịch sử Chat trước khi xóa
      if (rawStreamText) {
        const aiHistoryMsg = {
          role: 'bot',
          content: rawStreamText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiHistoryMsg]);
      }

      // Xóa chữ màn hình khi ứng viên bắt đầu nói
      setRawStreamText("");
      
      recorder.start();
    } else {
      // Dừng ghi âm
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
  }, [isRecording]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const [isLobbyMode, setIsLobbyMode] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isLobbyMode) return; // Không đếm lùi khi đang ở sảnh chờ
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLobbyMode]);

  // Initialize lobby mode based on session status (if already in progress, skip lobby)
  useEffect(() => {
    if (sessionData?.status && sessionData.status !== 'PENDING') {
      setIsLobbyMode(false);
    }
  }, [sessionData?.status]);

  const startInterview = () => {
    if (sessionData.id && !startInterviewMutation.isPending && !startInterviewMutation.isSuccess) {
      startInterviewMutation.mutate(undefined, {
        onSuccess: (res: any) => {
          // Xử lý cả trường hợp API trả về mảng trực tiếp hoặc bọc trong .data
          const messagesData = Array.isArray(res) ? res : (res.data || []);
          
          // res có thể chứa toàn bộ lịch sử chat nếu đã bắt đầu từ trước
          const chatHistory = messagesData.map((m: any) => ({
            role: m.role === 'AI' || m.role === 'model' ? 'bot' : 'user',
            content: m.content,
            time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            questionIndex: m.questionIndex || 0
          }));

          if (chatHistory.length > 0) {
            setMessages(chatHistory);
          }
          
          if (messagesData[0] && messagesData[0].content) {
            // Thiết lập raw stream text để AI đọc câu chào đầu tiên
          
            setRawStreamText(messagesData[0].content);
          }
        }
      });
    }
  };

  const handleStartClick = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setIsLobbyMode(false);
      startInterview();
    }
  }, [countdown]);

  // Nếu người dùng reload trang khi đang IN_PROGRESS nhưng chưa fetch tin nhắn, tự động fetch
  useEffect(() => {
    if (!isLobbyMode && sessionData.id && messages.length === 0 && sessionData.status === 'IN_PROGRESS') {
      startInterview();
    }
  }, [isLobbyMode, sessionData.id, messages.length, sessionData.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPersona = PERSONA_DETAILS[currentConfig.persona as InterviewPersona] || PERSONA_DETAILS[InterviewPersona.PROFESSIONAL];

  const handleEndInterview = () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc buổi phỏng vấn ngay bây giờ?')) {
      submitInterviewMutation.mutate();
    }
  };
  if (submitInterviewMutation.isPending) {
    return (
      <LoadingIndicator 
        type="ai" 
        title="Đang tổng hợp Báo cáo Phỏng vấn..." 
        subtitle="AI đang phân tích toàn bộ cuộc hội thoại và chấm điểm dựa trên các tiêu chí chuyên môn." 
        fullScreen={true} 
        aiSteps={[
          "Đọc lại lịch sử toàn bộ cuộc phỏng vấn...",
          "Đánh giá độ chính xác của các câu trả lời kỹ thuật...",
          "Phân tích kỹ năng mềm và khả năng xử lý tình huống...",
          "Đo lường sự tự tin và mạch lạc trong giao tiếp...",
          "Tổng hợp kết quả và tính điểm trung bình...",
          "Tạo lộ trình phát triển năng lực cá nhân..."
        ]}
      />
    );
  }

  return (
    <div className={cn(
      "h-screen w-full flex flex-col overflow-hidden font-sans relative transition-colors duration-500",
      isDarkMode ? "bg-[#0a0a0b] text-white" : "bg-[#f8f9fa] text-gray-900"
    )}>
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-40 bg-gradient-to-br transition-all duration-700",
          isDarkMode ? currentPersona.darkTheme : currentPersona.theme
        )} />
      </div>

      {/* TOP HEADER */}
      <header className={cn(
        "h-14 px-6 flex items-center justify-between z-50 shrink-0 border-b transition-colors duration-300",
        isDarkMode ? "bg-black/20 border-white/5 backdrop-blur-xl" : "bg-white/70 border-gray-200 backdrop-blur-md"
      )}>
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit size={16} className="text-white" />
           </div>
           <div className="flex flex-col">
              <h1 className={cn("text-[13px] font-bold leading-none", isDarkMode ? "text-gray-100" : "text-gray-800")}>
                {currentConfig.jobTitle}
              </h1>
              <span className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">
                {currentConfig.companyName} • {currentConfig.level} • {currentConfig.coreQuestions.length} Câu hỏi
              </span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className={cn(
             "flex items-center gap-2 px-3 py-1 rounded-full shadow-sm border transition-colors",
             isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
           )}>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className={cn("text-[11px] font-mono font-bold", isDarkMode ? "text-gray-300" : "text-gray-600")}>{formatTime(timeLeft)}</span>
           </div>

           <div className={cn("h-6 w-px", isDarkMode ? "bg-white/10" : "bg-gray-200")} />

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsProgressSidebarOpen(!isProgressSidebarOpen)}
                title="Tiến trình phỏng vấn"
                className={cn(
                  "p-2 rounded-xl transition-all",
                  isDarkMode ? "bg-white/5 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900",
                  isProgressSidebarOpen && (isDarkMode ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900")
                )}
              >
                <ListOrdered size={18} />
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  isDarkMode ? "bg-white/5 text-amber-400 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className={cn(
                "p-2 rounded-xl transition-all",
                isDarkMode ? "bg-white/5 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900"
              )}>
                <Settings size={18} />
              </button>
              <button 
                onClick={handleEndInterview}
                disabled={submitInterviewMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all font-bold text-[11px] uppercase shadow-lg shadow-rose-500/10 disabled:opacity-50"
              >
                <PhoneOff size={16} /> Kết thúc
              </button>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden p-4 pb-0 gap-4 relative">
        

        {/* PROGRESS SIDEBAR (LEFT) */}
        <AnimatePresence>
          {isProgressSidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full shrink-0 flex flex-col"
            >
               <div className="w-[340px] h-full pb-4">
                 <InterviewProgressCard 
                   currentQuestionIdx={Math.max(0, ...messages.map(m => m.questionIndex || 0))} 
                   questions={currentConfig.coreQuestions} 
                   isDarkMode={isDarkMode} 
                 />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0 relative h-full">
          <div className={cn(
            "flex-1 relative rounded-t-[32px] overflow-hidden border-t border-x transition-all duration-500 h-full flex items-center justify-center",
            isDarkMode ? "bg-[#0f1115] border-white/5 shadow-2xl" : "bg-[#f1f3f4] border-gray-200 shadow-lg"
          )}>
            <div className="w-full h-full flex flex-col relative group overflow-hidden">
              <div className="flex-1 relative flex items-center justify-center p-6 sm:p-10">
                 <div className={cn(
                   "relative h-full max-h-[92%] aspect-[4/5] sm:aspect-[4/5] md:aspect-[1/1] lg:aspect-[16/10] transition-all duration-500",
                   isSpeaking ? "scale-[1.005]" : ""
                 )}>
                    <div className={cn(
                      "w-full h-full rounded-[40px] overflow-hidden border-4 relative transition-all duration-500",
                      isDarkMode ? "border-white/10 bg-[#1a1c22]" : "border-white bg-white",
                      currentPersona.glow
                    )}>
                      <img 
                        src={currentPersona.avatar} 
                        alt={currentPersona.name} 
                        className={cn(
                          "w-full h-full object-cover object-top transition-all duration-500",
                          isDarkMode ? "brightness-90 contrast-110" : "brightness-100"
                        )}
                      />
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-40 transition-colors duration-500",
                        isDarkMode ? "from-black" : "from-black/60"
                      )} />
                      
                      {/* Name Tag */}
                      <div className="absolute bottom-8 left-8 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                         <div className="flex items-center gap-1">
                            {[1, 2, 3].map(i => (
                              <motion.div 
                                key={i}
                                animate={{ height: isSpeaking ? [4, 12, 4] : 4 }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                className="w-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                              />
                            ))}
                         </div>
                         <span className="text-sm font-bold text-white leading-none tracking-tight">{currentPersona.name}</span>
                      </div>
                    </div>
                 </div>
              </div>

              {/* User Camera PIP */}
              <div className={cn(
                "absolute bottom-8 right-8 w-60 aspect-video rounded-3xl overflow-hidden border-4 shadow-2xl z-10 transition-colors duration-500",
                isDarkMode ? "border-white/10 bg-[#16161a]" : "border-white bg-gray-200"
              )}>
                 {!isVideoOn ? (
                   <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-900/20">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border shadow-inner transition-colors",
                        isDarkMode ? "bg-white/5 border-white/5 text-gray-600" : "bg-white border-gray-100 text-gray-300"
                      )}>
                        <User size={20} />
                      </div>
                      <span className="text-[9px] font-bold uppercase text-gray-500">Camera Off</span>
                   </div>
                 ) : (
                   <div className={cn("w-full h-full flex items-center justify-center relative", isDarkMode ? "bg-gray-800" : "bg-gray-300")}>
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/5">
                        <span className="text-[8px] font-bold text-white uppercase leading-none">You</span>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={cn(
                "rounded-t-3xl border-t border-x flex flex-col overflow-hidden shrink-0 h-full transition-colors duration-500",
                isDarkMode ? "bg-[#0a0a0b] border-white/5 shadow-2xl" : "bg-white border-gray-200 shadow-sm"
              )}
            >
               <div className={cn(
                 "h-14 px-6 border-b flex items-center justify-between",
                 isDarkMode ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50/50"
               )}>
                  <div className="flex items-center gap-2">
                     <MessageSquare size={14} className="text-primary" />
                     <h2 className={cn("text-[11px] font-bold uppercase", isDarkMode ? "text-gray-400" : "text-gray-500")}>Live Transcription</h2>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className={cn("p-1.5 rounded-lg transition-colors", isDarkMode ? "text-gray-600 hover:text-white" : "text-gray-400 hover:bg-gray-100")}>
                    <X size={14} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" ref={scrollRef}>
                  {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                            msg.role === 'bot' 
                              ? (isDarkMode ? "bg-primary/20 text-primary-light" : "bg-primary/10 text-primary") 
                              : (isDarkMode ? "bg-white/5 text-gray-500" : "bg-gray-100 text-gray-500")
                          )}>
                            {msg.role === 'bot' ? currentPersona.name : 'Candidate'}
                          </span>
                       </div>
                       <p className={cn("text-[13px] leading-relaxed font-medium", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                          {msg.content}
                       </p>
                    </div>
                  ))}

                  {/* Hiển thị câu đang được AI nói (Subtitle Mode) */}
                  {spokenText && (
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                            isDarkMode ? "bg-primary/20 text-primary-light" : "bg-primary/10 text-primary"
                          )}>
                            {currentPersona.name}
                          </span>
                       </div>
                       <p className={cn("text-[13px] leading-relaxed font-medium", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                          {spokenText}
                          {isSpeaking && <span className="animate-pulse inline-block ml-1">|</span>}
                       </p>
                    </div>
                  )}
               </div>

               <div className={cn(
                 "p-6 border-t",
                 isDarkMode ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50/20"
               )}>
                  <div className={cn(
                    "p-4 rounded-xl border flex items-center gap-3 transition-colors",
                    isDarkMode ? "bg-black/20 border-white/5" : "bg-white border-gray-200"
                  )}>
       
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM CONTROL BAR - Standardized & Clean */}
      <footer className={cn(
        "h-20 border-t px-10 flex items-center justify-between shrink-0 z-50 transition-colors duration-500",
        isDarkMode ? "bg-[#0a0a0b] border-white/5" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-4 min-w-[200px]">
           <span className="text-[11px] font-bold text-gray-400">{formatTime(timeLeft)} | Session for {currentConfig.jobTitle}</span>
        </div>

        <div className="flex items-center gap-6">
            
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm",
                !isVideoOn 
                  ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20" 
                  : (isDarkMode ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white" : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100")
              )}
            >
              {!isVideoOn ? <VideoOff size={20} /> : <VideoIcon size={20} />}
            </button>
            
            <div className={cn("w-px h-8 mx-2", isDarkMode ? "bg-white/10" : "bg-gray-200")} />

            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "flex items-center gap-3 px-6 h-12 rounded-2xl transition-all border shadow-sm font-bold text-[11px] uppercase",
                isRecording 
                  ? "bg-rose-50 border-rose-200 text-rose-500 animate-pulse" 
                  : (isDarkMode ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100")
              )}
            >
              <Circle size={16} fill={isRecording ? "currentColor" : "none"} />
              {isRecording ? 'Đang ghi âm...' : 'Bắt đầu ghi âm'}
            </button>

            <div className={cn("w-px h-8 mx-2", isDarkMode ? "bg-white/10" : "bg-gray-200")} />

            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-sm",
                isSidebarOpen 
                  ? (isDarkMode ? "bg-primary/20 border-primary/30 text-primary-light shadow-lg shadow-primary/20" : "bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/10") 
                  : (isDarkMode ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10" : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100")
              )}
            >
              <MessageSquare size={20} />
            </button>
        </div>

        <div className="flex items-center gap-3 min-w-[200px] justify-end opacity-50">
            <Settings size={20} className={isDarkMode ? "text-gray-600" : "text-gray-300"} />
        </div>
      </footer>

      {/* FULL SCREEN LOBBY OVERLAY - GLASSMORPHISM */}
      <AnimatePresence>
        {isLobbyMode && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-colors duration-500 p-6"
          >
            {countdown !== null ? (
              <motion.div 
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-9xl font-bold text-white drop-shadow-2xl"
              >
                {countdown}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-center max-w-lg p-10 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  Sẵn sàng phỏng vấn?
                </h2>
                <p className="text-sm text-gray-200 mb-10 leading-relaxed font-medium">
                  Đảm bảo không gian yên tĩnh và trang phục chỉnh tề. AI Interviewer sẽ đánh giá biểu cảm và kỹ năng giao tiếp của bạn một cách tự động.
                </p>
                <button 
                  onClick={handleStartClick}
                  className="w-full py-4 bg-primary hover:bg-primary-deep text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-wide text-sm"
                >
                  Bắt đầu phỏng vấn
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ending Countdown Overlay */}
      <AnimatePresence>
        {endCountdown !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-2xl bg-black/60"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-xl font-medium mb-8"
            >
              Nộp bài thành công! Đang chuyển hướng...
            </motion.h2>
            <motion.div
              key={endCountdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[120px] font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              {endCountdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        }
      `}} />
    </div>
  );
};

export default InterviewRoomVideoPage;
