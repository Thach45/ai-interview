'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

// Dữ liệu tạo tên ngẫu nhiên
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNamesM = ['Văn', 'Hữu', 'Đình', 'Xuân', 'Quang', 'Minh', 'Hoàng', 'Thái', 'Đức', 'Trọng', 'Tuấn', 'Công', 'Gia'];
const middleNamesF = ['Thị', 'Ngọc', 'Thu', 'Hồng', 'Mai', 'Bích', 'Phương', 'Thanh', 'Kiều', 'Như', 'Thảo', 'Diễm', 'Tuyết'];
const firstNamesM = ['Anh', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Hải', 'Hiếu', 'Huy', 'Khoa', 'Kiên', 'Lâm', 'Long', 'Nam', 'Phong', 'Phúc', 'Quân', 'Sơn', 'Thành', 'Thiên', 'Toàn', 'Trường', 'Tùng', 'Việt', 'Vinh'];
const firstNamesF = ['An', 'Châu', 'Chi', 'Diệp', 'Giang', 'Hà', 'Hân', 'Hoa', 'Hương', 'Linh', 'Ly', 'Mai', 'My', 'Ngân', 'Nhung', 'Oanh', 'Quyên', 'Tâm', 'Thi', 'Thủy', 'Tiên', 'Trang', 'Trâm', 'Uyên', 'Vy', 'Yến'];
const locations = ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Đồng Nai', 'Bình Dương', 'Vũng Tàu', 'Nha Trang', 'Huế', 'Quảng Ninh', 'Bắc Ninh', 'Bắc Giang', 'Thái Nguyên', 'Nghệ An', 'Thanh Hóa'];
const plans = ['Gói Khởi Động', 'Gói Chinh Phục', 'Gói Bứt Phá', 'Gói Đỉnh Cao'];

const generateMockPurchases = (count: number) => {
  return Array.from({ length: count }).map(() => {
    const isMale = Math.random() > 0.5;
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const middleName = isMale 
      ? middleNamesM[Math.floor(Math.random() * middleNamesM.length)]
      : middleNamesF[Math.floor(Math.random() * middleNamesF.length)];
    const firstName = isMale
      ? firstNamesM[Math.floor(Math.random() * firstNamesM.length)]
      : firstNamesF[Math.floor(Math.random() * firstNamesF.length)];
      
    const timeRand = Math.random();
    const timeStr = timeRand < 0.6 ? 'Vài giây trước' : (timeRand < 0.8 ? '1 phút trước' : '2 phút trước');

    return {
      name: `${lastName} ${middleName} ${firstName}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      plan: plans[Math.floor(Math.random() * plans.length)],
      time: timeStr
    };
  });
};

const mockPurchases = generateMockPurchases(100);

// Hàm lấy số ngẫu nhiên trong khoảng
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const PurchaseNotification = () => {
  const [currentNotification, setCurrentNotification] = useState<typeof mockPurchases[0] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/audio/sound-effect.mp3');
    audioRef.current.volume = 0.4; // Âm lượng 50%
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextNotification = () => {
      // Random thời gian xuất hiện từ 8s đến 20s
      const delay = getRandomInt(20000, 20000000);
     
      
      timeoutId = setTimeout(() => {
        // Chọn ngẫu nhiên 1 người
        const randomPerson = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
        setCurrentNotification(randomPerson);
        
        // Phát âm thanh
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log("Trình duyệt chặn autoplay audio", e));
        }

        // Tự động ẩn sau 5s
        setTimeout(() => {
          setCurrentNotification(null);
          // Lên lịch cho lần xuất hiện tiếp theo
          scheduleNextNotification();
        }, 5000);

      }, delay);
    };

    // Bắt đầu vòng lặp
    scheduleNextNotification();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 right-6 z-[100] flex items-start gap-3.5 bg-white p-4 pr-10 rounded-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-sm"
        >
          {/* Nút tắt thủ công */}
          <button 
            onClick={() => setCurrentNotification(null)}
            className="absolute top-3 right-3 text-gray-300 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>

          {/* Minimal Live Indicator */}
          <div className="shrink-0 flex items-center justify-center mt-2">
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] text-gray-500 font-medium leading-snug">
              <span className="font-semibold text-gray-900">{currentNotification.name}</span> từ {currentNotification.location}
            </p>
            <p className="text-[14px] font-bold text-gray-900 tracking-tight">
              Vừa mua {currentNotification.plan}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-1.5">
              {currentNotification.time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
