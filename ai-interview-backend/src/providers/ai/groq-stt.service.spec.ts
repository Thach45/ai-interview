import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InterviewLanguage } from '@prisma/client';
import { GroqSttService } from './groq-stt.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GroqSttService', () => {
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'GROQ_API_KEY') return 'groq-test-key';
      return undefined;
    }),
  } as unknown as ConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends WebM audio to Whisper Large v3 with the session language', async () => {
    mockedAxios.post.mockResolvedValue({ data: { text: 'Xin chào' } });
    const service = new GroqSttService(configService);

    const transcript = await service.transcribeAudio(
      Buffer.from('audio'),
      'audio/webm',
      InterviewLanguage.VIETNAMESE,
      'Interview role: Backend Engineer. Focus skills: NestJS, PostgreSQL.',
    );

    expect(transcript).toBe('Xin chào');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      expect.any(FormData),
      expect.objectContaining({
        headers: { Authorization: 'Bearer groq-test-key' },
        timeout: 30000,
      }),
    );

    const formData = mockedAxios.post.mock.calls[0][1] as FormData;
    expect(formData.get('model')).toBe('whisper-large-v3');
    expect(formData.get('language')).toBe('vi');
    expect(formData.get('temperature')).toBe('0');
    expect(formData.get('prompt')).toContain('Backend Engineer');
  });
});
