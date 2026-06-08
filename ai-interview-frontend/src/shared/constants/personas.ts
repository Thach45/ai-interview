import { InterviewPersona } from '../types/interview';

export const PERSONA_DETAILS = {
  [InterviewPersona.PROFESSIONAL]: {
    name: 'Ms. Thảo Chi',
    title: 'Chuyên gia Phỏng vấn Chuyên nghiệp',
    role: 'Senior Technical Recruiter',
    desc: 'Ms. Thảo Chi có hơn 10 năm kinh nghiệm tuyển dụng. Cô luôn đặt câu hỏi một cách hệ thống, tập trung cao vào cấu trúc trả lời STAR và tư duy thiết kế cốt lõi của ứng viên.',
    avatar: '/avatars/thao-chi.png',
    accent: 'bg-blue-600',
    textAccent: 'text-blue-600',
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    theme: 'from-blue-100 to-indigo-100',
    glow: 'shadow-blue-200',
    darkTheme: 'from-blue-900/20 to-indigo-900/20',
    previewAudio: '/audio/thao-chi-preview.mp3',
    welcomeTone: "Chào bạn. Tôi là Thảo Chi, chuyên viên phỏng vấn của bạn ngày hôm nay. Chúng ta sẽ cùng trao đổi chuyên sâu về các kỹ năng, kiến thức chuyên môn cũng như kinh nghiệm làm việc của bạn thông qua một số câu hỏi có cấu trúc. Hãy cố gắng trả lời một cách mạch lạc, đúng trọng tâm theo mô hình STAR nhé."
  },
  [InterviewPersona.FRIENDLY]: {
    name: 'Mr. Nam Anh',
    title: 'Người phỏng vấn Đồng hành',
    role: 'Technical Mentor',
    desc: 'Mr. Nam Anh có phong cách phỏng vấn thoải mái, lắng nghe và nâng đỡ ứng viên. Anh ấy luôn khích lệ bạn tự tin đưa ra giải pháp trước khi đi sâu vào kỹ thuật.',
    avatar: '/avatars/nam-anh.png',
    accent: 'bg-emerald-600',
    textAccent: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-100',
    theme: 'from-emerald-100 to-teal-100',
    glow: 'shadow-emerald-200',
    darkTheme: 'from-emerald-900/20 to-teal-900/20',
    previewAudio: '/audio/nam-anh-preview.mp3',
    welcomeTone: "Chào bạn nhé! Mình là Nam Anh. Bạn cứ bình tĩnh và thoải mái coi đây như một buổi trò chuyện trao đổi kinh nghiệm thông thường thôi nhé. Mình ở đây để giúp bạn thể hiện tốt nhất năng lực của bản thân, nên có gì cứ chia sẻ tự nhiên nha. Bạn đã sẵn sàng chưa nào?"
  },
  [InterviewPersona.STRICT]: {
    name: 'Mr. Quốc Hùng',
    title: 'Chuyên gia Kỹ thuật Áp lực',
    role: 'Principal System Engineer',
    desc: 'Mr. Quốc Hùng cực kỳ khắt khe về kỹ thuật. Anh thích xoáy sâu vào cốt lõi vấn đề, phát hiện nhanh các lỗi logic và thách thức ứng viên dưới áp lực thời gian.',
    avatar: '/avatars/quoc-hung.png',
    accent: 'bg-rose-600',
    textAccent: 'text-rose-600',
    bg: 'bg-rose-50/50',
    border: 'border-rose-100',
    theme: 'from-rose-100 to-orange-100',
    glow: 'shadow-rose-200',
    darkTheme: 'from-rose-900/20 to-orange-900/20',
    previewAudio: '/audio/quoc-hung-preview.mp3',
    welcomeTone: "Tôi là Quốc Hùng. Buổi phỏng vấn hôm nay sẽ đi thẳng vào các kiến thức thực tế và năng lực giải quyết vấn đề của bạn. Tôi hy vọng bạn sẽ trả lời ngắn gọn, thực tế, tránh nói lý thuyết suông và tập trung vào bản chất công việc. Chúng ta bắt đầu luôn nhé."
  },
  [InterviewPersona.CHEERFUL]: {
    name: 'Ms. Linh San',
    title: 'Người truyền năng lượng Tích cực',
    role: 'Engineering Lead',
    desc: 'Ms. Linh San luôn mang đến năng lượng vui tươi và nhiều nụ cười. Cô tin rằng một tinh thần thoải mái sẽ giúp lập trình viên bộc lộ tối đa sức sáng tạo.',
    avatar: '/avatars/linh-san.png',
    accent: 'bg-amber-600',
    textAccent: 'text-amber-600',
    bg: 'bg-amber-50/50',
    border: 'border-amber-100',
    theme: 'from-amber-100 to-orange-100',
    glow: 'shadow-amber-200',
    darkTheme: 'from-amber-900/20 to-orange-900/20',
    previewAudio: '/audio/linh-san-preview.mp3',
    welcomeTone: "Hi bạn! Mình là Linh San cực kỳ vui vẻ đây! Rất vui được gặp bạn trong phòng phỏng vấn hôm nay nha. Cứ thả lỏng tinh thần, chuẩn bị một ly nước ấm rồi chúng mình cùng nhau thảo luận những điều thú vị về chuyên môn của bạn nhé. Bắt đầu nha!"
  }
};
