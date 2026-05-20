import { GoogleGenAI } from '@google/genai';

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
