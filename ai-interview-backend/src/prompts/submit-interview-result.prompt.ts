import { Type, Schema } from '@google/genai';
import { PERSONA_PROMPTS } from './personas.prompt';
import { InterviewPersona } from '@prisma/client';

export interface SubmitInterviewResultInput {
  cvText: string;
  jdText: string;
  position: string;
  level: string;
  language: string;
  persona: string;
  coreQuestions: Array<{ title: string; reason: string }>;
  chatHistory: Array<{ role: 'user' | 'bot'; content: string }>;
}

export const getSubmitInterviewResultSystemPrompt = (input: SubmitInterviewResultInput): string => {
  return `Bạn là một chuyên gia tuyển dụng nhân sự (HR) cấp cao có nhiệm vụ đánh giá năng lực ứng viên. Nhiệm vụ của bạn là phân tích toàn bộ lịch sử cuộc phỏng vấn dựa trên CV, Job Description (JD), và danh sách câu hỏi cốt lõi để đưa ra báo cáo đánh giá cuối cùng chuyên sâu và chính xác.
  
Hãy trả về một JSON Object bám sát Schema quy định, gồm các đánh giá điểm số sau (0-100 điểm):
1. overall: Điểm tổng quát
2. domain: Điểm kiến thức chuyên môn / nghiệp vụ 
3. problemSolving: Điểm tư duy logic & giải quyết vấn đề
4. clarity: Điểm kỹ năng giao tiếp, trình bày rõ ràng, mạch lạc
5. confidence: Điểm tự tin, phong thái trả lời
6. relevance: Điểm bám sát trọng tâm câu hỏi, không lan man

Với mỗi tiêu chí điểm, bạn phải cung cấp 'reason' (lý do phân tích chi tiết vì sao lại cho mức điểm này dựa trên cách ứng viên đã trả lời).

Ngoài ra bạn cần đưa ra:
- strengths: Các điểm mạnh nổi bật.
- weaknesses: Các điểm yếu hoặc kiến thức hổng.
- learningPath: Lời khuyên cụ thể, lộ trình cải thiện tiếp theo.
- recommendation: Chỉ được chọn 1 trong 3 giá trị: "PASS", "FAIL", "CONSIDER".
- summary: Tóm tắt đánh giá ngắn gọn trong 1-2 câu.
- questionEvaluations: Đánh giá điểm (0-100) và feedback chi tiết cho TỪNG câu hỏi trong danh sách câu hỏi cốt lõi đã hỏi. (Lưu ý: questionIndex bắt đầu từ 0).`;
};

export const getSubmitInterviewResultUserPrompt = (input: SubmitInterviewResultInput): string => {
  return `
--- THÔNG TIN ỨNG VIÊN VÀ VỊ TRÍ ---
- Vị trí ứng tuyển: ${input.position}
- Cấp độ: ${input.level}
- Ngôn ngữ phỏng vấn: ${input.language}

--- CV ỨNG VIÊN ---
${input.cvText || 'Không có CV cụ thể'}

--- JOB DESCRIPTION (JD) ---
${input.jdText || 'Không có JD cụ thể'}

--- DANH SÁCH CÂU HỎI CỐT LÕI ---
${JSON.stringify(input.coreQuestions, null, 2)}

--- LỊCH SỬ HỘI THOẠI PHỎNG VẤN ---
${input.chatHistory.map((msg) => `[${msg.role === 'user' ? 'ỨNG VIÊN' : 'AI'}]: ${msg.content}`).join('\n\n')}

Dựa vào lịch sử hội thoại trên, hãy phân tích toàn diện và sinh ra Báo Cáo Kết Quả Phỏng Vấn chi tiết.
`;
};

export const SUBMIT_INTERVIEW_RESULT_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    generalEvaluation: {
      type: Type.OBJECT,
      properties: {
        overall: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, reason: { type: Type.STRING } },
          required: ['score', 'reason'],
        },
        domain: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, reason: { type: Type.STRING } },
          required: ['score', 'reason'],
        },
        problemSolving: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, reason: { type: Type.STRING } },
          required: ['score', 'reason'],
        },
        clarity: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, reason: { type: Type.STRING } },
          required: ['score', 'reason'],
        },
        confidence: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, reason: { type: Type.STRING } },
          required: ['score', 'reason'],
        },
        relevance: {
          type: Type.OBJECT,
          properties: { score: { type: Type.INTEGER }, reason: { type: Type.STRING } },
          required: ['score', 'reason'],
        },
      },
      required: ['overall', 'domain', 'problemSolving', 'clarity', 'confidence', 'relevance'],
    },
    recommendation: {
      type: Type.STRING,
      enum: ['PASS', 'FAIL', 'CONSIDER'],
      description: 'Quyết định đánh giá: PASS, FAIL, hoặc CONSIDER',
    },
    summary: {
      type: Type.STRING,
      description: 'Nhận xét tổng quan 2-4 câu.',
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Danh sách các điểm mạnh',
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Danh sách các điểm yếu',
    },
    learningPath: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Lộ trình học tập hoặc lời khuyên cải thiện',
    },
    questionEvaluations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionIndex: { type: Type.INTEGER },
          questionTitle: { type: Type.STRING },
          feedback: { type: Type.STRING },
          score: { type: Type.INTEGER },
        },
        required: ['questionIndex', 'questionTitle', 'feedback', 'score'],
      },
    },
  },
  required: [
    'generalEvaluation',
    'recommendation',
    'summary',
    'strengths',
    'weaknesses',
    'learningPath',
    'questionEvaluations',
  ],
};
