import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ChevronDown, Target, BrainCircuit, Briefcase, Building2, Heart, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Header } from '../components/layout/Header';

import { TESTIMONIALS } from '../features/subscription/subscription.data';
import { TestimonialMarquee } from '../features/subscription/TestimonialMarquee';

// --- Variants cho Framer Motion ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// --- Dữ liệu tĩnh ---
const STATS = [
  { label: 'Câu hỏi phỏng vấn', value: '10,000+' },
  { label: 'Lượt luyện tập', value: '500,000+' },
  { label: 'Việc làm IT', value: '1,200+' },
  { label: 'Top công ty', value: '50+' },
];

const FEATURES = [
  {
    title: 'Luyện phỏng vấn thử online không giới hạn',
    desc: 'Luyện tập bao nhiêu buổi phỏng vấn thử online tùy thích, mọi lúc, mọi nơi.',
    icon: <Target className="w-6 h-6 text-primary" />
  },
  {
    title: 'Phản hồi chi tiết từ AI',
    desc: 'Nhận feedback điểm mạnh, điểm yếu và gợi ý cải thiện ngay sau mỗi câu trả lời.',
    icon: <BrainCircuit className="w-6 h-6 text-primary" />
  },
  {
    title: 'Cá nhân hóa theo mục tiêu',
    desc: 'Câu hỏi được tinh chỉnh tự động dựa trên CV và vị trí công việc bạn đang ứng tuyển.',
    icon: <Briefcase className="w-6 h-6 text-primary" />
  },
  {
    title: 'Môi trường thực tế',
    desc: 'Trải nghiệm áp lực như một buổi phỏng vấn thật với giao diện video call chuyên nghiệp.',
    icon: <Users className="w-6 h-6 text-primary" />
  }
];

const HOW_IT_WORKS = [
  {
    title: 'Chọn vị trí mục tiêu',
    desc: 'Lựa chọn vị trí công việc bạn muốn ứng tuyển để hệ thống xây dựng bộ câu hỏi phù hợp với lĩnh vực và cấp độ của bạn.',
    step: '01'
  },
  {
    title: 'Tải lên CV (Tùy chọn)',
    desc: 'Hệ thống AI sẽ phân tích kinh nghiệm làm việc để đưa ra các câu hỏi đào sâu mang tính cá nhân hóa cao nhất.',
    step: '02'
  },
  {
    title: 'Bắt đầu phỏng vấn',
    desc: 'Đối mặt với "nhà tuyển dụng AI" qua hình thức Voice hoặc Text. Trả lời các câu hỏi tình huống thực tế.',
    step: '03'
  },
  {
    title: 'Nhận báo cáo & Cải thiện',
    desc: 'Xem lại toàn bộ buổi phỏng vấn cùng đánh giá chi tiết, điểm số và gợi ý câu trả lời chuẩn xác nhất.',
    step: '04'
  }
];

const SUGGESTED_JOBS = [
  { title: 'Senior Frontend Engineer', company: 'TechCorp Vietnam', location: 'Hồ Chí Minh', salary: 'Up to $2000' },
  { title: 'Backend Node.js Developer', company: 'Global Solutions', location: 'Hà Nội', salary: '$1000 - $1500' },
  { title: 'UI/UX Designer', company: 'Creative Agency', location: 'Đà Nẵng', salary: 'Thỏa thuận' },
];

const FAQS = [
  {
    question: 'X-Interview có thực sự miễn phí không?',
    answer: 'Có! Bạn có thể bắt đầu luyện tập với ngân hàng câu hỏi và phỏng vấn AI bằng tài khoản miễn phí. Chúng tôi cũng cung cấp gói Premium với tính năng không giới hạn.'
  },
  {
    question: 'AI chấm điểm phỏng vấn như thế nào?',
    answer: 'Hệ thống sử dụng các mô hình ngôn ngữ lớn (LLMs) được tinh chỉnh chuyên sâu, đánh giá dựa trên các tiêu chí: Mức độ liên quan, Tính logic, Thái độ và Độ sâu của kiến thức chuyên môn.'
  },
  {
    question: 'Tôi có thể dùng trên điện thoại không?',
    answer: 'Hoàn toàn được. X-Interview được thiết kế responsive, hỗ trợ bạn luyện phỏng vấn tốt nhất trên cả máy tính bảng và điện thoại di động.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  const handleStart = () => {
    if (isAuthenticated) navigate('/interviews/setup');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary">
      <Header />
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20">
              <SparklesIcon className="w-4 h-4" />
              Trợ lý phỏng vấn AI thế hệ mới
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Chinh phục mọi buổi phỏng vấn cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">X-Interview</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Luyện tập, nhận feedback chi tiết từ AI và tự tin đi phỏng vấn thật. Nền tảng mô phỏng phỏng vấn thông minh nhất dành cho bạn.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                Bắt đầu luyện tập ngay <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Xem Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST & STATS RIBBON */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Được tin dùng bởi ứng viên ứng tuyển vào
          </div>
          {/* Logo Strip (Mock) */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale mb-12">
            <div className="text-xl font-bold font-serif">TechCorp</div>
            <div className="text-xl font-bold font-sans">GlobalNet</div>
            <div className="text-xl font-bold tracking-tighter">INNOVATE</div>
            <div className="text-xl font-bold font-mono">SysLogic</div>
            <div className="text-xl font-bold italic">NextGen</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES (Chúng tôi cung cấp) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Chúng tôi cung cấp</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Mọi thứ bạn cần để chinh phục buổi phỏng vấn</h3>
            <p className="text-lg text-gray-600">Từ luyện tập không giới hạn đến feedback chi tiết — nền tảng của chúng tôi hỗ trợ mọi bước trong hành trình chuẩn bị phỏng vấn.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FEATURES.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-gray-900 text-white rounded-[2rem] md:rounded-[4rem] mx-2 md:mx-4">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary-light tracking-widest uppercase mb-3">Cách hoạt động</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Quy trình luyện phỏng vấn</h3>
            <p className="text-lg text-gray-400">Chỉ với 4 bước đơn giản, bạn đã sẵn sàng đối mặt với nhà tuyển dụng thực tế.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="text-6xl md:text-7xl font-black text-white/5 mb-4 select-none group-hover:text-white/10 transition-colors">{step.step}</div>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUGGESTED JOBS (Static) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Suggested Jobs */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Cơ hội nghề nghiệp</h2>
                <h3 className="text-3xl font-bold text-gray-900">Việc làm gợi ý</h3>
              </div>
              <Link to="/jobs" className="text-primary font-bold hover:underline flex items-center gap-1">
                Khám phá thêm <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {SUGGESTED_JOBS.map((job, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate('/jobs')}>
                  <div>
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-4 text-gray-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{job.title}</h4>
                    <p className="text-sm text-gray-500 mb-4">{job.company}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-900">{job.salary}</span>
                    <span className="text-gray-500">{job.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (Cộng đồng) */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-6">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Cộng đồng</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Gia nhập cùng hàng nghìn ứng viên</h3>
          <p className="text-lg text-gray-600">Nghe từ những người đã nâng cấp kỹ năng phỏng vấn với X-Interview</p>
        </div>

        <div className="w-full">
          {/* Row 1: scroll left */}
          <TestimonialMarquee items={TESTIMONIALS.slice(0, 5)} direction="left" speed={30} />
          {/* Row 2: scroll right */}
          <TestimonialMarquee items={TESTIMONIALS.slice(5, 10)} direction="right" speed={35} />
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">Câu hỏi thường gặp</h3>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Decors */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Thử phỏng vấn ngay</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Quy trình rõ ràng, giao diện trực quan và trải nghiệm chỉn chu giúp bạn tập trung cải thiện qua từng buổi luyện tập.
              </p>
              <button 
                onClick={handleStart}
                className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto shadow-xl"
              >
                Bắt đầu hoàn toàn miễn phí <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="font-black text-2xl tracking-tighter text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">X</div>
                X-INTERVIEW
              </div>
              <p className="text-gray-500 max-w-xs mb-6 leading-relaxed">
                Nền tảng hỗ trợ phỏng vấn thông minh giúp ứng viên tự tin hơn trong các buổi phỏng vấn.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Cho ứng viên</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Tìm việc làm</Link></li>
                <li><Link to="/interviews/setup" className="hover:text-primary transition-colors">Luyện phỏng vấn</Link></li>
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Phân tích CV</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Tìm kiếm phổ biến</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Việc làm IT</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Việc làm Kinh doanh</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Câu hỏi Marketing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Hỗ trợ</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2026 TMI Corp. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-900 transition-colors">Facebook</a>
              <a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon SVG
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

// FAQ Component với State Mở/Đóng
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-primary/30">
      <button 
        className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-5 text-gray-600 leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
