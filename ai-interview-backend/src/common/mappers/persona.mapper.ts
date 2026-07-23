import { InterviewPersona } from '@prisma/client';

export interface PersonaDetails {
  id: string;
  name: string;
  title: string;
  desc: string;
  avatarUrl: string;
  voiceId: string;
  theme: string;
  darkTheme: string;
  glow: string;
  accent: string;
}

export const getPersonaDetails = (
  persona: InterviewPersona,
): PersonaDetails => {
  const mapping: Record<InterviewPersona, PersonaDetails> = {
    [InterviewPersona.PROFESSIONAL]: {
      id: InterviewPersona.PROFESSIONAL,
      name: 'Ms. Thảo Chi',
      title: 'Chuyên nghiệp',
      desc: 'Nghiêm túc, tập trung vào phương pháp STAR và tư duy hệ thống.',
      avatarUrl: '/avatars/thao-chi.png',
      voiceId: 'vi-VN-Wavenet-A',
      theme: 'from-blue-100 to-indigo-100',
      darkTheme: 'from-blue-900/20 to-indigo-900/20',
      glow: 'shadow-blue-200',
      accent: 'text-blue-600',
    },
    [InterviewPersona.FRIENDLY]: {
      id: InterviewPersona.FRIENDLY,
      name: 'Mr. Nam Anh',
      title: 'Hỗ trợ',
      desc: 'Tông giọng khích lệ, giúp bạn xây dựng sự tự tin khi trả lời.',
      avatarUrl: '/avatars/nam-anh.png',
      voiceId: 'vi-VN-Standard-B',
      theme: 'from-emerald-100 to-teal-100',
      darkTheme: 'from-emerald-900/20 to-teal-900/20',
      glow: 'shadow-emerald-200',
      accent: 'text-emerald-600',
    },
    [InterviewPersona.STRICT]: {
      id: InterviewPersona.STRICT,
      name: 'Mr. Quốc Hùng',
      title: 'Áp lực',
      desc: 'Đặt câu hỏi dồn dập, xoáy sâu vào các sơ hở trong câu trả lời hoặc điểm yếu trong CV.',
      avatarUrl: '/avatars/quoc-hung.png',
      voiceId: 'vi-VN-Wavenet-D',
      theme: 'from-rose-100 to-orange-100',
      darkTheme: 'from-rose-900/20 to-orange-900/20',
      glow: 'shadow-rose-200',
      accent: 'text-rose-600',
    },
    [InterviewPersona.CHEERFUL]: {
      id: InterviewPersona.CHEERFUL,
      name: 'Ms. Linh San',
      title: 'Vui vẻ',
      desc: 'Năng lượng tích cực, tạo không khí thoải mái như một buổi cafe.',
      avatarUrl: '/avatars/linh-san.png',
      voiceId: 'vi-VN-Standard-C',
      theme: 'from-amber-100 to-orange-100',
      darkTheme: 'from-amber-900/20 to-orange-900/20',
      glow: 'shadow-amber-200',
      accent: 'text-amber-600',
    },
  };

  return mapping[persona] || mapping[InterviewPersona.PROFESSIONAL];
};
