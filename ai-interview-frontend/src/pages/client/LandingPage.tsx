import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";
import { Briefcase, Target, Zap, BrainCircuit, CheckCircle2, Sparkles, ArrowUpRight } from "lucide-react";
import { Helmet } from 'react-helmet-async';
import { LandingHeader } from '../../features/landing-page/components/LandingHeader';
import { Footer } from '../../components/layout/Footer';
import { CTASection } from '../../features/landing-page/components/CTASection';
import { FeatureMockups } from '../../features/landing-page/components/FeatureMockups';
import { StatsSection } from '../../features/landing-page/components/StatsSection';
import { TestimonialSection } from '../../features/landing-page/components/TestimonialSection';
import { PricingSection } from '../../features/landing-page/components/PricingSection';
import { CVBuilderShowcase } from '../../features/landing-page/components/CVBuilderShowcase';
import { CustomCursor } from '../../features/landing-page/components/CustomCursor';

// Custom Easing Curve
const customEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: customEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, ease: customEase }
  }
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-primary/20 selection:text-primary relative cursor-none overflow-x-hidden">
      <Helmet>
        <title>AI Interview - Tối ưu CV & Phỏng vấn với AI</title>
        <meta name="description" content="AI Interview giúp bạn tối ưu hóa CV vượt qua bộ lọc ATS và cung cấp tính năng phỏng vấn thử nghiệm bằng AI, giúp bạn tự tin ứng tuyển mọi vị trí." />
        <meta name="keywords" content="AI CV Builder, tạo CV bằng AI, phỏng vấn AI, interview prep, tối ưu CV, ATS friendly CV" />
        <meta property="og:title" content="AI Interview - Nâng tầm sự nghiệp của bạn" />
        <meta property="og:description" content="Tối ưu CV và luyện phỏng vấn với công nghệ AI tiên tiến nhất." />
        <meta property="og:type" content="website" />
      </Helmet>

      <CustomCursor />
      
      {/* GLOBAL NOISE TEXTURE (Soft Structuralism) */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <LandingHeader />

      <main className="flex-1">
        {/* SECTION 1: MASSIVE HERO (Ethereal Glass) */}
        <section className="relative min-h-[100dvh] flex flex-col justify-center pt-24 pb-20 px-4 overflow-hidden">
          {/* Removed glowing orbs for a cleaner, high-end editorial look */}

          <motion.div 
            style={{ y: prefersReducedMotion ? 0 : heroY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
            className="max-w-5xl mx-auto text-center w-full relative z-10"
          >
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              <motion.div variants={fadeInUp} className="mb-8">
                 <span className="px-4 py-1.5 rounded-full border border-gray-200/50 bg-white/50 backdrop-blur-md text-[11px] font-bold tracking-[0.05em] text-gray-900 uppercase flex items-center gap-2 shadow-sm">
                   <Sparkles size={12} className="text-gray-900" /> Tiêu chuẩn tuyển dụng 2026
                 </span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold tracking-tighter leading-[0.95] text-[#050505] mb-8 max-w-4xl mx-auto">
                Vượt qua <span className="italic font-medium text-gray-400">bộ lọc ATS</span> trong 3 giây.
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-[17px] md:text-[19px] text-gray-500 font-medium leading-relaxed max-w-[50ch] mx-auto mb-12">
                Hàng ngàn CV xuất sắc bị loại bỏ vì sai từ khóa. AI Interview tối ưu hóa hồ sơ và phỏng vấn thử nghiệm để bạn sẵn sàng 100%.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4">
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold text-[15px] shadow-[0_8px_32px_rgba(86,69,212,0.3)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]">
                  Tối ưu CV của tôi
                  <div className="size-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 text-gray-600 font-semibold text-[15px] hover:text-gray-900 transition-colors">
                  Xem cách hoạt động
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: SOCIAL PROOF LOGO WALL */}
        <section className="py-12 border-y border-gray-100/50 bg-white/40">
           <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
              <p className="text-[11px] font-medium tracking-[0.1em] text-gray-400 uppercase mb-8">Ứng viên của chúng tôi đang làm việc tại</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                {/* SVG Placeholders representing tech logos */}
                <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><BrainCircuit size={24}/> TechCorp</div>
                <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><Target size={24}/> InnovateIO</div>
                <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><Zap size={24}/> BoltLabs</div>
                <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><Briefcase size={24}/> ScaleUp</div>
              </div>
           </div>
        </section>
        {/* STATS SECTION */}
        <StatsSection />

        <FeatureMockups isAuthenticated={isAuthenticated} />

        {/* CV BUILDER SECTION with ReactBits style animations */}
        <CVBuilderShowcase />
        {/* SECTION 4: HOW IT WORKS (Z-Axis / Cascading) */}
        <section id="how-it-works" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
                <motion.div variants={fadeInUp} className="inline-block px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
                  Trải nghiệm mượt mà
                </motion.div>
                <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-8 leading-[1.1]">
                  Chinh phục nhà tuyển dụng trong 3 bước.
                </motion.h2>
                
                <div className="flex flex-col gap-8 mt-12">
                  {[
                    { title: "Tải CV Lên", desc: "Tải lên hồ sơ CV của bạn kèm theo Mô tả công việc (Job Description) mục tiêu." },
                    { title: "Nhận Báo Cáo AI", desc: "AI phân tích từng dòng, chỉ ra điểm nghẽn khiến CV bị loại." },
                    { title: "Mô Phỏng Phỏng Vấn", desc: "Phản xạ thực tế với bộ câu hỏi được sinh riêng theo CV." }
                  ].map((step, idx) => (
                    <motion.div key={idx} variants={fadeInUp} className="flex gap-6 group">
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="size-10 rounded-full border border-gray-200 flex items-center justify-center text-[13px] font-bold group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-colors duration-500">
                          0{idx + 1}
                        </div>
                        {idx < 2 && <div className="w-[1px] h-full bg-gray-100 my-2"></div>}
                      </div>
                      <div className="pb-8">
                        <h3 className="text-[19px] font-bold text-gray-900 mb-2 tracking-tight">{step.title}</h3>
                        <p className="text-[15px] text-gray-500 font-medium leading-relaxed max-w-sm">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Staggered Visual Cards (Z-Axis Cascade concept) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: customEase }}
                className="relative h-[600px] hidden md:block group"
              >
                 <motion.div animate={{ rotate: [4, 6, 4] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-10 right-0 w-[80%] h-[300px] rounded-3xl bg-gray-50 border border-gray-100 shadow-xl z-10 flex items-center justify-center overflow-hidden">
                   <div className="text-gray-300 font-medium"><BrainCircuit size={80} strokeWidth={1} /></div>
                 </motion.div>
                 <motion.div animate={{ rotate: [-2, -4, -2] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }} className="absolute top-40 left-0 w-[85%] h-[350px] rounded-3xl bg-white border border-gray-100 shadow-2xl z-20 flex flex-col p-8 backdrop-blur-xl">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900"><CheckCircle2 size={16} /></div>
                     <div>
                       <div className="font-bold text-sm text-gray-900">Điểm ATS Tăng Trưởng</div>
                       <div className="text-xs text-gray-500 font-medium">Sẵn sàng ứng tuyển</div>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="h-3 w-3/4 bg-gray-100 rounded-full"></div>
                     <div className="h-3 w-1/2 bg-gray-100 rounded-full"></div>
                     <div className="h-3 w-5/6 bg-gray-100 rounded-full"></div>
                   </div>
                 </motion.div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* PRICING SECTION */}
        <PricingSection />

        <TestimonialSection />

      </main>

      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
