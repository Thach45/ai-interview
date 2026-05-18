import { InterviewPersona } from '../types/interview-ai.type';

export const PERSONA_VOICES = {
  [InterviewPersona.PROFESSIONAL]: { voiceId: 'vi-VN-Wavenet-A', speed: 1.0, pitch: 0.0 },
  [InterviewPersona.FRIENDLY]: { voiceId: 'vi-VN-Standard-B', speed: 0.95, pitch: 0.5 },
  [InterviewPersona.STRICT]: { voiceId: 'vi-VN-Wavenet-D', speed: 1.05, pitch: -1.0 },
  [InterviewPersona.CHEERFUL]: { voiceId: 'vi-VN-Standard-C', speed: 1.1, pitch: 1.0 },
};
