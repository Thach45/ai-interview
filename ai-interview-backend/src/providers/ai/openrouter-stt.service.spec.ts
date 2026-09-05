import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InterviewLanguage } from '@prisma/client';
import { OpenRouterSttService } from './openrouter-stt.service';

describe('OpenRouterSttService', () => {
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'OPENROUTER_API_KEY') return 'openrouter-test-key';
      return undefined;
    }),
  } as unknown as ConfigService;

  let postSpy: jest.SpiedFunction<typeof axios.post>;

  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    postSpy.mockRestore();
  });

  it('sends WebM audio to Whisper via OpenRouter with the session language', async () => {
    postSpy.mockResolvedValue({ data: { text: 'Xin chào' } });
    const service = new OpenRouterSttService(configService);

    const transcript = await service.transcribeAudio(
      Buffer.from('audio'),
      'audio/webm',
      InterviewLanguage.VIETNAMESE,
      'Interview role: Backend Engineer. Focus skills: NestJS, PostgreSQL.',
    );

    expect(transcript).toBe('Xin chào');
    expect(postSpy).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/audio/transcriptions',
      expect.objectContaining({
        model: 'openai/whisper-large-v3-turbo',
        input_audio: expect.objectContaining({
          data: Buffer.from('audio').toString('base64'),
          format: 'webm',
        }),
        language: 'vi',
        prompt:
          'Interview role: Backend Engineer. Focus skills: NestJS, PostgreSQL.',
        temperature: 0,
        provider: {
          order: ['Groq', 'DeepInfra'],
          allow_fallbacks: true,
        },
      }),
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer openrouter-test-key',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }),
    );
  });
});
