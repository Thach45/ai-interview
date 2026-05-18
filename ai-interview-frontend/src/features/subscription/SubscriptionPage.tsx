import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../../layouts/MainLayout';
import { PricingCard } from './PricingCard';
import { TestimonialMarquee } from './TestimonialMarquee';
import { FaqSection } from './FaqSection';
import { PaymentModal } from './components/PaymentModal';
import { TESTIMONIALS } from './subscription.data';
import { useSubscription } from './hooks/useSubscription';
import type { SubscriptionPackage } from './api/subscription.api';

const STATS = [
  { icon: 'quiz', value: '20.000+', label: 'Câu hỏi', color: 'text-blue-600 bg-blue-50' },
  { icon: 'smart_display', value: '10.000+', label: 'Lượt luyện tập', color: 'text-green-600 bg-green-50' },
  { icon: 'work', value: '35.000+', label: 'Việc làm', color: 'text-purple-600 bg-purple-50' },
  { icon: 'apartment', value: '128+', label: 'Top công ty', color: 'text-amber-600 bg-amber-50' },
];

const HERO_FEATURES = [
  'Hướng dẫn trả lời câu hỏi theo phương pháp STAR',
  'Tạo hướng dẫn trả lời đạt hiệu quả cao',
  'Hiểu được mục đích của nhà tuyển dụng qua các câu hỏi',
  'Đánh giá cá nhân hoá giúp bạn cải thiện câu trả lời',
  'Phân tích cá nhân hoá điểm mạnh, điểm yếu của bạn',
  'AI phân tích chi tiết câu trả lời: Nội dung, độ rõ ràng, Liên quan, Tự tin',
];

const SubscriptionPage: React.FC = () => {
  const { packages, isLoading, purchase, paymentInfo, resetPurchase, isPurchasing } = useSubscription();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleBuy = async (pkg: SubscriptionPackage) => {
    setIsModalOpen(true);
    try {
      await purchase(pkg.id);
    } catch (error) {
      setIsModalOpen(false); // Đóng modal nếu API thất bại
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetPurchase();
  };

  React.useEffect(() => {
    console.log('Subscription Packages Data:', packages);
  }, [packages]);

  return (
    <MainLayout maxWidth="1440px" className="px-4 lg:px-12 py-0">
      <div className="space-y-16 pb-24">

        {/* ===== HERO SECTION ===== */}
        <section className="grid lg:grid-cols-2 gap-12 items-center pt-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-[11px] font-bold rounded-full mb-4 uppercase tracking-wide border border-primary/10">
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
              Gói luyện phỏng vấn AI
            </span>

            <h1 className="text-[36px] lg:text-[42px] font-extrabold text-text-primary tracking-tight leading-tight mb-4">
              Đầu tư cho
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent"> sự nghiệp</span>
            </h1>

            <p className="text-[15px] text-text-secondary leading-relaxed mb-8 max-w-lg">
              Luyện phỏng vấn cùng AI — đánh giá chi tiết từng câu trả lời, phân tích điểm mạnh & yếu,
              giúp bạn tự tin chinh phục nhà tuyển dụng.
            </p>

            {/* Feature checklist */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-full mb-4 border border-green-100">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Quyền lợi đặc được
              </span>
              <h3 className="text-[18px] font-bold text-text-primary mb-4">
                Nâng cấp kỹ năng phỏng vấn toàn diện với AI
              </h3>
              <ul className="space-y-2.5">
                {HERO_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-secondary">
                    <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">task_alt</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Hero illustration placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="w-full max-w-md aspect-[4/3] bg-gradient-to-br from-primary/5 via-violet-50 to-amber-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center gap-4 shadow-sm">
              <span className="material-symbols-outlined text-[80px] text-primary/30">school</span>
              <p className="text-[14px] text-text-tertiary font-medium">Luyện phỏng vấn AI thông minh</p>
            </div>
          </motion.div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section>
          <div className="text-center mb-10">
            <p className="text-[12px] text-text-tertiary uppercase tracking-wider font-bold mb-2">
              Tất cả gói đều bao gồm phản hồi AI và câu hỏi theo ngành
            </p>
            <h2 className="text-[28px] font-extrabold text-text-primary tracking-tight">
              So sánh nhanh các gói
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[450px] bg-white border border-gray-100 rounded-2xl animate-pulse" />
              ))
            ) : packages && packages.length > 0 ? (
              packages.map((pkg: any, idx: number) => (
                <PricingCard key={pkg.id} pkg={pkg} index={idx} onBuy={handleBuy} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                 <span className="material-symbols-outlined text-[48px] text-gray-200 mb-2">inventory_2</span>
                 <p className="text-text-tertiary">Hiện chưa có gói dịch vụ nào được mở bán.</p>
              </div>
            )}
          </div>
        </section>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          paymentInfo={paymentInfo} 
          isLoading={isPurchasing}
        />

        {/* ===== STATS SECTION ===== */}
        <section>
          <p className="text-center text-[11px] text-text-tertiary uppercase tracking-widest font-bold mb-6">
            Được tin dùng bởi ứng viên ứng tuyển vào
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center gap-2 py-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all"
              >
                <div className={`size-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </div>
                <span className="text-[24px] font-extrabold text-text-primary">{s.value}</span>
                <span className="text-[12px] text-text-tertiary font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <section>
          <div className="text-center mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full mb-3 border border-amber-100 uppercase tracking-wide">
              <span className="material-symbols-outlined text-[14px]">groups</span>
              Cộng đồng
            </span>
            <h2 className="text-[28px] font-extrabold text-text-primary tracking-tight mb-2">
              Gia nhập cùng hàng nghìn ứng viên
            </h2>
            <p className="text-[14px] text-text-secondary">
              Nghe từ những người đã nâng cấp kỹ năng phỏng vấn với X-Interview
            </p>
          </div>

          {/* Row 1: scroll left */}
          <TestimonialMarquee items={TESTIMONIALS.slice(0, 5)} direction="left" speed={30} />
          {/* Row 2: scroll right */}
          <TestimonialMarquee items={TESTIMONIALS.slice(5)} direction="right" speed={35} />

          <div className="text-center mt-6">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-[13px] font-bold hover:brightness-110 transition-all shadow-md shadow-primary/20">
              Gia nhập 10,000+ ứng viên
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <FaqSection />
      </div>
    </MainLayout>
  );
};

export default SubscriptionPage;
