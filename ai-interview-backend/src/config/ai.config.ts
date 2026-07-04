import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
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

export const deepSeek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const generateDeepSeekContent = async (
  systemInstruction: string,
  userPrompt: string,
  schema?: any,
) => {
  const finalSystemInstruction = schema
    ? `${systemInstruction}\n\nĐỊNH DẠNG ĐẦU RA BẮT BUỘC (JSON):\n${JSON.stringify(schema)}`
    : systemInstruction;

  const response = await deepSeek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: finalSystemInstruction },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  let responseText = response.choices[0]?.message?.content || '';
  return responseText
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
};

export const generateDeepSeekProContent = async (
  systemInstruction: string,
  userPrompt: string,
  schema?: any,
) => {
  const finalSystemInstruction = schema
    ? `${systemInstruction}\n\nĐỊNH DẠNG ĐẦU RA BẮT BUỘC (JSON):\n${JSON.stringify(schema)}`
    : systemInstruction;

  const response = await deepSeek.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: finalSystemInstruction },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  let responseText = response.choices[0]?.message?.content || '';
  return responseText
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
};

export const generateDeepSeekStream = async (
  systemInstruction: string,
  userPrompt: string,
  schema?: any,
) => {
  const finalSystemInstruction = schema
    ? `${systemInstruction}\n\nĐỊNH DẠNG ĐẦU RA BẮT BUỘC (JSON):\n${JSON.stringify(schema)}`
    : systemInstruction;

  return await deepSeek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: finalSystemInstruction },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    stream: true,
  });
};
