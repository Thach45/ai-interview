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
  coreQuestions: Array<{ title: string; reason: string; criteria?: any[] }>;
  chatHistory: Array<{ role: 'user' | 'bot'; content: string }>;
}

export const getSubmitInterviewResultSystemPrompt = (input: SubmitInterviewResultInput): string => {
  return `Bạn là một chuyên gia tuyển dụng nhân sự (HR) cấp cao có nhiệm vụ đánh giá năng lực ứng viên. Nhiệm vụ của bạn là phân tích toàn bộ lịch sử cuộc phỏng vấn dựa trên CV, Job Description (JD), và danh sách câu hỏi cốt lõi để đưa ra báo cáo đánh giá cuối cùng chuyên sâu và chính xác.
  
  Hãy trả về một JSON Object bám sát Schema quy định. Phân tách rõ ràng giữa Kỹ năng mềm và Đánh giá kỹ thuật (dựa trên Tiêu chí - Rubric).
  
  1. Đánh giá Kỹ năng mềm (Soft Skills - Thang 0-100):
  - problemSolving: Tư duy logic & giải quyết vấn đề.
  - clarity: Kỹ năng giao tiếp, trình bày rõ ràng.
  - confidence: Tự tin, phong thái trả lời.
  - relevance: Bám sát trọng tâm câu hỏi.

Với mỗi tiêu chí điểm, bạn phải cung cấp 'reason' (lý do phân tích chi tiết vì sao lại cho mức điểm này dựa trên cách ứng viên đã trả lời).

Ngoài ra bạn cần đưa ra:
- strengths: Các điểm mạnh nổi bật.
- weaknesses: Các điểm yếu hoặc kiến thức hổng.
- learningPath: Lời khuyên cụ thể, lộ trình cải thiện tiếp theo.
- recommendation: Chỉ được chọn 1 trong 3 giá trị: "PASS", "FAIL", "CONSIDER".
- summary: Tóm tắt đánh giá ngắn gọn trong 1-2 câu.
- questionEvaluations: Đánh giá chi tiết cho TỪNG câu hỏi. Thay vì tự chấm điểm, bạn BẮT BUỘC phải đối chiếu câu trả lời của ứng viên với danh sách "Tiêu chí chấm điểm (criteria)" của câu hỏi đó. 
Trích xuất ra 'criteriaMatches', với mỗi tiêu chí hãy chọn 'partialCredit' (0: Không đạt, 0.5: Đạt một phần, 1: Đạt hoàn toàn) và 'evidence' (bằng chứng từ câu trả lời).`;
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
    softSkillsEvaluation: {
      type: Type.OBJECT,
      properties: {
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
      required: ['problemSolving', 'clarity', 'confidence', 'relevance'],
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
          criteriaMatches: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                criterionId: { type: Type.STRING },
                partialCredit: { type: Type.NUMBER, description: 'Chỉ được chọn: 0, 0.5, hoặc 1' },
                evidence: { type: Type.STRING },
              },
              required: ['criterionId', 'partialCredit', 'evidence'],
            },
          },
        },
        required: ['questionIndex', 'questionTitle', 'feedback', 'criteriaMatches'],
      },
    },
  },
  required: [
    'softSkillsEvaluation',
    'recommendation',
    'summary',
    'strengths',
    'weaknesses',
    'learningPath',
    'questionEvaluations',
  ],
};
