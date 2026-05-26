import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import subscriptionApi from '../api/subscription.api';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paymentInfo: {
    transactionId: string;
    qrUrl: string;
    amount: number;
    description: string;
    packageName: string;
    createdAt?: string | Date;
  } | null;
  isLoading?: boolean;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, paymentInfo, isLoading }) => {
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [creditsAdded, setCreditsAdded] = useState<number>(0);

  // Reset trạng thái thanh toán khi mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('PENDING');
      setCreditsAdded(0);
    }
  }, [isOpen]);

  // Bộ đếm ngược thời gian hiệu lực QR
  useEffect(() => {
    if (!isOpen || !paymentInfo) return;

    const calculateTimeLeft = () => {
      if (paymentInfo.createdAt) {
        const createdTime = new Date(paymentInfo.createdAt).getTime();
        const elapsedSeconds = Math.floor((Date.now() - createdTime) / 1000);
        const remaining = Math.max(0, 300 - elapsedSeconds);
        return remaining;
      }
      return 300;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentInfo]);

  // Thực hiện Polling gọi API kiểm tra trạng thái thanh toán ở Backend mỗi 3 giây
  useEffect(() => {
    if (!isOpen || !paymentInfo?.transactionId || paymentStatus !== 'PENDING') return;

    let pollCount = 0;
    const maxPolls = 100; // Thử lại tối đa 5 phút (100 lần * 3 giây)

    const pollInterval = setInterval(async () => {
      pollCount++;
      if (pollCount > maxPolls) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const res = await subscriptionApi.getTransactionStatus(paymentInfo.transactionId);
        if (res.success && res.data) {
          if (res.data.status === 'SUCCESS') {
            setPaymentStatus('SUCCESS');
            setCreditsAdded(res.data.creditsAdded);
            clearInterval(pollInterval);

            // Cập nhật số credit của người dùng trong authStore ngay lập tức để header hiển thị số mới
            const authStore = useAuthStore.getState();
            if (authStore.user) {
              const currentCredits = authStore.user.creditsBalance || 0;
              const newCredits = res.data.creditsAdded === -1 ? 999999 : currentCredits + res.data.creditsAdded;
              authStore.setAuth({
                ...authStore.user,
                creditsBalance: newCredits
              }, authStore.token || '');
            }

            toast.success('Giao dịch thanh toán thành công! Tài khoản đã được cộng Credit. 🎉');
          } else if (res.data.status === 'FAILED') {
            setPaymentStatus('FAILED');
            clearInterval(pollInterval);
            toast.error('Giao dịch thanh toán thất bại.');
          }
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isOpen, paymentInfo?.transactionId, paymentStatus]);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md max-h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-[16px] font-bold text-text-primary">
                {paymentStatus === 'SUCCESS' ? 'Giao dịch hoàn tất' : 'Thanh toán qua mã QR'}
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px] text-text-tertiary">close</span>
              </button>
            </div>

            {/* Content Container with Framer Motion AnimatePresence */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <AnimatePresence mode="wait">
                {isLoading || !paymentInfo ? (
                  /* Loading Skeleton */
                  <motion.div
                    key="loading-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="p-6 md:p-8 flex flex-col items-center animate-pulse w-full"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />

                    {/* QR Code Skeleton */}
                    <div className="size-48 md:size-64 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-8 shrink-0 relative overflow-hidden">
                      <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>

                    {/* Details Skeleton */}
                    <div className="w-full space-y-4 bg-bg-surface-soft p-4 rounded-2xl border border-gray-100 shrink-0">
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-16" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-20" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                      </div>
                    </div>

                    <div className="mt-8 h-10 bg-gray-200 rounded-full w-2/3 shrink-0" />
                  </motion.div>
                ) : paymentStatus === 'SUCCESS' ? (
                  /* Giao diện Thanh toán Thành công cực kỳ xịn sò */
                  <motion.div
                    key="payment-success"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="p-6 md:p-8 flex flex-col items-center text-center w-full"
                  >
                    <div className="size-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-25" />
                      <span className="material-symbols-outlined text-[36px] text-green-500 relative z-10 font-bold">check</span>
                    </div>

                    <h3 className="text-[18px] font-black text-green-600 mb-2">Thanh toán Thành công!</h3>
                    <p className="text-[13px] text-text-secondary leading-relaxed mb-6 max-w-sm">
                      Chúc mừng! Hệ thống đã xác nhận thanh toán thành công cho gói <span className="font-bold text-text-primary">{paymentInfo.packageName}</span>.
                      Tài khoản của bạn đã được cộng thêm <span className="font-bold text-primary">{creditsAdded === -1 ? 'Vô hạn' : `${creditsAdded} credits`}</span> lượt luyện phỏng vấn AI.
                    </p>

                    <div className="w-full space-y-3 bg-green-50/40 border border-green-100/60 p-4 rounded-2xl mb-6">
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-green-700 font-medium">Gói dịch vụ</span>
                        <span className="font-bold text-green-900">{paymentInfo.packageName}</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-green-700 font-medium">Số tiền nạp</span>
                        <span className="font-extrabold text-green-900">{paymentInfo.amount.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-green-700 font-medium">Trạng thái</span>
                        <span className="font-bold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full text-[10px] uppercase border border-green-200">Đã kích hoạt</span>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/10 text-[13px]"
                    >
                      Bắt đầu phỏng vấn ngay
                    </button>
                  </motion.div>
                ) : (
                  /* Giao diện Thanh toán tiêu chuẩn hiển thị QR */
                  <motion.div
                    key="payment-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="p-5 md:p-8 flex flex-col items-center w-full"
                  >
                    <p className="text-[13px] text-text-secondary text-center mb-4 md:mb-5">
                      Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét mã QR bên dưới để nạp gói <span className="font-bold text-primary">{paymentInfo.packageName}</span>.
                    </p>

                    {/* Countdown Timer */}
                    <div className="mb-5 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100/60 shrink-0">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      <span className="text-[12px] font-medium">Mã QR hết hạn sau:</span>
                      <span className="text-[14px] font-black font-mono tracking-wider">{formatTime(timeLeft)}</span>
                    </div>

                    {/* QR Code */}
                    <div className="relative group mb-5 md:mb-6 p-4 bg-white border-2 border-primary/10 rounded-2xl shadow-inner shrink-0 overflow-hidden">
                      <img
                        src={paymentInfo.qrUrl}
                        alt="Sepay QR Code"
                        className={`size-48 md:size-64 object-contain transition-all duration-300 ${timeLeft <= 0 ? 'blur-[4px] opacity-40' : ''}`}
                      />
                      <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl pointer-events-none group-hover:border-primary/40 transition-colors" />

                      {/* Expired Overlay */}
                      {timeLeft <= 0 && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
                          <span className="material-symbols-outlined text-[36px] text-red-500 mb-2">error</span>
                          <span className="text-[13px] font-extrabold text-red-500 text-center">Mã QR đã hết hạn</span>
                          <button
                            onClick={onClose}
                            className="mt-3 px-4 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                          >
                            Tạo giao dịch mới
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Payment Details */}
                    <div className="w-full space-y-3 bg-bg-surface-soft p-4 rounded-2xl border border-gray-100 shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-text-tertiary">Số tiền</span>
                        <span className="text-[15px] md:text-[16px] font-extrabold text-text-primary">{paymentInfo.amount.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-text-tertiary">Nội dung</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] md:text-[14px] font-bold text-primary select-all">{paymentInfo.description}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(paymentInfo.description)}
                            className="material-symbols-outlined text-[16px] text-text-tertiary hover:text-primary transition-colors"
                          >
                            content_copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {timeLeft > 0 ? (
                      <div className="mt-6 md:mt-8 flex items-center gap-3 text-green-600 bg-green-50 px-4 py-2.5 rounded-full border border-green-100 shrink-0">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[12px] font-bold animate-pulse">Đang chờ xác nhận thanh toán thực tế...</span>
                      </div>
                    ) : (
                      <div className="mt-6 md:mt-8 flex items-center gap-3 text-red-600 bg-red-50 px-4 py-2.5 rounded-full border border-red-100 shrink-0">
                        <div className="size-2 rounded-full bg-red-500" />
                        <span className="text-[12px] font-bold">Phiên giao dịch đã kết thúc</span>
                      </div>
                    )}

                    <p className="mt-4 text-[11px] text-text-tertiary text-center shrink-0">
                      Hệ thống tự động kiểm tra mỗi 3 giây. Vui lòng giữ cửa sổ này mở cho đến khi giao dịch được xác nhận.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
