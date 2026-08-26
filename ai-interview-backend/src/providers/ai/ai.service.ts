import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { InterviewLanguage } from '@prisma/client';
import {
  CV_ANALYSIS_RESPONSE_SCHEMA,
  CV_ANALYSIS_SYSTEM_PROMPT,
  getCVAnalysisUserPrompt,
} from '../../prompts/cv-analysis.prompt';
import {
  CV_OPTIMIZATION_SYSTEM_PROMPT,
  CV_OPTIMIZATION_RESPONSE_SCHEMA,
  getCVOptimizationUserPrompt,
} from '../../prompts/cv-optimization.prompt';
import { EXTRACT_CV_SYSTEM_PROMPT } from '../../prompts/cv-extraction.prompt';
import {
  CREATE_QUESTIONS_SYSTEM_PROMPT,
  getCreateQuestionsUserPrompt,
  CREATE_QUESTIONS_RESPONSE_SCHEMA,
  GenerateQuestionsInput,
} from '../../prompts/create-quesition-interview.prompt';
import {
  INTERVIEW_CHAT_RESPONSE_SCHEMA,
  getInterviewChatUserPrompt,
  getInterviewChatSystemPrompt,
  InterviewChatInput,
} from '../../prompts/interview-chat.prompt';
import {
  SubmitInterviewResultInput,
  getSubmitInterviewResultSystemPrompt,
  getSubmitInterviewResultUserPrompt,
  SUBMIT_INTERVIEW_RESULT_RESPONSE_SCHEMA,
} from '../../prompts/submit-interview-result.prompt';
import { AppException } from '../../common/exceptions/AppException';
import { calculateFinalInterviewResult } from '../../common/utils/scoring.util';
import { StreamReplyExtractor } from '../../common/utils/stream.util';
import { validateJsonb } from '../../common/validation/jsonb-validation.util';
import {
  ChatInterviewResponseJsonDto,
  CoreQuestionsResponseJsonDto,
  CvAnalysisResultJsonDto,
  CvDataJsonDto,
  CvOptimizationResultJsonDto,
  SubmitInterviewResultJsonDto,
} from '../../common/validation/jsonb.dto';

const AI_MODEL_CONFIG = {
  model: 'gemini-2.5-flash',
  config: {
    responseMimeType: 'application/json' as const,
    temperature: 0.2,
  },
};

@Injectable()
export class AiService {
  constructor(
    @Inject('DEEPSEEK_CLIENT') private readonly deepseek: OpenAI,
    @Inject('GEMINI_CLIENT') private readonly gemini: GoogleGenAI,
  ) {}

  private async generateDeepSeekContent(
    systemInstruction: string,
    userPrompt: string,
    schema?: any,
  ): Promise<string> {
    const finalSystemInstruction = schema
      ? `${systemInstruction}\n\nĐỊNH DẠNG ĐẦU RA BẮT BUỘC (JSON):\n${JSON.stringify(schema)}`
      : systemInstruction;

    const response = await this.deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: finalSystemInstruction },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const responseText = response.choices[0]?.message?.content || '';
    return responseText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
  }

  private async generateDeepSeekProContent(
    systemInstruction: string,
    userPrompt: string,
    schema?: any,
  ): Promise<string> {
    const finalSystemInstruction = schema
      ? `${systemInstruction}\n\nĐỊNH DẠNG ĐẦU RA BẮT BUỘC (JSON):\n${JSON.stringify(schema)}`
      : systemInstruction;

    const response = await this.deepseek.chat.completions.create({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: finalSystemInstruction },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const responseText = response.choices[0]?.message?.content || '';
    return responseText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
  }

  private generateDeepSeekStream(
    systemInstruction: string,
    userPrompt: string,
    schema?: any,
  ) {
    const finalSystemInstruction = schema
      ? `${systemInstruction}\n\nĐỊNH DẠNG ĐẦU RA BẮT BUỘC (JSON):\n${JSON.stringify(schema)}`
      : systemInstruction;

    return this.deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: finalSystemInstruction },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      stream: true,
    });
  }

  async transcribeAudio(
    audioBuffer: Buffer,
    mimeType: string,
    language: InterviewLanguage = InterviewLanguage.VIETNAMESE,
  ): Promise<string> {
    const langStr =
      language === InterviewLanguage.ENGLISH ? 'Tiếng Anh' : 'Tiếng Việt';
    try {
      const response = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: audioBuffer.toString('base64'),
                  mimeType,
                },
              },
              {
                text: `Bạn là một chuyên gia nhận diện giọng nói. Ngôn ngữ của đoạn hội thoại này là: ${langStr}. Hãy chuyển đổi đoạn âm thanh này thành văn bản một cách chính xác nhất. Chỉ trả về văn bản được nói, không thêm bất kỳ nhận xét, chú thích hay văn bản nào khác. Nếu không nghe rõ, hãy trả về rỗng.`,
              },
            ],
          },
        ],
        config: {
          temperature: 0.1,
        },
      });

      return response.text?.trim() || '';
    } catch (error) {
      console.error('Lỗi khi transcribe audio với Gemini:', error);
      throw new AppException('Lỗi chuyển đổi giọng nói thành văn bản', 500);
    }
  }

  /**
   * Bước 0: Trích xuất Text PDF -> Cấu trúc JSON chuẩn CvDataStructure
   * @param rawText Text được bóc tách từ PDF
   */
  async extractCvData(rawText: string): Promise<any> {
    try {
      console.log('AI Service: Starting CV Extraction...');

      const response = await this.generateDeepSeekContent(
        EXTRACT_CV_SYSTEM_PROMPT,
        `Đây là nội dung CV thô:\n\n${rawText}`,
        true,
      );

      let content = response.trim();
      if (content.startsWith('```json')) {
        content = content
          .replace(/^```json/, '')
          .replace(/```$/, '')
          .trim();
      }

      const parsed = JSON.parse(content);
      const validated = await validateJsonb(
        CvDataJsonDto,
        parsed,
        'Kết quả trích xuất CV từ AI',
      );

      console.log('AI Service: Finished CV Extraction');
      return validated;
    } catch (error) {
      console.error('Lỗi khi trích xuất thông tin CV (extractCvData):', error);
      throw error;
    }
  }

  async analysisCV(cvContent: string, jobDescription: string) {
    try {
      const userPrompt = getCVAnalysisUserPrompt(cvContent, jobDescription);
      let responseText = '';

      try {
        responseText = await this.generateDeepSeekContent(
          CV_ANALYSIS_SYSTEM_PROMPT,
          userPrompt,
          CV_ANALYSIS_RESPONSE_SCHEMA,
        );

        if (!responseText) {
          throw new Error('DeepSeek không phản hồi.');
        }
      } catch (deepSeekError: any) {
        console.warn(
          'DeepSeek failed in analysisCV, falling back to Gemini:',
          deepSeekError.message,
        );

        const response = await this.gemini.models.generateContent({
          model: AI_MODEL_CONFIG.model,
          contents: userPrompt,
          config: {
            ...AI_MODEL_CONFIG.config,
            systemInstruction: CV_ANALYSIS_SYSTEM_PROMPT,
            responseSchema: CV_ANALYSIS_RESPONSE_SCHEMA,
          },
        });

        if (!response.text) {
          throw new Error(
            'Gemini fallback cũng không phản hồi dữ liệu phân tích CV.',
          );
        }
        responseText = response.text;
      }

      return validateJsonb(
        CvAnalysisResultJsonDto,
        JSON.parse(responseText),
        'Kết quả phân tích CV từ AI',
      );
    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', {
        cause: error,
      });
    }
  }

  async optimizeCV(
    cvContent: string,
    missingKeywords: string[],
    improvementSuggestions: any[],
  ) {
    try {
      const userPrompt = getCVOptimizationUserPrompt(
        cvContent,
        missingKeywords,
        improvementSuggestions,
      );
      let responseText = '';

      try {
        responseText = await this.generateDeepSeekContent(
          CV_OPTIMIZATION_SYSTEM_PROMPT,
          userPrompt,
          CV_OPTIMIZATION_RESPONSE_SCHEMA,
        );

        if (!responseText) {
          throw new Error('DeepSeek không phản hồi.');
        }
      } catch (deepSeekError: any) {
        console.warn(
          'DeepSeek failed in optimizeCV, falling back to Gemini:',
          deepSeekError.message,
        );

        const response = await this.gemini.models.generateContent({
          model: AI_MODEL_CONFIG.model,
          contents: userPrompt,
          config: {
            ...AI_MODEL_CONFIG.config,
            systemInstruction: CV_OPTIMIZATION_SYSTEM_PROMPT,
            responseSchema: CV_OPTIMIZATION_RESPONSE_SCHEMA,
          },
        });

        if (!response.text) {
          throw new Error(
            'Gemini fallback cũng không phản hồi dữ liệu tối ưu CV.',
          );
        }
        responseText = response.text;
      }

      return validateJsonb(
        CvOptimizationResultJsonDto,
        JSON.parse(responseText),
        'Kết quả tối ưu CV từ AI',
      );
    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI (optimizeCV).', {
        cause: error,
      });
    }
  }

  async createQuestionForInterview(input: GenerateQuestionsInput) {
    try {
      const userPrompt = getCreateQuestionsUserPrompt(input);
      let responseText = '';

      try {
        responseText = await this.generateDeepSeekContent(
          CREATE_QUESTIONS_SYSTEM_PROMPT,
          userPrompt,
          CREATE_QUESTIONS_RESPONSE_SCHEMA,
        );

        if (!responseText) {
          throw new Error('DeepSeek không phản hồi.');
        }
      } catch (deepSeekError: any) {
        console.warn(
          'DeepSeek failed in createQuestionForInterview, falling back to Gemini:',
          deepSeekError.message,
        );

        const response = await this.gemini.models.generateContent({
          model: AI_MODEL_CONFIG.model,
          contents: userPrompt,
          config: {
            ...AI_MODEL_CONFIG.config,
            systemInstruction: CREATE_QUESTIONS_SYSTEM_PROMPT,
            responseSchema: CREATE_QUESTIONS_RESPONSE_SCHEMA,
          },
        });

        if (!response.text) {
          throw new Error(
            'Gemini fallback cũng không phản hồi dữ liệu câu hỏi phỏng vấn.',
          );
        }
        responseText = response.text;
      }

      const parsed = JSON.parse(responseText);
      if (parsed && Array.isArray(parsed.questions)) {
        const normalized = {
          questions: parsed.questions.map((q: any) => ({
            title: q.title || q.topic || 'Chủ đề phỏng vấn',
            reason:
              q.reason ||
              q.explanation ||
              'Đánh giá năng lực chuyên môn của ứng viên.',
            criteria: q.criteria || [],
          })),
        };
        const validated = await validateJsonb(
          CoreQuestionsResponseJsonDto,
          normalized,
          'Bộ câu hỏi phỏng vấn từ AI',
        );
        return validated.questions;
      } else {
        throw new Error(
          'Cấu trúc câu hỏi trả về từ AI không đúng định dạng mong muốn.',
        );
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi AI thiết lập bộ câu hỏi:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', {
        cause: error,
      });
    }
  }

  async chatInterview(
    input: InterviewChatInput,
    onStream?: (text: string) => void,
  ) {
    try {
      const systemInstruction = getInterviewChatSystemPrompt(input);
      const userPrompt = getInterviewChatUserPrompt(input);

      let extractor = new StreamReplyExtractor(onStream);

      try {
        const dsStream = await this.generateDeepSeekStream(
          systemInstruction,
          userPrompt,
          INTERVIEW_CHAT_RESPONSE_SCHEMA,
        );
        for await (const chunk of dsStream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            extractor.process(content);
          }
        }
        console.log('deepseek đang nói');
      } catch (deepSeekError: any) {
        console.warn(
          'DeepSeek stream failed in chatInterview, falling back to Gemini:',
          deepSeekError.message,
        );

        extractor = new StreamReplyExtractor(onStream);

        const responseStream = await this.gemini.models.generateContentStream({
          model: AI_MODEL_CONFIG.model,
          contents: userPrompt,
          config: {
            ...AI_MODEL_CONFIG.config,
            systemInstruction,
            responseSchema: INTERVIEW_CHAT_RESPONSE_SCHEMA,
          },
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            extractor.process(chunk.text);
          }
        }
      }

      if (!extractor.fullText) {
        throw new Error('AI không phản hồi dữ liệu hội thoại phỏng vấn.');
      }

      return validateJsonb(
        ChatInterviewResponseJsonDto,
        JSON.parse(extractor.fullText),
        'Phản hồi hội thoại từ AI',
      );
    } catch (error: any) {
      console.error('Lỗi khi gọi AI chat phỏng vấn:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', {
        cause: error,
      });
    }
  }

  async submitInterviewResult(input: SubmitInterviewResultInput) {
    try {
      const systemInstruction = getSubmitInterviewResultSystemPrompt(input);
      const userPrompt = getSubmitInterviewResultUserPrompt(input);

      let responseText = '';

      try {
        responseText = await this.generateDeepSeekProContent(
          systemInstruction,
          userPrompt,
          SUBMIT_INTERVIEW_RESULT_RESPONSE_SCHEMA,
        );

        if (!responseText) {
          throw new Error('DeepSeek không phản hồi dữ liệu đánh giá.');
        }
      } catch (deepSeekError: any) {
        console.warn(
          'DeepSeek failed in submitInterviewResult, falling back to Gemini:',
          deepSeekError.message,
        );

        const response = await this.gemini.models.generateContent({
          model: AI_MODEL_CONFIG.model,
          contents: userPrompt,
          config: {
            ...AI_MODEL_CONFIG.config,
            systemInstruction,
            responseSchema: SUBMIT_INTERVIEW_RESULT_RESPONSE_SCHEMA,
          },
        });

        if (!response.text) {
          throw new Error(
            'Gemini fallback cũng không phản hồi dữ liệu báo cáo đánh giá.',
          );
        }
        responseText = response.text;
      }

      const parsed = await validateJsonb(
        SubmitInterviewResultJsonDto,
        JSON.parse(responseText),
        'Kết quả chấm phỏng vấn từ AI',
      );

      return calculateFinalInterviewResult(parsed, input.coreQuestions);
    } catch (error: any) {
      console.error('Lỗi khi gọi AI submit interview result:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', {
        cause: error,
      });
    }
  }
}
