import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { 
  Sparkles, Cpu, CheckCircle2, 
  ArrowRight, ArrowLeft, BrainCircuit,
  Briefcase, Building2, FileText, Languages,
  UserCircle, Settings2, Target, Clock,
  ChevronRight, AlertCircle, Trash2, Plus,
  Info, Rocket, Zap, ChevronDown, Upload,
  Search, Check
} from 'lucide-react';
import { cn } from '../shared/utils/cn';
import { useCvs } from '../features/cvs/hooks/useCvs';

const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { cvs, uploadCv, isUploading } = useCvs();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jdText: '',
    selectedCvId: '',
    language: 'Vietnamese',
    persona: 'Professional',
    duration: 30,
    difficulty: 3,
    skills: [] as string[],
    newSkill: ''
  });

  const personas = [
    { id: 'Professional', name: 'Chuyên nghiệp', desc: 'Nghiêm túc, cân bằng, tập trung vào phương pháp STAR.', icon: UserCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 'Friendly', name: 'Hỗ trợ', desc: 'Tông giọng khích lệ, giúp bạn xây dựng sự tự tin.', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { id: 'Strict', name: 'Áp lực', desc: 'Đặt câu hỏi dồn dập, xoáy sâu vào các điểm yếu.', icon: Target, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const languages = [
    { id: 'Vietnamese', name: 'Tiếng Việt', flag: '🇻🇳' },
    { id: 'English', name: 'English', flag: '🇺🇸' },
    { id: 'Bilingual', name: 'Song ngữ', flag: '🌍' },
  ];

  const steps = [
    { id: 1, title: 'Bối cảnh & JD', icon: Briefcase, desc: 'Vị trí bạn đang ứng tuyển là gì?' },
    { id: 2, title: 'Kinh nghiệm', icon: FileText, desc: 'Chọn CV phù hợp nhất' },
    { id: 3, title: 'Người phỏng vấn', icon: UserCircle, desc: 'Chọn đối thủ của bạn' },
    { id: 4, title: 'Thông số phiên', icon: Settings2, desc: 'Tinh chỉnh buổi phỏng vấn' },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/interview-room', { state: { config: formData } });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadCv({ file, title: file.name });
        setFormData({ ...formData, selectedCvId: result.id });
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 pt-2 overflow-hidden bg-[#fafafa]">
      
      <div className="flex gap-6 h-[calc(100vh-100px)] p-3">
        
        {/* LEFT COLUMN: Guide & Steps */}
        <div className="w-[26%] flex flex-col bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-24 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-[60px]" />
          </div>

          <div className="relative z-10 flex flex-col h-full p-6 lg:p-8">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Rocket className="text-white" size={20} />
                </div>
                <span className="text-lg font-bold text-gray-900">Smart Interview</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                Thiết lập <span className="text-primary">Phiên tập</span>
              </h1>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
              {steps.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                const Icon = s.icon;
                
                return (
                  <div key={s.id} className="relative group/step">
                    <button 
                      onClick={() => s.id < step && setStep(s.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl transition-all text-left border",
                        isActive 
                          ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-primary/20" 
                          : "bg-transparent border-transparent hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isActive ? "bg-primary text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                      )}>
                        {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-[10px] font-bold uppercase",
                          isActive ? "text-primary" : "text-gray-400"
                        )}>Bước 0{s.id}</p>
                        <h4 className={cn(
                          "text-sm font-bold",
                          isActive ? "text-gray-900" : "text-gray-500"
                        )}>{s.title}</h4>
                      </div>
                      
                      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover/step:opacity-100 pointer-events-none transition-all z-50 shadow-xl translate-x-2 group-hover/step:translate-x-0">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                        <p className="font-medium leading-relaxed">{s.desc}</p>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-3 text-gray-400 hover:text-primary transition-colors cursor-help group/tip relative">
              <Zap size={16} />
              <span className="text-[11px] font-bold uppercase">Mẹo thiết lập</span>
              <div className="absolute bottom-full left-0 mb-4 w-64 p-4 bg-white border border-gray-100 shadow-2xl rounded-2xl opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-all z-50">
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  Chọn CV có kinh nghiệm liên quan nhất đến vị trí bạn đang ứng tuyển để AI có thể đưa ra các câu hỏi chuyên sâu và chính xác.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Area */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
          
          <div className="h-16 border-b border-gray-100 px-8 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                  </div>
                ))}
              </div>
              <span className="text-[12px] font-bold text-gray-400">2,400+ ứng viên đang luyện tập</span>
            </div>
            <button onClick={() => navigate(-1)} className="text-[12px] font-bold text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-2">
              THOÁT <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-3xl mx-auto w-full"
              >
                {/* Step 1: Context */}
                {step === 1 && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-gray-900">Vị trí ứng tuyển <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
                            placeholder="Ví dụ: Senior Frontend Engineer"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-gray-900">Tên công ty <span className="text-gray-400 font-normal">(Tùy chọn)</span></label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
                            placeholder="Ví dụ: Google, TechCorp..."
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[13px] font-bold text-gray-900">Mô tả công việc (JD)</label>
                        <span className="text-[10px] font-bold text-gray-300">ĐỘNG CƠ AI V4.2</span>
                      </div>
                      <div className="relative">
                        <textarea
                          className="w-full p-8 rounded-3xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium min-h-[300px] leading-relaxed"
                          placeholder="Dán nội dung JD vào đây để AI phân tích các yêu cầu, kỹ năng và trách nhiệm..."
                          value={formData.jdText}
                          onChange={(e) => setFormData({ ...formData, jdText: e.target.value })}
                        />
                        <div className="absolute bottom-6 right-6">
                           <div className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-400 shadow-sm">
                             {formData.jdText.length} ký tự
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Experience */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">Chọn CV của bạn</h3>
                      <p className="text-sm text-gray-400">Vui lòng chọn hồ sơ bạn muốn sử dụng</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cvs.map((cv: any) => (
                        <button
                          key={cv.id}
                          onClick={() => setFormData({ ...formData, selectedCvId: cv.id })}
                          className={cn(
                            "p-5 rounded-2xl border-2 text-left transition-all relative flex items-center gap-4",
                            formData.selectedCvId === cv.id 
                              ? "border-primary bg-primary/[0.02] shadow-lg shadow-primary/5" 
                              : "border-gray-50 bg-gray-50/50 hover:border-gray-100 hover:bg-white"
                          )}
                        >
                          <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{cv.title || 'CV chưa đặt tên'}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">Tải lên ngày: {new Date(cv.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                          {formData.selectedCvId === cv.id && (
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                              <Check size={14} />
                            </div>
                          )}
                        </button>
                      ))}
                      
                      <label className="p-5 rounded-2xl border-2 border-dashed border-gray-200 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/[0.02] transition-all flex flex-col items-center justify-center gap-3 min-h-[100px]">
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                        {isUploading ? (
                          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                              <Upload size={20} />
                            </div>
                            <span className="text-[11px] font-bold text-gray-500 uppercase">Tải lên hồ sơ mới</span>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="mt-10 p-6 bg-primary/[0.03] rounded-3xl border border-primary/10 flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <BrainCircuit size={20} className="text-primary" />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Hệ thống sẽ tự động trích xuất thông tin từ hồ sơ bạn đã chọn để tối ưu hóa bộ câu hỏi phỏng vấn.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: AI Persona */}
                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Chọn người phỏng vấn</h3>
                        <p className="text-gray-400 text-sm">Phong cách đối thoại bạn muốn trải nghiệm</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {personas.map((p) => {
                          const isActive = formData.persona === p.id;
                          const Icon = p.icon;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setFormData({ ...formData, persona: p.id })}
                              className={cn(
                                "flex flex-col items-center text-center p-8 rounded-3xl border-2 transition-all relative group",
                                isActive 
                                  ? "border-primary bg-primary/[0.02] shadow-lg shadow-primary/5" 
                                  : "border-gray-50 bg-gray-50/50 hover:border-gray-100 hover:bg-white"
                              )}
                            >
                              <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110",
                                p.bg, p.color
                              )}>
                                <Icon size={32} />
                              </div>
                              <h4 className="text-base font-bold text-gray-900 mb-2">{p.name}</h4>
                              <p className="text-[11px] text-gray-500 leading-relaxed mb-6 flex-1">{p.desc}</p>
                              <div className={cn(
                                "px-5 py-1.5 rounded-full text-[10px] font-bold border transition-all",
                                isActive ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-100 group-hover:border-gray-200"
                              )}>
                                {isActive ? 'ĐÃ CHỌN' : 'CHỌN'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-8 border-t border-gray-50 pt-12">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Ngôn ngữ giao tiếp</h3>
                        <p className="text-gray-400 text-sm">Lựa chọn ngôn ngữ sử dụng trong phiên</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        {languages.map(lang => (
                          <button
                            key={lang.id}
                            onClick={() => setFormData({ ...formData, language: lang.id })}
                            className={cn(
                              "px-8 h-16 rounded-2xl border-2 transition-all flex items-center gap-3 font-bold text-sm active:scale-95",
                              formData.language === lang.id 
                                ? "border-primary bg-primary/5 text-primary shadow-md" 
                                : "border-gray-50 text-gray-400 bg-gray-50/30 hover:bg-white hover:border-gray-100"
                            )}
                          >
                            <span className="text-2xl">{lang.flag}</span>
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Final Parameters */}
                {step === 4 && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-900">Độ khó hội thoại</h3>
                          <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase">Cấp độ {formData.difficulty}</span>
                        </div>
                        <div className="space-y-4 px-2">
                          <input 
                            type="range" min="1" max="5" 
                            value={formData.difficulty} 
                            onChange={(e) => setFormData({...formData, difficulty: Number(e.target.value)})} 
                            className="w-full h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary" 
                          />
                          <div className="flex justify-between text-[10px] font-bold text-gray-300">
                            <span>DỄ</span>
                            <span>TRUNG BÌNH</span>
                            <span>HÀN LÂM</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <h3 className="text-lg font-bold text-gray-900">Thời lượng (Phút)</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[15, 30, 45, 60].map(m => (
                            <button 
                              key={m} 
                              onClick={() => setFormData({...formData, duration: m})} 
                              className={cn(
                                "h-20 rounded-3xl font-bold transition-all flex flex-col items-center justify-center gap-0.5 border",
                                formData.duration === m 
                                  ? "bg-gray-900 text-white border-gray-900 shadow-xl scale-[1.02]" 
                                  : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:border-gray-200"
                              )}
                            >
                              <span className="text-xl">{m}</span>
                              <span className="text-[9px] uppercase font-bold">Phút</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 border-t border-gray-50 pt-12">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Kỹ năng cần tập trung</h3>
                        <p className="text-[11px] text-gray-400 font-medium">AI sẽ ưu tiên đặt câu hỏi xoay quanh các kỹ năng này</p>
                      </div>
                      <div className="p-8 rounded-[32px] bg-gray-50/30 border border-gray-100 flex flex-wrap gap-3 content-start min-h-[140px]">
                        {formData.skills.map(skill => (
                          <div key={skill} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[12px] font-bold flex items-center gap-2.5 shadow-sm hover:border-primary/20 transition-all group">
                            {skill}
                            <button onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} className="text-gray-300 group-hover:text-rose-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white/50 border border-dashed border-gray-300 rounded-xl focus-within:border-primary/50 focus-within:bg-white transition-all">
                           <Plus size={16} className="text-gray-400" />
                           <input 
                            type="text" 
                            placeholder="Thêm kỹ năng..." 
                            className="bg-transparent outline-none text-[12px] font-bold w-32 text-gray-900 placeholder:text-gray-300"
                            value={formData.newSkill}
                            onChange={(e) => setFormData({...formData, newSkill: e.target.value})}
                            onKeyDown={(e) => {
                              if(e.key === 'Enter' && formData.newSkill.trim()) {
                                setFormData({...formData, skills: [...formData.skills, formData.newSkill.trim()], newSkill: ''});
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-20 border-t border-gray-100 px-10 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md z-20">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="flex items-center gap-2 px-6 h-12 rounded-xl font-bold text-[13px] text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-all active:scale-95"
            >
              <ArrowLeft size={16} /> {step === 1 ? 'HUỶ BỎ' : 'QUAY LẠI'}
            </button>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-1.5 mr-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    step === i ? "w-8 bg-primary" : step > i ? "w-1.5 bg-green-500" : "w-1.5 bg-gray-100"
                  )} />
                ))}
              </div>
              {step < 4 ? (
                <button 
                  onClick={handleNext}
                  disabled={(step === 1 && !formData.jobTitle.trim()) || (step === 2 && !formData.selectedCvId)}
                  className="flex items-center gap-2 bg-primary text-white h-12 px-10 rounded-xl font-bold text-[13px] shadow-lg shadow-primary/20 hover:bg-primary-deep hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 uppercase"
                >
                  TIẾP THEO <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-3 bg-gray-900 text-white h-13 px-12 rounded-xl font-bold text-sm shadow-xl shadow-gray-400 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  BẮT ĐẦU PHỎNG VẤN
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewSetupPage;
