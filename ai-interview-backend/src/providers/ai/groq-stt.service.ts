import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
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

    const extension = mimeType.includes('mp3')
      ? 'mp3'
      : mimeType.includes('wav')
        ? 'wav'
        : 'webm';

    const formData = new FormData();
    formData.append('file', audioBuffer, `audio.${extension}`);
    formData.append(
      'model',
      this.configService.get<string>('GROQ_STT_MODEL') ||
        'whisper-large-v3-turbo',
    );
    formData.append(
      'language',
      language === InterviewLanguage.ENGLISH ? 'en' : 'vi',
    );
    if (prompt) {
      formData.append('prompt', prompt);
    }
    formData.append('temperature', '0');

    const response = await axios.post<GroqTranscriptionResponse>(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...formData.getHeaders(),
        },
        timeout: 15000,
      },
    );

    return response.data.text?.trim() || '';
  }
}
