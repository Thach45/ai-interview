import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InterviewLanguage } from '@prisma/client';
import { AppException } from '../../common/exceptions/AppException';

type GroqTranscriptionResponse = {
  text?: string;
};

@Injectable()
export class GroqSttService {
  constructor(private readonly configService: ConfigService) {}

  async transcribeAudio(
    audioBuffer: Buffer,
    mimeType: string,
    language: InterviewLanguage,
    prompt?: string,
  ): Promise<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new AppException('Chưa cấu hình GROQ_API_KEY', 500);
    }

    const formData = new FormData();
    const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
      type: mimeType,
    });

    formData.append('file', audioBlob, 'recording.webm');
    formData.append(
      'model',
      this.configService.get<string>('GROQ_STT_MODEL') || 'whisper-large-v3',
    );
    formData.append(
      'language',
      language === InterviewLanguage.ENGLISH ? 'en' : 'vi',
    );
    if (prompt) {
      formData.append('prompt', prompt);
    }
    formData.append('temperature', '0');
    formData.append('response_format', 'json');

    const response = await axios.post<GroqTranscriptionResponse>(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 30000,
      },
    );

    return response.data.text?.trim() || '';
  }
}
