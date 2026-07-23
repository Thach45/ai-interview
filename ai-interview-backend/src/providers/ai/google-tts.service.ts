import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InterviewPersona, InterviewLanguage } from '@prisma/client';
import { PERSONA_VOICES } from '../../common/const/persona-tts';
import { AppException } from '../../common/exceptions/AppException';

@Injectable()
export class GoogleTtsService {
  constructor(private readonly configService: ConfigService) {}

  async synthesizeSpeech(
    text: string,
    language: InterviewLanguage = InterviewLanguage.VIETNAMESE,
    persona: InterviewPersona = InterviewPersona.PROFESSIONAL,
  ): Promise<Buffer> {
    const apiKey = this.configService.get<string>('GOOGLE_TTS_API_KEY');
    if (!apiKey) {
      throw new AppException('Chưa cấu hình GOOGLE_TTS_API_KEY', 500);
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    // Fallback in case persona doesn't exist for some reason
    const voiceConfig =
      PERSONA_VOICES[language]?.[persona] ||
      PERSONA_VOICES[InterviewLanguage.VIETNAMESE][
        InterviewPersona.PROFESSIONAL
      ];

    const requestBody = {
      input: { text },
      voice: {
        languageCode: voiceConfig.voiceId.slice(0, 5),
        name: voiceConfig.voiceId,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: voiceConfig.speed,
        pitch: voiceConfig.pitch,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lỗi Google TTS:', errorText);
      throw new AppException('Không thể tạo giọng nói từ AI', 500);
    }

    const data = await response.json();
    // data.audioContent là chuỗi mã hóa base64
    return Buffer.from(data.audioContent, 'base64');
  }
}
