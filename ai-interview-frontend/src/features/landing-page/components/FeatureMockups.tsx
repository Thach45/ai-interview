import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Video, Play, CheckCircle2, ChevronRight, Mic, Camera, XCircle, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const customEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: customEase } }
};

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-5xl aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <Play size={48} className="mb-4 opacity-50" />
              <p className="font-medium text-lg">Đang kết nối luồng Live: {title}</p>
              <p className="text-sm mt-2">Video hướng dẫn đang được biên tập. Tính năng trải nghiệm trực tiếp sẽ sớm mở cho tài khoản của bạn.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FeatureMockups: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32">
      <VideoModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo || ''} />

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-6">Giao diện trực quan. Trải nghiệm chân thực.</h2>
        <p className="text-[17px] text-gray-500 leading-relaxed font-medium">Mô phỏng chính xác môi trường phỏng vấn chuyên nghiệp tại các tập đoàn lớn. Trải nghiệm tương tác mượt mà với AI theo thời gian thực.</p>
      </motion.div>

      {/* Feature 1: CV Analysis (True to system) */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 lg:pr-12">
           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-[11px] font-bold rounded-full mb-6 uppercase tracking-wider">
             <FileText size={14} /> Phân Tích ATS
           </div>
           <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Phân Tích Độ Tương Thích CV & Mô Tả Công Việc</h3>
           <p className="text-gray-500 text-[16px] leading-relaxed mb-8">
             Thay vì chấm điểm chung chung, hệ thống hiển thị chính xác những từ khóa bạn đang thiếu và những kỹ năng nào trùng khớp với mô tả công việc, trên giao diện chia đôi trực quan.
           </p>
           <button onClick={() => setActiveVideo('Phân tích CV')} className="group flex items-center gap-2 font-bold text-gray-900 hover:text-primary transition-colors">
             <div className="size-10 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
               <Play size={16} className="ml-1" />
             </div>
             Xem Cách Hoạt Động
           </button>
        </div>

        {/* Real Mock UI: CV Analysis Result */}
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="flex-1 w-full bg-gray-100/50 p-2 rounded-[2rem] border border-gray-200"
        >
           <div className="w-full h-[400px] bg-[#fafafa] rounded-[calc(2rem-8px)] flex gap-4 p-4 shadow-inner overflow-hidden border border-gray-200/50">
              {/* Left: PDF Viewer Mock */}
              <div className="flex-[4] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                 <div className="h-8 border-b border-gray-100 bg-gray-50 flex items-center px-4 gap-1.5">
                   <div className="size-2.5 rounded-full bg-red-400"></div>
                   <div className="size-2.5 rounded-full bg-amber-400"></div>
                   <div className="size-2.5 rounded-full bg-green-400"></div>
                 </div>
                 <div className="flex-1 p-6 space-y-4 opacity-50">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "50%" }} transition={{ duration: 1, delay: 0.2 }} className="h-6 bg-gray-200 rounded-md"></motion.div>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "75%" }} transition={{ duration: 1, delay: 0.3 }} className="h-4 bg-gray-100 rounded-md"></motion.div>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.4 }} className="h-2 bg-gray-100 rounded-md mt-6"></motion.div>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "83%" }} transition={{ duration: 1, delay: 0.5 }} className="h-2 bg-gray-100 rounded-md"></motion.div>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: "66%" }} transition={{ duration: 1, delay: 0.6 }} className="h-2 bg-gray-100 rounded-md"></motion.div>
                 </div>
              </div>
              {/* Right: AI Insights */}
              <div className="flex-[5] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative size-16 flex items-center justify-center">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <motion.path 
                          initial={{ strokeDasharray: "0, 100" }}
                          whileInView={{ strokeDasharray: "85, 100" }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                          className="text-primary" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="absolute text-lg font-bold">85</motion.div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1"><Sparkles size={14} className="text-primary"/> <span className="font-bold text-sm">Đánh giá độ phù hợp</span></div>
                      <p className="text-xs text-gray-500">Hồ sơ rất tốt, đáp ứng đa số yêu cầu cốt lõi.</p>
                    </div>
                 </div>
                 <div className="p-4 flex-1 bg-gray-50/50">
                    <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Kỹ năng phân tích</div>
                    <div className="space-y-2">
                       <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 bg-white p-2 border border-gray-100 rounded-lg shadow-sm">
                         <CheckCircle2 size={14} className="text-green-500" /> <span className="text-xs font-medium">ReactJS, TypeScript (Trùng khớp)</span>
                       </motion.div>
                       <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="flex items-center gap-2 bg-white p-2 border border-gray-100 rounded-lg shadow-sm">
                         <XCircle size={14} className="text-red-500" /> <span className="text-xs font-medium text-gray-500">CI/CD, Docker (Thiếu)</span>
                       </motion.div>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </motion.div>

      {/* Feature 2: Video Interview (True to system) */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col lg:flex-row-reverse gap-12 items-center">
        <div className="flex-1 lg:pl-12">
           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-[11px] font-bold rounded-full mb-6 uppercase tracking-wider">
             <Video size={14} /> Phỏng Vấn AI 1:1
           </div>
           <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Đối thoại trực tiếp với nhà tuyển dụng ảo</h3>
           <p className="text-gray-500 text-[16px] leading-relaxed mb-8">
             Tham gia vào không gian phỏng vấn chuyên nghiệp. Bật Camera và Micro, AI sẽ tự động lắng nghe giọng nói của bạn (Real-time Speech-to-Text) và phản hồi bằng giọng nói tự nhiên, kèm khung chat bên cạnh để theo dõi.
           </p>
           <button onClick={() => setActiveVideo('Phỏng vấn giả lập')} className="group flex items-center gap-2 font-bold text-gray-900 hover:text-primary transition-colors">
             <div className="size-10 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
               <Play size={16} className="ml-1" />
             </div>
             Xem Cách Hoạt Động
           </button>
        </div>

        {/* Real Mock UI: Interview Room Video */}
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          className="flex-1 w-full bg-gray-100/50 p-2 rounded-[2rem] border border-gray-200"
        >
           <div className="w-full h-[400px] bg-gray-900 rounded-[calc(2rem-8px)] flex p-2 gap-2 shadow-inner overflow-hidden border border-gray-800">
              
              {/* Left: Video Area */}
              <div className="flex-[3] flex flex-col gap-2">
                 {/* Main AI Video Frame */}
                 <div className="flex-1 bg-[#1a1a1a] rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <BrainCircuit size={150} />
                    </div>
                    {/* Simulated TTS speaking wave */}
                    <div className="flex items-center gap-1 z-10">
                      {[1,2,3,2,1].map((h, i) => (
                        <motion.div key={i} className="w-1.5 bg-primary rounded-full" animate={{ height: [h*5, h*25, h*5] }} transition={{ repeat: Infinity, duration: 1.2, delay: i*0.15, ease: "easeInOut" }} />
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-medium text-white flex items-center gap-2">
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="size-2 bg-green-500 rounded-full"></motion.div> AI Interviewer
                    </div>
                 </div>

                 {/* User Mini Frame & Controls */}
                 <div className="h-28 flex gap-2">
                    <div className="h-full aspect-video bg-gray-800 rounded-xl relative border border-gray-700 overflow-hidden">
                      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute inset-0 bg-gray-700 opacity-50"></motion.div>
                      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">Bạn</div>
                    </div>
                    <div className="flex-1 bg-[#1a1a1a] rounded-xl border border-gray-800 flex items-center justify-center gap-4">
                       <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-white cursor-pointer hover:bg-gray-700 transition-colors"><Mic size={18} /></motion.div>
                       <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-white cursor-pointer hover:bg-gray-700 transition-colors"><Camera size={18} /></motion.div>
                       <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="size-10 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors"><XCircle size={18} /></motion.div>
                    </div>
                 </div>
              </div>

              {/* Right: Side Chat */}
              <div className="flex-[2] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                 <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <span className="font-bold text-xs text-gray-800">Khung Chat</span>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold animate-pulse">Live</span>
                 </div>
                 <div className="flex-1 p-3 space-y-3 overflow-hidden opacity-80">
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-gray-100 p-2 rounded-lg rounded-tl-none text-[10px] text-gray-700 w-[90%] origin-top-left">
                      Chào bạn, hãy giới thiệu đôi chút về bản thân nhé.
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }} className="bg-primary/10 text-primary-pressed p-2 rounded-lg rounded-tr-none text-[10px] w-[90%] ml-auto origin-top-right">
                      Dạ chào nhà tuyển dụng, tôi là một Frontend Developer với 3 năm kinh nghiệm...
                    </motion.div>
                 </div>
              </div>
           </div>
        </motion.div>
      </motion.div>

    </section>
  );
};
