import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, BrainCircuit, 
  Sparkles, Download, ChevronRight, Eye, EyeOff,
  CheckCircle, TrendingUp, History, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCvs } from '../features/cvs/hooks/useCvs';

// PDF Viewer Imports
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const MOCK_HTML_TEMPLATE = `
  <div class="relative overflow-hidden p-0 font-sans bg-white min-h-[900px] flex">
    <!-- Left background block -->
    <div class="absolute top-0 left-0 bottom-0 w-[35%] bg-[#1c385c] z-0"></div>

    <!-- Content Wrapper -->
    <div class="relative z-10 flex w-full">
      
      <!-- LEFT SIDEBAR -->
      <div class="w-[35%] px-8 text-white pt-12">
        <!-- Avatar -->
        <div class="flex justify-center mb-10">
          <div class="w-44 h-44 rounded-full p-1 bg-white">
            <img class="w-full h-full object-cover rounded-full" alt="Avatar" src="https://i.pravatar.cc/300?img=5">
          </div>
        </div>
        
        <!-- Contact -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Liên lạc</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200">+123-456-7890</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200 break-all">ngtrucquynhmy@gmail.com</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200">27/01/1998</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200 leading-tight">Nguyễn Chí Thanh, Phường 6,<br/>Quận 10, TP.HCM</span>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Học vấn</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <div class="mb-4">
            <p class="text-[11px] text-gray-300 italic mb-1">2016 - 2018</p>
            <h3 class="text-[11px] font-bold text-white uppercase mb-1">TÊN TRƯỜNG HỌC BORCELLE<br/>UNIVERSITY</h3>
            <ul class="list-disc list-inside text-[11px] text-gray-200 space-y-0.5 ml-1">
              <li>Master of Business Marketing</li>
              <li>Loại tốt nghiệp</li>
            </ul>
          </div>
          <div>
            <p class="text-[11px] text-gray-300 italic mb-1">2012 - 2016</p>
            <h3 class="text-[11px] font-bold text-white uppercase mb-1">TÊN TRƯỜNG HỌC BORCELLE<br/>UNIVERSITY</h3>
            <ul class="list-disc list-inside text-[11px] text-gray-200 space-y-0.5 ml-1">
              <li>Master of Business Marketing</li>
              <li>Loại tốt nghiệp</li>
            </ul>
          </div>
        </div>

        <!-- Computer Skills -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Tin học</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11.5px] text-gray-200 flex items-center before:content-['•'] before:mr-2">Microsoft Word</span>
            <span class="text-[11.5px] text-gray-200 font-bold flex items-center gap-1">4 <svg class="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[11.5px] text-gray-200 flex items-center before:content-['•'] before:mr-2">Microsoft Excel</span>
            <span class="text-[11.5px] text-gray-200 font-bold flex items-center gap-1">4.5 <svg class="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
          </div>
        </div>

        <!-- Languages -->
        <div>
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Ngoại ngữ</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11.5px] text-gray-200 flex items-center before:content-['•'] before:mr-2">Tiếng Anh</span>
            <span class="text-[11.5px] text-white font-bold italic">Trung cấp</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[11.5px] text-gray-200 flex items-center before:content-['•'] before:mr-2">Tiếng Trung</span>
            <span class="text-[11.5px] text-white font-bold italic">Sơ cấp</span>
          </div>
        </div>

        <!-- Professional Skills -->
        <div class="mb-8 mt-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Kỹ năng chuyên môn</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <ul class="list-none text-[11.5px] text-gray-200 space-y-2">
            <li class="flex items-center before:content-['•'] before:mr-2">Bán hàng B2B & B2C</li>
            <li class="flex items-center before:content-['•'] before:mr-2">Quản lý quan hệ khách hàng (CRM)</li>
            <li class="flex items-center before:content-['•'] before:mr-2">Đàm phán & Thương lượng</li>
            <li class="flex items-center before:content-['•'] before:mr-2">Phân tích thị trường</li>
          </ul>
        </div>

        <!-- References -->
        <div>
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Người tham chiếu</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <div>
            <h3 class="text-[11.5px] font-bold text-white mb-0.5">Ông Nguyễn Văn A</h3>
            <p class="text-[11.5px] text-gray-300 mb-1">Giám đốc Kinh doanh - Larana Studios</p>
            <p class="text-[11px] text-gray-300 flex items-center gap-2"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> 0901 234 567</p>
          </div>
        </div>
        
      </div>

      <!-- RIGHT MAIN CONTENT -->
      <div class="w-[65%] pl-10 pr-10 pt-16">
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-[28px] text-gray-700 uppercase tracking-widest mb-1 font-light">Nguyễn Trúc <span class="font-black text-gray-900">Quỳnh My</span></h1>
          <h2 class="text-[13px] text-gray-500 font-bold uppercase tracking-[0.2em]">Nhân viên bán hàng</h2>
        </div>

        <!-- Objective -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Mục tiêu nghề nghiệp</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-4"></div>
          <p class="text-[12px] leading-relaxed text-gray-700 text-justify">
            Tôi là một nhân viên bán hàng chuyên nghiệp, đam mê trong việc xây dựng mối quan hệ với khách hàng và đạt được mục tiêu doanh số. Mục tiêu của tôi là phát triển sự nghiệp trong lĩnh vực bán hàng, áp dụng kỹ năng giao tiếp mạnh mẽ và khả năng thuyết phục để tạo ra giá trị cho khách hàng và đóng góp vào sự thành công của tổ chức.
          </p>
        </div>

        <!-- Experience -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Kinh nghiệm làm việc</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-6"></div>
          
          <div class="relative pl-5 border-l-2 border-gray-300 mb-6 ml-1.5">
            <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1c385c] -left-[5.5px] top-1"></div>
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">Larana Studios</h4>
              <span class="text-[12px] text-gray-600">03/2019 - 09/2020</span>
            </div>
            <p class="text-[12px] text-gray-600 font-bold mb-2">Marketing Manager</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
              <li>Phụ trách việc tìm kiếm và khai thác thị trường mới, xây dựng danh sách khách hàng tiềm năng: Tại công ty ABC, tôi đã chịu trách nhiệm tìm kiếm và khai thác các thị trường mới, từ đó tạo ra danh sách khách hàng tiềm năng.</li>
              <li>Tôi đã nghiên cứu và đánh giá các xu hướng thị trường để xác định các cơ hội kinh doanh mới. Tôi đã áp dụng các kỹ thuật tiếp thị và xây dựng mạng lưới khách hàng để tăng doanh số bán hàng.</li>
            </ul>
          </div>

          <div class="relative pl-5 border-l-2 border-gray-300 ml-1.5">
            <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1c385c] -left-[5.5px] top-1"></div>
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">Larana Studios</h4>
              <span class="text-[12px] text-gray-600">01/2019 - 02/2020</span>
            </div>
            <p class="text-[12px] text-gray-600 font-bold mb-2">Marketing Manager</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
              <li>Phụ trách việc tìm kiếm và khai thác thị trường mới, xây dựng danh sách khách hàng tiềm năng: Tại công ty ABC, tôi đã chịu trách nhiệm tìm kiếm và khai thác các thị trường mới, từ đó tạo ra danh sách khách hàng tiềm năng.</li>
              <li>Tôi đã nghiên cứu và đánh giá các xu hướng thị trường để xác định các cơ hội kinh doanh mới. Tôi đã áp dụng các kỹ thuật tiếp thị và xây dựng mạng lưới khách hàng để tăng doanh số bán hàng.</li>
            </ul>
          </div>
        </div>

        <!-- Projects -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Dự án thực tế</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-6"></div>
          
          <div class="relative pl-5 border-l-2 border-gray-300 mb-6 ml-1.5">
            <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1c385c] -left-[5.5px] top-1"></div>
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">Chiến dịch mở rộng thị trường miền Nam</h4>
              <span class="text-[12px] text-gray-600">06/2020 - 09/2020</span>
            </div>
            <p class="text-[12px] text-gray-600 font-bold mb-2">Trưởng nhóm Kinh doanh</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
              <li>Lập kế hoạch và thực hiện các chiến dịch tiếp cận 50+ khách hàng doanh nghiệp vừa và nhỏ trong khu vực TP.HCM.</li>
              <li>Kết quả: Đạt 150% KPI được giao, ký kết thành công 12 hợp đồng B2B mang về doanh thu hơn 2 tỷ VNĐ trong quý.</li>
            </ul>
          </div>
        </div>

        <!-- Certifications -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Chứng chỉ & Giải thưởng</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-4"></div>
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-[13px] font-bold text-gray-800">Chứng nhận Inbound Sales</h4>
                <p class="text-[12px] text-gray-600">HubSpot Academy</p>
              </div>
              <span class="text-[12px] text-gray-600">2020</span>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-[13px] font-bold text-gray-800">Nhân viên xuất sắc của năm</h4>
                <p class="text-[12px] text-gray-600">Larana Studios</p>
              </div>
              <span class="text-[12px] text-gray-600">2019</span>
            </div>
          </div>
        </div>

        <!-- Activities -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Hoạt động ngoại khóa</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-4"></div>
          <div>
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">Câu lạc bộ Kỹ năng Doanh nhân</h4>
              <span class="text-[12px] text-gray-600">2016 - 2018</span>
            </div>
            <p class="text-[12px] text-gray-600 italic mb-2">Thành viên Ban Đối ngoại</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
              <li>Đại diện câu lạc bộ đi tìm kiếm và đàm phán xin tài trợ cho các sự kiện sinh viên quy mô 500+ người tham dự.</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  </div>
`;

const CvOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cvId = searchParams.get('cvId');
  
  const { cvs } = useCvs();
  const selectedCv = cvs.find(c => c.id === cvId);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [isOptimizing, setIsOptimizing] = useState(true);
  const [showOldCv, setShowOldCv] = useState(true);

  // Giả lập thời gian AI xử lý
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOptimizing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const aiModifications = [
    {
      id: 1,
      type: "ADD_KEYWORD",
      title: "Bổ sung từ khóa chuyên môn",
      desc: "Đã thêm các từ khóa: Bán hàng B2B, Quản lý CRM, Phân tích thị trường để tăng điểm ATS match.",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      id: 2,
      type: "REWRITE",
      title: "Viết lại Mục tiêu nghề nghiệp",
      desc: "Đã thiết kế lại đoạn văn mục tiêu để thể hiện rõ định hướng và khát vọng gắn bó dài hạn với tổ chức.",
      icon: PenTool,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: 3,
      type: "EXPAND",
      title: "Mở rộng kinh nghiệm làm việc",
      desc: "Chuyển các gạch đầu dòng kinh nghiệm sang định dạng [Hành động] + [Kết quả] với số liệu doanh thu cụ thể.",
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      id: 4,
      type: "ADD_SECTION",
      title: "Bổ sung Dự án thực tế",
      desc: "Đã tách và cấu trúc lại thông tin để làm nổi bật chiến dịch mở rộng thị trường miền Nam.",
      icon: CheckCircle,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <MainLayout hideSearch={true} fullHeight={true} maxWidth="1600px" className="px-4 lg:px-8 py-4 bg-[#f8fafc]">
      <div className="flex gap-6 h-[calc(100vh-100px)]">

        <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50/50 rounded-2xl border border-gray-200">
          <div className="flex-1 overflow-auto custom-scrollbar pb-10 pt-10">
            <div className="flex items-start justify-center min-w-max px-10 gap-10 mx-auto">
              
              {/* Khung giấy A4 - Render từ chuỗi HTML */}
              <div 
                className="bg-white w-[800px] min-w-[800px] shadow-xl relative overflow-hidden shrink-0 border border-gray-200 rounded-sm"
                style={{ minHeight: '1131px' }}
                dangerouslySetInnerHTML={{ __html: MOCK_HTML_TEMPLATE }}
              />

              {/* Vertical Divider */}
              <div className="w-[2px] bg-gray-200 self-stretch rounded-full"></div>

              {/* Lịch sử chỉnh sửa AI Panel */}
              <div className="sticky top-10 flex flex-col w-[380px] shrink-0">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[800px]">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BrainCircuit size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 leading-tight">Lịch sử chỉnh sửa</h3>
                        <p className="text-[12px] text-gray-500 font-medium">Bởi Trợ lý AI</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle size={12} /> Đã xong
                    </span>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                    {aiModifications.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div key={mod.id} className="group flex gap-3 relative">
                          {/* Dấu chấm timeline */}
                          <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-gray-100 group-last:hidden"></div>
                          
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${mod.bg} ${mod.color} shadow-sm border border-white`}>
                            <Icon size={14} />
                          </div>
                          
                          <div className="flex-1 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-primary/30 group-hover:shadow-md transition-all">
                            <h4 className="text-[13px] font-bold text-gray-800 mb-1">{mod.title}</h4>
                            <p className="text-[12px] text-gray-600 leading-relaxed">{mod.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-bold text-gray-500">Mẫu hiện tại</span>
                      <button className="text-[12px] font-bold text-primary hover:underline flex items-center gap-1">
                        Thay đổi <ChevronRight size={14} />
                      </button>
                    </div>
                    <button className="w-full bg-[#1c385c] text-white px-5 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#152a45] shadow-lg shadow-indigo-900/20 hover:shadow-xl transition-all">
                      <span className="material-symbols-outlined text-[20px]">file_download</span> Xuất PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CvOptimizationPage;
