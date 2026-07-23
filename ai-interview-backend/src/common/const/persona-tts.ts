import { InterviewPersona, InterviewLanguage } from '@prisma/client';

export const PERSONA_VOICES: Record<
  InterviewLanguage,
  Record<InterviewPersona, { voiceId: string; speed: number; pitch: number }>
> = {
  [InterviewLanguage.VIETNAMESE]: {
    [InterviewPersona.PROFESSIONAL]: {
      voiceId: 'vi-VN-Wavenet-A',
      speed: 1.0,
      pitch: 0.0,
    }, // Nữ, chuẩn mực
    [InterviewPersona.FRIENDLY]: {
      voiceId: 'vi-VN-Standard-B',
      speed: 0.95,
      pitch: 0.5,
    }, // Nam, giọng ấm
    [InterviewPersona.STRICT]: {
      voiceId: 'vi-VN-Wavenet-D',
      speed: 1.05,
      pitch: -1.0,
    }, // Nam, trầm
    [InterviewPersona.CHEERFUL]: {
      voiceId: 'vi-VN-Standard-C',
      speed: 1.1,
      pitch: 1.0,
    }, // Nữ, cao
  },
  [InterviewLanguage.ENGLISH]: {
    [InterviewPersona.PROFESSIONAL]: {
      voiceId: 'en-US-Neural2-F',
      speed: 1.0,
      pitch: 0.0,
    }, // Nữ, điềm đạm
    [InterviewPersona.FRIENDLY]: {
      voiceId: 'en-US-Neural2-D',
      speed: 1.0,
      pitch: 0.0,
    }, // Nam, thân thiện
    [InterviewPersona.STRICT]: {
      voiceId: 'en-US-Neural2-J',
      speed: 1.0,
      pitch: -1.0,
    }, // Nam, trầm ấm, nghiêm
    [InterviewPersona.CHEERFUL]: {
      voiceId: 'en-US-Neural2-E',
      speed: 1.1,
      pitch: 1.0,
    }, // Nữ, năng động
  },
  [InterviewLanguage.BILINGUAL]: {
    [InterviewPersona.PROFESSIONAL]: {
      voiceId: 'en-US-Neural2-F',
      speed: 1.0,
      pitch: 0.0,
    }, // Mặc định dùng tiếng Anh cho song ngữ
    [InterviewPersona.FRIENDLY]: {
      voiceId: 'en-US-Neural2-D',
      speed: 1.0,
      pitch: 0.0,
    },
    [InterviewPersona.STRICT]: {
      voiceId: 'en-US-Neural2-J',
      speed: 1.0,
      pitch: -1.0,
    },
    [InterviewPersona.CHEERFUL]: {
      voiceId: 'en-US-Neural2-E',
      speed: 1.1,
      pitch: 1.0,
    },
  },
};
