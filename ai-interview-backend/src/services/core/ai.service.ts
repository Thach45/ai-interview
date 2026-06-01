import { ai, AI_MODEL_CONFIG } from '../../config/ai.config';
import {
  CV_ANALYSIS_RESPONSE_SCHEMA,
  CV_ANALYSIS_SYSTEM_PROMPT,
  getCVAnalysisUserPrompt,
} from '../../prompts/cv-analysis.prompt';
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

export class AiService {
  async analysisCV(cvContent: string, jobDescription: string) {
    try {
      const userPrompt = getCVAnalysisUserPrompt(cvContent, jobDescription);

      const response = await ai.models.generateContent({
        model: AI_MODEL_CONFIG.model,
        contents: userPrompt,
        config: {
          ...AI_MODEL_CONFIG.config,
          systemInstruction: CV_ANALYSIS_SYSTEM_PROMPT,
          responseSchema: CV_ANALYSIS_RESPONSE_SCHEMA,
        },
      });

      if (!response.text) {
        throw new Error('AI không trả về nội dung phân tích.');
      }
      return JSON.parse(response.text);
    } catch (error: any) {
      console.error('AI Service Error:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', { cause: error });
    }
  }

  async createQuestionForInterview(input: GenerateQuestionsInput) {
    try {
      const userPrompt = getCreateQuestionsUserPrompt(input);

      const response = await ai.models.generateContent({
        model: AI_MODEL_CONFIG.model,
        contents: userPrompt,
        config: {
          ...AI_MODEL_CONFIG.config,
          systemInstruction: CREATE_QUESTIONS_SYSTEM_PROMPT,
          responseSchema: CREATE_QUESTIONS_RESPONSE_SCHEMA,
        },
      });

      if (!response.text) {
        throw new Error('AI không phản hồi dữ liệu câu hỏi phỏng vấn.');
      }

      const parsed = JSON.parse(response.text);
      if (parsed && Array.isArray(parsed.questions)) {
        return parsed.questions.map((q: any) => ({
          title: q.title || q.topic || 'Chủ đề phỏng vấn',
          reason: q.reason || q.explanation || 'Đánh giá năng lực chuyên môn của ứng viên.',
        })) as { title: string; reason: string }[];
      } else {
        throw new Error('Cấu trúc câu hỏi trả về từ AI không đúng định dạng mong muốn.');
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi AI thiết lập bộ câu hỏi:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', { cause: error });
    }
  }

  async chatInterview(input: InterviewChatInput) {
    try {
      // System prompt: static context (CV, JD, session config, persona)
      const systemInstruction = getInterviewChatSystemPrompt(input);

      // User prompt: dynamic per-turn data (current question, history, user response)
      const userPrompt = getInterviewChatUserPrompt(input);

      const response = await ai.models.generateContent({
        model: AI_MODEL_CONFIG.model,
        contents: userPrompt,
        config: {
          ...AI_MODEL_CONFIG.config,
          systemInstruction,
          responseSchema: INTERVIEW_CHAT_RESPONSE_SCHEMA,
        },
      });

      if (!response.text) {
        throw new Error('AI không phản hồi dữ liệu hội thoại phỏng vấn.');
      }

      const parsed = JSON.parse(response.text) as {
        reply: string;
        suggestedAction: 'CONTINUE' | 'TRANSITION' | 'FINISH';
      };

      if (!parsed.reply || !parsed.suggestedAction) {
        throw new Error('Cấu trúc phản hồi chat từ AI không đúng định dạng mong muốn.');
      }

      return parsed;
    } catch (error: any) {
      console.error('Lỗi khi gọi AI chat phỏng vấn:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', { cause: error });
    }
  }
  async submitInterviewResult(input: SubmitInterviewResultInput) {
    try {
      const systemInstruction = getSubmitInterviewResultSystemPrompt(input);
      const userPrompt = getSubmitInterviewResultUserPrompt(input);

      const response = await ai.models.generateContent({
        model: AI_MODEL_CONFIG.model,
        contents: userPrompt,
        config: {
          ...AI_MODEL_CONFIG.config,
          systemInstruction,
          responseSchema: SUBMIT_INTERVIEW_RESULT_RESPONSE_SCHEMA,
        },
      });

      if (!response.text) {
        throw new Error('AI không phản hồi dữ liệu báo cáo đánh giá.');
      }

      // 3. Parse JSON từ phản hồi của AI
      const parsed = JSON.parse(response.text) as {
        generalEvaluation: {
          overall: { score: number; reason: string };
          domain: { score: number; reason: string };
          problemSolving: { score: number; reason: string };
          clarity: { score: number; reason: string };
          confidence: { score: number; reason: string };
          relevance: { score: number; reason: string };
        };
        recommendation: string;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        learningPath: string[];
        questionEvaluations: Array<{
          questionIndex: number;
          questionTitle: string;
          feedback: string;
          score: number;
        }>;
      };

      // Tùy chọn: Validate cấu trúc cơ bản
      if (!parsed.generalEvaluation || !parsed.recommendation || !Array.isArray(parsed.strengths)) {
        throw new Error('Cấu trúc phản hồi phân tích từ AI không đúng định dạng Schema quy định.');
      }

      return parsed;
    } catch (error: any) {
      console.error('Lỗi khi gọi AI submit interview result:', error);
      throw new (Error as any)('Lỗi khi kết nối với bộ não AI.', { cause: error });
    }
  }
}

export const aiService = new AiService();
