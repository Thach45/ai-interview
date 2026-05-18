import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, MessageSquare, Settings, 
  Shield, Clock, BrainCircuit,
  X, Zap, Bot, User, Moon, Sun, Circle
} from 'lucide-react';
import { cn } from '../shared/utils/cn';

const InterviewRoomVideoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config || {
    jobTitle: 'Backend developer',
    persona: 'Professional',
    language: 'Vietnamese',
    duration: 30,
    level: 'Senior'
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Chào bạn! Tôi là ${config.persona}. Rất vui được gặp bạn trong buổi phỏng vấn hôm nay. Chúng ta bắt đầu nhé?`, time: '14:00' }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const personas = {
    'Professional': { name: 'Ms. Thảo Chi', avatar: '/avatars/thao-chi.png', theme: 'from-blue-100 to-indigo-100', glow: 'shadow-blue-200', accent: 'text-blue-600', darkTheme: 'from-blue-900/20 to-indigo-900/20' },
    'Friendly': { name: 'Mr. Nam Anh', avatar: '/avatars/nam-anh.png', theme: 'from-emerald-100 to-teal-100', glow: 'shadow-emerald-200', accent: 'text-emerald-600', darkTheme: 'from-emerald-900/20 to-teal-900/20' },
    'Strict': { name: 'Mr. Quốc Hùng', avatar: '/avatars/quoc-hung.png', theme: 'from-rose-100 to-orange-100', glow: 'shadow-rose-200', accent: 'text-rose-600', darkTheme: 'from-rose-900/20 to-orange-900/20' },
    'Cheerful': { name: 'Ms. Linh San', avatar: '/avatars/linh-san.png', theme: 'from-amber-100 to-orange-100', glow: 'shadow-amber-200', accent: 'text-amber-600', darkTheme: 'from-amber-900/20 to-orange-900/20' },
  };

  const currentPersona = (personas as any)[config.persona] || personas.Professional;

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
              <h1 className={cn("text-[13px] font-bold leading-none", isDarkMode ? "text-gray-100" : "text-gray-800")}>{config.jobTitle}</h1>
              <span className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">Video Interview Session</span>
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
                onClick={() => navigate('/interviews/setup')}
                className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all font-bold text-[11px] uppercase shadow-lg shadow-rose-500/10"
              >
                <PhoneOff size={16} /> Kết thúc
              </button>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden p-4 pb-0 gap-4 relative">
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
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Camera Feed</span>
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
               </div>

               <div className={cn(
                 "p-6 border-t",
                 isDarkMode ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50/20"
               )}>
                  <div className={cn(
                    "p-4 rounded-xl border flex items-center gap-3 transition-colors",
                    isDarkMode ? "bg-black/20 border-white/5" : "bg-white border-gray-200"
                  )}>
                     <Shield size={14} className="text-emerald-500" />
                     <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">End-to-end Encrypted</p>
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
           <span className="text-[11px] font-bold text-gray-400">{formatTime(timeLeft)} | Session for {config.jobTitle}</span>
        </div>

        <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm",
                isMuted 
                  ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20" 
                  : (isDarkMode ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white" : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100")
              )}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
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
