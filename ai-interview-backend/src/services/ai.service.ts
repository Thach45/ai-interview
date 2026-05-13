import { ai, AI_MODEL_CONFIG } from '../config/ai.config';
import {
  CV_ANALYSIS_RESPONSE_SCHEMA,
  CV_ANALYSIS_SYSTEM_PROMPT,
  getCVAnalysisUserPrompt,
} from '../prompts/cv-analysis.prompt';

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
}

export const aiService = new AiService();
