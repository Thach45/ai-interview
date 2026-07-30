import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { AiService } from './ai.service';
import { GoogleTtsService } from './google-tts.service';
import { GroqSttService } from './groq-stt.service';

@Global()
@Module({
  providers: [
    AiService,
    GoogleTtsService,
    GroqSttService,
    {
      provide: 'DEEPSEEK_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          baseURL: 'https://api.deepseek.com',
          apiKey: configService.get<string>('DEEPSEEK_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'GEMINI_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new GoogleGenAI({
          apiKey: configService.get<string>('GEMINI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    AiService,
    GoogleTtsService,
    GroqSttService,
    'DEEPSEEK_CLIENT',
    'GEMINI_CLIENT',
  ],
})
export class AiModule {}
