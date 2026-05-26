export interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice: number;
  durationDays: number;
  durationLabel: string;
  credits: string;
  popular?: boolean;
  features: string[];
  icon: string; // material icon name
  gradient: string; // tailwind gradient classes
}

export const PACKAGES: PackageItem[] = [
  {
    id: 'starter',
    name: 'Khởi Động',
    tagline: 'Trải nghiệm nhanh',
    price: 49000,
    oldPrice: 99000,
    durationDays: 7,
    durationLabel: '7 ngày',
    credits: '10 lượt',
    icon: 'rocket_launch',
    gradient: 'from-blue-500 to-cyan-400',
    features: [
      '1 lượt mô phỏng phỏng vấn thực tế',
      '10 lượt luyện tập từng câu hỏi',
      'Phản hồi AI cơ bản',
      'Câu hỏi theo ngành nghề',
    ],
  },
  {
    id: 'pro',
    name: 'Chinh Phục',
    tagline: 'Được chọn nhiều nhất',
    price: 199000,
    oldPrice: 299000,
    durationDays: 30,
    durationLabel: '1 tháng',
    credits: '50 lượt',
    popular: true,
    icon: 'military_tech',
    gradient: 'from-primary to-violet-500',
    features: [
      '10 lượt mô phỏng phỏng vấn thực tế',
      '50 lượt luyện tập từng câu hỏi',
      'AI Feedback chi tiết & chuyên sâu',
      'Báo cáo kỹ năng sau mỗi buổi',
      'Ưu tiên câu hỏi mới nhất',
    ],
  },
  {
    id: 'elite',
    name: 'Bứt Phá',
    tagline: 'Dành cho người nghiêm túc',
    price: 499000,
    oldPrice: 799000,
    durationDays: 90,
    durationLabel: '3 tháng',
    credits: '150 lượt',
    icon: 'diamond',
    gradient: 'from-amber-500 to-orange-500',
    features: [
      '30 lượt mô phỏng phỏng vấn thực tế',
      'Không giới hạn luyện tập câu hỏi',
      'Hỗ trợ sửa CV bằng AI (5 lượt)',
      'Phân tích biểu cảm khuôn mặt',
      'Tư vấn lộ trình sự nghiệp',
    ],
  },
  {
    id: 'master',
    name: 'Đỉnh Cao',
    tagline: 'Toàn bộ sức mạnh AI',
    price: 999000,
    oldPrice: 1499000,
    durationDays: 180,
    durationLabel: '6 tháng',
    credits: 'Không giới hạn',
    icon: 'auto_awesome',
    gradient: 'from-rose-500 to-pink-500',
    features: [
      'Không giới hạn mọi tính năng',
      'Sửa CV không giới hạn',
      'Hỗ trợ 1-1 từ chuyên gia',
      'Truy cập VIP blog chuyên sâu',
      'Huy hiệu "Master" trên hồ sơ',
    ],
  },
];

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  tag: string;
  tagColor: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Ngọc Ánh', role: 'Marketing Exec', content: 'Minh recommend cho tất cả bạn bè. Platform dễ dùng, hiệu quả cao!', rating: 5, tag: 'GIỚI THIỆU', tagColor: 'bg-blue-100 text-blue-700' },
  { name: 'Minh Thảo', role: 'Frontend Dev', content: 'X-Interview đã giúp mình tự tin hơn rất nhiều. AI feedback chi tiết và chính xác!', rating: 5, tag: 'ĐÃ ĐƯỢC TUYỂN', tagColor: 'bg-green-100 text-green-700' },
  { name: 'Hữu Đức', role: 'Data Analyst', content: 'Sau 2 tuần luyện tập, mình đã nhận được offer từ công ty mơ ước!', rating: 5, tag: 'VIỆC MƠ ƯỚC', tagColor: 'bg-purple-100 text-purple-700' },
  { name: 'Quốc Bảo', role: 'Backend Engineer', content: 'Lỡ sợ phỏng vấn, giờ mình rất tự tin. Nào luyện mỗi khi có buổi interview mới.', rating: 5, tag: 'ĐIỂM CAO', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'Thu Trang', role: 'UX Designer', content: 'Mock interview AI giống thật đến không ngờ. Mình được nhận vào vòng final một lượt.', rating: 5, tag: 'VÀO VÒNG CUỐI', tagColor: 'bg-rose-100 text-rose-700' },
  { name: 'Hải Yến', role: 'HR Specialist', content: 'Là HR, mình thấy platform này train ứng viên rất tốt. Chất lượng phỏng vấn tăng rõ.', rating: 5, tag: 'HR ĐÁNH GIÁ CAO', tagColor: 'bg-teal-100 text-teal-700' },
  { name: 'Đức Anh', role: 'Full Stack Dev', content: 'System design questions ở đây rất hay. Mình pass interview ở Big Tech!', rating: 5, tag: 'BIG TECH', tagColor: 'bg-indigo-100 text-indigo-700' },
  { name: 'Mẫn Chi', role: 'Project Manager', content: 'Giao diện đẹp, trải nghiệm mượt. Luyện phỏng vấn chưa bao giờ dễ đến thế.', rating: 4, tag: 'DỄ SỬ DỤNG', tagColor: 'bg-cyan-100 text-cyan-700' },
  { name: 'Khánh Vy', role: 'Scrum Master', content: 'Tính năng mock interview là game changer. Như có mentor riêng 24/7!', rating: 5, tag: 'MENTOR 24/7', tagColor: 'bg-orange-100 text-orange-700' },
  { name: 'Minh Tuấn', role: 'iOS Developer', content: 'Luyện tập song, phỏng vấn real cảm giác nhẹ nhàng hơn rất nhiều.', rating: 5, tag: 'KHÔNG STRESS', tagColor: 'bg-lime-100 text-lime-700' },
];

export const FAQ_ITEMS = [
  { q: 'Lượt phỏng vấn có hiệu lực bao lâu?', a: 'Thời hạn hiệu lực tùy thuộc vào gói bạn mua. Mỗi gói hiển thị rõ thời hạn sử dụng (ví dụ: 30 ngày). 1 lượt phỏng vấn sẽ hết hạn sau thời gian đó kể từ ngày mua.' },
  { q: 'Tôi có thể mua nhiều lượt trước khi hết hạn không?', a: 'Có! Bạn hoàn toàn có thể mua thêm gói mới bất cứ lúc nào. Số lượt mới sẽ được cộng dồn vào tài khoản của bạn.' },
  { q: 'Những phương thức thanh toán nào được chấp nhận?', a: 'Chúng tôi hỗ trợ thanh toán qua chuyển khoản ngân hàng bằng mã QR. Bạn có thể quét mã bằng bất kỳ ứng dụng ngân hàng nào.' },
  { q: 'Mỗi gói bao gồm những gì?', a: 'Mỗi gói bao gồm số lượt luyện tập phỏng vấn AI, câu hỏi từ ngân hàng câu hỏi phong phú, và phản hồi chi tiết từ AI sau mỗi buổi.' },
  { q: 'Điều gì xảy ra khi lượt phỏng vấn hết hạn?', a: 'Khi hết hạn, bạn sẽ không thể sử dụng các tính năng nâng cao. Tuy nhiên, bạn vẫn có thể xem lại lịch sử luyện tập và báo cáo cũ.' },
];
