import { Injectable } from '@nestjs/common';
import { GoogleTtsService } from '../../providers/ai/google-tts.service';
import { InterviewPersona, InterviewLanguage } from '@prisma/client';

@Injectable()
export class TtsService {
  constructor(private readonly googleTtsService: GoogleTtsService) {}

  /**
   * Tong hop giong noi tu van ban
   */
  async synthesizeSpeech(
    text: string,
    persona?: InterviewPersona,
  ): Promise<{ audioBase64: string }> {
    const audioBuffer = await this.googleTtsService.synthesizeSpeech(
      text,
      InterviewLanguage.VIETNAMESE,
      persona || InterviewPersona.PROFESSIONAL,
    );

    return {
      audioBase64: audioBuffer.toString('base64'),
    };
  }

  /**
   * Lay danh sach cac giong noi/persona co san
   */
  getAvailableVoices() {
    const personas = Object.values(InterviewPersona);
    const languages = Object.values(InterviewLanguage);

    return personas.map((persona) => ({
      persona,
      label: this.getPersonaLabel(persona),
      languages,
    }));
  }

  private getPersonaLabel(persona: InterviewPersona): string {
    const labels: Record<InterviewPersona, string> = {
      [InterviewPersona.PROFESSIONAL]: 'Chuyen nghiep',
      [InterviewPersona.FRIENDLY]: 'Than thien',
      [InterviewPersona.STRICT]: 'Nghiem khac',
      [InterviewPersona.CHEERFUL]: 'Vui ve',
    };
    return labels[persona] || persona;
  }
}
