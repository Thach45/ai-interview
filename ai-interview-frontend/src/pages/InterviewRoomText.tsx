import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Send, BrainCircuit, Clock, X, Bot, User, Info, Settings, Shield, PhoneOff, MessageSquare
} from 'lucide-react';
import { cn } from '../shared/utils/cn';

const InterviewRoomTextPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config || {
    jobTitle: 'Backend developer',
    persona: 'Professional',
    language: 'Vietnamese',
    duration: 30,
    level: 'Senior'
  };

  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Chào bạn! Tôi là ${config.persona}. Chúng ta sẽ bắt đầu phiên phỏng vấn cho vị trí ${config.jobTitle} qua tin nhắn nhé. Bạn đã sẵn sàng chưa?`, time: '14:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

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

  const handleSend = () => {
    if (!inputText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { role: 'user', content: inputText, time: now }]);
    setInputText('');
    
    setIsBotTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Cảm ơn phần chia sẻ của bạn. Bạn có thể nói rõ hơn về cách bạn tối ưu hóa hiệu năng trong các dự án thực tế không?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsBotTyping(false);
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-[#f8f9fa] flex flex-col overflow-hidden text-gray-900 font-sans relative">
      <header className="h-14 px-6 flex items-center justify-between z-50 shrink-0 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BrainCircuit size={16} className="text-white" />
           </div>
           <div className="flex flex-col">
              <h1 className="text-[13px] font-bold text-gray-800 leading-none">{config.jobTitle}</h1>
              <span className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">Chat Interview Session</span>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
              <Clock size={12} className="text-gray-400" />
              <span className="text-[11px] font-mono font-bold text-gray-600">{formatTime(timeLeft)}</span>
           </div>
           <button onClick={() => navigate('/interviews/setup')} className="text-gray-400 hover:text-rose-500 transition-colors">
              <X size={20} />
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative justify-center">
        <div className="w-full max-w-3xl flex flex-col h-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Bot size={24} />
              </div>
              <div>
                 <h3 className="text-sm font-bold text-gray-800">{config.persona}</h3>
                 <p className="text-[10px] text-emerald-500 font-bold uppercase">Online & Analyzing</p>
              </div>
              <div className="ml-auto flex gap-2">
                 <div className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all cursor-pointer"><Info size={18}/></div>
                 <div className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all cursor-pointer"><Settings size={18}/></div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar" ref={scrollRef}>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
                >
                   <div className={cn(
                     "px-6 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm max-w-[85%]",
                     msg.role === 'user' 
                       ? "bg-primary text-white rounded-tr-none" 
                       : "bg-gray-100 text-gray-700 border border-gray-200 rounded-tl-none"
                   )}>
                     {msg.content}
                   </div>
                   <span className="text-[9px] font-bold text-gray-300 mt-2 uppercase tracking-wide">{msg.time}</span>
                </motion.div>
              ))}
              {isBotTyping && (
                <div className="flex gap-1.5 p-4 bg-gray-50 border border-gray-200 rounded-2xl w-20 items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                   <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75" />
                   <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150" />
                </div>
              )}
           </div>
           
           <div className="p-6 border-t border-gray-100">
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all shadow-inner">
                 <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Nhập câu trả lời của bạn..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 py-3 px-4 resize-none min-h-[50px] max-h-[150px] custom-scrollbar"
                />
                <button 
                  onClick={handleSend}
                  className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={22} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 opacity-50">
                 <div className="flex items-center gap-2">
                    <Shield size={12} />
                    <span className="text-[9px] font-bold uppercase">Secured</span>
                 </div>
                 <div className="w-1 h-1 rounded-full bg-gray-300" />
                 <div className="flex items-center gap-2">
                    <MessageSquare size={12} />
                    <span className="text-[9px] font-bold uppercase">Encrypted</span>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="h-16 border-t border-gray-100 px-10 flex items-center justify-between shrink-0 bg-white">
         <div className="text-[11px] font-bold text-gray-400">SESSION ID: INT-9928-AXQ</div>
         <button onClick={() => navigate('/interviews/setup')} className="flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-500 rounded-xl font-bold text-[11px] uppercase hover:bg-rose-500 hover:text-white transition-all">
            <PhoneOff size={14} /> Kết thúc phỏng vấn
         </button>
         <div className="flex items-center gap-4">
            <Settings size={18} className="text-gray-300" />
            <div className="w-8 h-8 rounded-full bg-gray-100" />
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

export default InterviewRoomTextPage;
