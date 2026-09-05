import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InterviewLanguage } from '@prisma/client';
import { AppException } from '../../common/exceptions/AppException';

type OpenRouterTranscriptionResponse = {
  text?: string;
};

@Injectable()
export class OpenRouterSttService {
  constructor(private readonly configService: ConfigService) {}

  async transcribeAudio(
    audioBuffer: Buffer,
    _mimeType: string,
    language: InterviewLanguage,
    prompt?: string,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new AppException('Chưa cấu hình OPENROUTER_API_KEY', 500);
    }

    const apiUrl =
      this.configService.get<string>('OPENROUTER_STT_API_URL') ||
      'https://openrouter.ai/api/v1/audio/transcriptions';

    const response = await axios.post<OpenRouterTranscriptionResponse>(
      apiUrl,
      {
        model:
          this.configService.get<string>('OPENROUTER_STT_MODEL') ||
          'openai/whisper-large-v3-turbo',
        input_audio: {
          data: audioBuffer.toString('base64'),
          format: 'webm',
        },
        language: language === InterviewLanguage.ENGLISH ? 'en' : 'vi',
        prompt,
        temperature: 0,
        provider: {
          order: ['Groq', 'DeepInfra'],
          allow_fallbacks: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );

    return response.data.text?.trim() || '';
  }
}
