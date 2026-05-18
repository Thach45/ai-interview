import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, MessageSquare, Settings, 
  MoreVertical, Shield, Clock, BrainCircuit,
  ChevronRight, Send, User, Bot, Sparkles,
  Volume2, VolumeX, Maximize2, Minimize2,
  Terminal, Layout, Info, X, Zap, Hand, ScreenShare, MoreHorizontal
} from 'lucide-react';
import { cn } from '../shared/utils/cn';

const InterviewRoomPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config || {
    jobTitle: 'Backend developer',
    persona: 'Professional',
    mode: 'video',
    language: 'Vietnamese',
    duration: 30,
    level: 'Senior'
  };

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(config.mode === 'video');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Chào bạn! Tôi là ${config.persona === 'Professional' ? 'Thảo Chi' : config.persona === 'Friendly' ? 'Nam Anh' : config.persona === 'Strict' ? 'Quốc Hùng' : 'Linh San'}. Rất vui được gặp bạn trong buổi phỏng vấn hôm nay. Chúng ta bắt đầu với phần giới thiệu bản thân nhé?`, time: '14:00' }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');

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
    'Professional': { name: 'Ms. Thảo Chi', avatar: '/avatars/thao-chi.png', theme: 'from-blue-100 to-indigo-100', glow: 'shadow-blue-200', accent: 'text-blue-600', bg: 'bg-blue-50' },
    'Friendly': { name: 'Mr. Nam Anh', avatar: '/avatars/nam-anh.png', theme: 'from-emerald-100 to-teal-100', glow: 'shadow-emerald-200', accent: 'text-emerald-600', bg: 'bg-emerald-50' },
    'Strict': { name: 'Mr. Quốc Hùng', avatar: '/avatars/quoc-hung.png', theme: 'from-rose-100 to-orange-100', glow: 'shadow-rose-200', accent: 'text-rose-600', bg: 'bg-rose-50' },
    'Cheerful': { name: 'Ms. Linh San', avatar: '/avatars/linh-san.png', theme: 'from-amber-100 to-orange-100', glow: 'shadow-amber-200', accent: 'text-amber-600', bg: 'bg-amber-50' },
  };

  const currentPersona = (personas as any)[config.persona] || personas.Professional;

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { role: 'user', content: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputText('');
    setTimeout(() => {
      setIsSpeaking(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: 'Cảm ơn phần chia sẻ của bạn. Bạn có thể nói rõ hơn về kinh nghiệm xử lý các tình huống áp lực cao trong công việc không?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsSpeaking(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="h-screen w-full bg-[#f8f9fa] flex flex-col overflow-hidden text-gray-900 font-sans relative">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={cn("absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-40 bg-gradient-to-br", currentPersona.theme)} />
      </div>

      {/* TOP HEADER */}
      <header className="h-14 px-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BrainCircuit size={16} className="text-white" />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[13px] font-bold text-gray-800 leading-none">{config.jobTitle}</h1>
              <span className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">Interview Session</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-gray-600">{formatTime(timeLeft)}</span>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden p-4 pb-0 gap-4 relative">
        
        {/* INTERVIEW SPACE */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">
          <div className={cn(
            "flex-1 relative rounded-t-[32px] overflow-hidden border-t border-x border-gray-200 bg-[#0f1115] shadow-lg flex items-center justify-center transition-all duration-500 h-full",
            config.mode === 'text' ? "bg-white p-8 rounded-3xl border" : ""
          )}>
            
            {config.mode === 'video' ? (
              /* VIDEO MODE */
              <div className="w-full h-full flex flex-col relative group overflow-hidden">
                {/* Main AI View - Optimized to show head */}
                <div className="flex-1 relative flex items-center justify-center bg-gray-900/50 p-6 sm:p-10">
                   <div className={cn(
                     "relative h-full max-h-[92%] aspect-[4/5] sm:aspect-[4/5] md:aspect-[1/1] lg:aspect-[16/10] transition-all duration-500",
                     isSpeaking ? "scale-[1.005]" : ""
                   )}>
                      <div className={cn(
                        "w-full h-full rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl relative bg-[#1a1c22]",
                        currentPersona.glow
                      )}>
                        <img 
                          src={currentPersona.avatar} 
                          alt={currentPersona.name} 
                          className="w-full h-full object-cover object-top" // Force head to be visible
                        />
                        {/* Overlay to give it depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40" />
                        
                        {/* Name Tag */}
                        <div className="absolute bottom-8 left-8 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-3">
                           <div className="flex items-center gap-1">
                              {[1, 2, 3].map(i => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: isSpeaking ? [4, 12, 4] : 4 }}
                                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                  className="w-1 bg-green-500 rounded-full"
                                />
                              ))}
                           </div>
                           <span className="text-sm font-bold text-white leading-none">{currentPersona.name}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* User Camera PIP */}
                <div className="absolute bottom-10 right-10 w-60 aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gray-800 z-10">
                   {!isVideoOn ? (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-800">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 shadow-inner">
                          <User size={20} />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-gray-500">Camera Off</span>
                     </div>
                   ) : (
                     <div className="w-full h-full bg-gray-700 flex items-center justify-center relative">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Camera Active</span>
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/5">
                          <span className="text-[8px] font-bold text-white uppercase leading-none">You</span>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            ) : (
              /* TEXT MODE */
              <div className="w-full h-full max-w-3xl mx-auto flex flex-col">
                 <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar" ref={scrollRef}>
                    {messages.map((msg, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
                      >
                         <div className={cn(
                           "px-5 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                           msg.role === 'user' 
                             ? "bg-primary text-white rounded-tr-none" 
                             : "bg-gray-100 text-gray-700 border border-gray-200 rounded-tl-none"
                         )}>
                           {msg.content}
                         </div>
                         <span className="text-[9px] font-bold text-gray-300 mt-1.5 uppercase">{msg.time}</span>
                      </motion.div>
                    ))}
                    {isSpeaking && (
                      <div className="flex gap-1.5 p-3 bg-gray-50 border border-gray-200 rounded-xl w-16 items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75" />
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150" />
                      </div>
                    )}
                 </div>
                 
                 <div className="mt-8 relative shrink-0">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 p-2 rounded-2xl shadow-sm focus-within:border-primary transition-all">
                       <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        placeholder="Nhập phản hồi..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 py-3 px-4 resize-none min-h-[50px] max-h-[150px] custom-scrollbar"
                      />
                      <button 
                        onClick={handleSend}
                        className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white rounded-t-3xl border-t border-x border-gray-200 flex flex-col overflow-hidden shadow-sm shrink-0 h-full"
            >
               <div className="h-14 px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                     <MessageSquare size={14} className="text-primary" />
                     <h2 className="text-[11px] font-bold uppercase text-gray-500">Live Transcription</h2>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                    <X size={14} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" ref={scrollRef}>
                  {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                            msg.role === 'bot' ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                          )}>
                            {msg.role === 'bot' ? currentPersona.name : 'Candidate'}
                          </span>
                       </div>
                       <p className="text-[13px] leading-relaxed text-gray-600 font-medium">
                          {msg.content}
                       </p>
                    </div>
                  ))}
               </div>

               <div className="p-6 border-t border-gray-100 bg-gray-50/20">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                     <Shield size={14} className="text-emerald-500" />
                     <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">End-to-end Encrypted</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM CONTROL BAR */}
      <footer className="h-20 bg-white border-t border-gray-200 px-10 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4 min-w-[200px]">
           <span className="text-[11px] font-bold text-gray-400">{formatTime(timeLeft)} | Session for {config.jobTitle}</span>
        </div>

        <div className="flex items-center gap-4">
           <button 
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                isMuted ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20" : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
              )}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                !isVideoOn ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20" : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
              )}
            >
              {!isVideoOn ? <VideoOff size={20} /> : <VideoIcon size={20} />}
            </button>
            
            <div className="w-px h-8 bg-gray-200 mx-2" />

            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200">
               <Hand size={20} />
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200">
               <ScreenShare size={20} />
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200">
               <MoreHorizontal size={20} />
            </button>

            <div className="w-px h-8 bg-gray-200 mx-2" />

            <button 
              onClick={() => navigate('/interviews/setup')}
              className="px-8 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg shadow-rose-500/10 transition-all uppercase text-[11px]"
            >
              <PhoneOff size={18} />
              Kết thúc
            </button>
        </div>

        <div className="flex items-center gap-3 min-w-[200px] justify-end">
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isSidebarOpen ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <MessageSquare size={20} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100">
              <Settings size={20} />
            </button>
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
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}} />
    </div>
  );
};

export default InterviewRoomPage;
