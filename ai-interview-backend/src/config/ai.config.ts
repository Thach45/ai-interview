import { GoogleGenAI } from '@google/genai';

/**
 * Cấu hình tập trung cho Google GenAI SDK mới.
 * Tuân thủ tài liệu hướng dẫn mới nhất của Google.
 */
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const AI_MODEL_CONFIG = {
  model: 'gemini-2.5-flash',
  config: {
    responseMimeType: 'application/json',
    temperature: 0.2,
  },
};
