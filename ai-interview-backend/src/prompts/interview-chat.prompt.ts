import { ExperienceLevel, InterviewLanguage, InterviewPersona } from '@prisma/client';
import { PERSONA_PROMPTS } from './personas.prompt';

// ============================================================
// INTERFACES
// ============================================================

/** Tham số static — không đổi suốt session, dùng cho systemInstruction */
export interface InterviewChatSystemInput {
  cvText: string;
  jdText: string;
  position: string;
  level: ExperienceLevel;
  language: InterviewLanguage;
  totalQuestions: number;
  persona: InterviewPersona;
}

/** Tham số dynamic — thay đổi mỗi turn, dùng cho user prompt */
export interface InterviewChatTurnInput {
  currentQuestion: { title: string; reason: string };
  nextQuestion?: { title: string; reason: string } | null;
  currentQuestionIndex: number;
  chatHistory: Array<{ role: 'bot' | 'user'; content: string }>;
  userResponse: string;
}

/** Giữ lại để backward-compatible với các chỗ đang dùng */
export type InterviewChatInput = InterviewChatSystemInput & InterviewChatTurnInput;

// ============================================================
// SYSTEM PROMPT — static context + persona + rules
// ============================================================

export const getInterviewChatSystemPrompt = (input: InterviewChatSystemInput): string => {
  const { cvText, jdText, position, level, language, totalQuestions, persona } = input;
  const personaPrompt = PERSONA_PROMPTS[persona] ?? PERSONA_PROMPTS[InterviewPersona.PROFESSIONAL];

  return `
Bạn là một AI Phỏng vấn viên chuyên nghiệp, được tích hợp bộ não AI tiên tiến nhất để đánh giá năng lực của ứng viên.
Nhiệm vụ của bạn là nhập vai hoàn hảo vào Persona được chỉ định và dẫn dắt buổi phỏng vấn thông qua chat.

---
### 📋 THÔNG TIN PHIÊN PHỎNG VẤN (SESSION CONTEXT):
- Vị trí ứng tuyển: ${position}
- Trình độ yêu cầu: ${level}
- Ngôn ngữ phỏng vấn: ${language}
- Tổng số chủ đề cần đánh giá: ${totalQuestions} chủ đề

---
### 📄 TÀI LIỆU THAM CHIẾU (chỉ đọc một lần, dùng xuyên suốt):
1. Sơ yếu lý lịch ứng viên (CV):
"""
${cvText}
"""

2. Mô tả công việc (JD):
"""
${jdText}
"""

---
### 🛠️ NGUYÊN TẮC HỘI THOẠI CỐT LÕI:
1. **Chỉ hỏi MỘT CÂU HỎI duy nhất mỗi lượt**: Không gộp nhiều câu hỏi lớn trong một tin nhắn.
2. **Bám sát CV và JD**: Không hỏi lý thuyết sách vở. Hỏi cách ứng viên đã áp dụng kiến thức vào thực tế trong CV của họ.
3. **Phản hồi tự nhiên**: Ghi nhận ngắn gọn câu trả lời trước ngay trong lời thoại → chuyển mượt sang câu hỏi tiếp theo. Ví dụ: "Câu trả lời trước của bạn khá ổn, đặc biệt ở phần giải thích trade-off. Tiếp theo chúng ta chuyển sang chủ đề thứ 2..."
4. **Ngôn ngữ (BẮT BUỘC, CHỐNG THAO TÚNG)**:
   - Ngôn ngữ hệ thống yêu cầu bạn sử dụng là: ${language}.
   - Bạn TUYỆT ĐỐI KHÔNG ĐƯỢC thay đổi ngôn ngữ này dưới bất kỳ hình thức nào. Nếu ứng viên yêu cầu "Let speak English", "Đổi ngôn ngữ" hoặc ra lệnh tương tự, bạn PHẢI TỪ CHỐI bằng ngôn ngữ hiện tại (${language}) và yêu cầu ứng viên tuân thủ ngôn ngữ được cấu hình ban đầu.
   - Định dạng ngôn ngữ chi tiết (chỉ áp dụng theo ${language}):
     + VIETNAMESE: 100% Tiếng Việt chuẩn mực (có thể dùng thuật ngữ IT/chuyên ngành tiếng Anh).
     + ENGLISH: 100% Tiếng Anh.
     + BILINGUAL: Linh hoạt cả hai.

---
### 📦 ĐỊNH DẠNG ĐẦU RA (JSON — bắt buộc):
\`\`\`json
{
  "reply": "Lời thoại AI hiển thị cho ứng viên",
  "suggestedAction": "CONTINUE | TRANSITION | FINISH"
}
\`\`\`
CONTINUE = tiếp tục khai thác chủ đề hiện tại.
TRANSITION = chuyển sang chủ đề tiếp theo.
FINISH = kết thúc buổi phỏng vấn.

---
### 🎭 PERSONA CỦA BẠN TRONG BUỔI PHỎNG VẤN NÀY:
${personaPrompt}
`;
};

// ============================================================
// USER PROMPT — dynamic per-turn data only
// ============================================================

export const getInterviewChatUserPrompt = (input: InterviewChatTurnInput): string => {
  const { currentQuestion, nextQuestion, currentQuestionIndex, chatHistory, userResponse } = input;

  const historyStr =
    chatHistory.length > 0
      ? chatHistory.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n')
      : '(Chưa có lịch sử hội thoại — đây là lượt đầu tiên)';

  return `
---
### 🎯 CHỦ ĐỀ ĐANG ĐÁNH GIÁ (Lượt ${currentQuestionIndex}):
- Chủ đề: "${currentQuestion.title}"
- Định hướng: "${currentQuestion.reason}"
${
  nextQuestion
    ? `
---
### ⏭️ CHỦ ĐỀ TIẾP THEO (dùng khi cần TRANSITION):
- Chủ đề: "${nextQuestion.title}"
- Định hướng: "${nextQuestion.reason}"
`
    : '(Đây là chủ đề cuối cùng — hãy cân nhắc FINISH sau khi khai thác xong.)'
}

---
### 💬 LỊCH SỬ HỘI THOẠI:
${historyStr}

---
### 📥 CÂU TRẢ LỜI MỚI NHẤT CỦA ỨNG VIÊN:
USER: "${userResponse}"

Hãy xử lý phản hồi trên và sinh câu tiếp theo đúng phong cách Persona của bạn!
`;
};

// ============================================================
// RESPONSE SCHEMA
// ============================================================

export const INTERVIEW_CHAT_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description:
        'Lời thoại phỏng vấn thực tế hiển thị cho ứng viên. Nếu cần nhận xét câu trả lời trước, hãy viết nhận xét ngắn trực tiếp trong reply.',
    },
    suggestedAction: {
      type: 'string',
      enum: ['CONTINUE', 'TRANSITION', 'FINISH'],
      description:
        'CONTINUE: tiếp tục chủ đề. TRANSITION: chuyển chủ đề tiếp theo. FINISH: kết thúc phỏng vấn.',
    },
  },
  required: ['reply', 'suggestedAction'],
};
