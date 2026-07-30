import {
  ExperienceLevel,
  InterviewLanguage,
  InterviewPersona,
} from '@prisma/client';

export interface GenerateQuestionsInput {
  cvText: string;
  jdText: string;
  position: string;
  companyName?: string | null;
  level: ExperienceLevel;
  language: InterviewLanguage;
  difficulty: number;
  focusSkills: string[];
  persona: InterviewPersona;
  duration: number;
}

export const CREATE_QUESTIONS_SYSTEM_PROMPT = `
Bạn là một Chuyên gia Thiết kế Đề thi Tuyển dụng Chuyên nghiệp (Professional Assessment Architect).
Nhiệm vụ của bạn là tạo ra một danh sách chủ đề/mục tiêu đánh giá phỏng vấn cốt lõi (Core Evaluation Outline) được cá nhân hóa hoàn chỉnh dựa trên hồ sơ ứng viên (CV), mô tả công việc (JD) và các tiêu chí thiết lập được cung cấp.

---
### 📐 QUY TẮC THIẾT KẾ BỘ CHỦ ĐỀ ĐÁNH GIÁ (MUST-FOLLOW RULES):
1. **Số lượng chủ đề**: Thiết kế tổng số lượng chủ đề (đã bao gồm phần giới thiệu) phù hợp với thời lượng (Duration):
   - Nếu Duration < 20 phút (Screening): Sinh ra chính xác **3 đến 4 chủ đề**.
   - Nếu Duration từ 20 đến 40 phút (Standard): Sinh ra chính xác **5 đến 6 chủ đề**.
   - Nếu Duration > 40 phút (Deep-dive): Sinh ra chính xác **6 đến 7 chủ đề**.
2. **Phân bổ chủ đề (Topic)**:
   - Chủ đề ĐẦU TIÊN (Topic 1) bắt buộc phải luôn là "Khởi động & Giới thiệu bản thân" (Ice-breaking & Self-Introduction). Yêu cầu AI đặt câu hỏi mở để ứng viên tự giới thiệu dựa trên tổng quan CV.
   - Các kỹ năng cần tập trung (Focus Skills) **phải** được hỏi trực tiếp trong ít nhất 2 chủ đề.
   - Phải có ít nhất 1 chủ đề đánh giá kỹ năng giải quyết vấn đề / tình huống hành vi (Behavioral / Scenario-based topic).
   - Các chủ đề còn lại phải khai thác chéo giữa CV và JD. Tuyệt đối KHÔNG tạo các chủ đề chỉ yêu cầu định nghĩa lý thuyết suông.
3. **Tiêu đề độc nhất**: Mỗi chủ đề phải có một tiêu đề (title) độc nhất, rõ ràng, không trùng lặp và mô tả sát khía cạnh chuyên môn cụ thể.
4. **Độ sâu tương thích với Level**:
   - *Intern / Fresher*: Tập trung vào kiến thức nền tảng, khái niệm cơ bản, thái độ học hỏi, tư duy logic và tiềm năng tiếp thu công việc mới.
   - *Junior / Middle*: Tập trung vào năng lực giải quyết công việc thực tế, xử lý các nghiệp vụ thông thường, tối ưu hóa quy trình làm việc ở mức cá nhân/nhóm và kiến thức về các công cụ/phương pháp chuyên môn.
   - *Senior / Lead*: Tập trung vào tư duy chiến lược, thiết kế quy trình/hệ thống vận hành lớn, quản trị rủi ro chuyên sâu, khả năng tối ưu hiệu quả công việc, cân bằng đánh đổi (trade-offs) giữa các giải pháp và năng lực quản lý/dẫn dắt đội ngũ.

5. **Ngôn ngữ của câu hỏi**:
   - Nếu Language là VIETNAMESE: Câu hỏi viết bằng tiếng Việt (có thể sử dụng thuật ngữ tiếng Anh kỹ thuật chuyên ngành tự nhiên).
   - Nếu Language là ENGLISH: Toàn bộ câu hỏi và tiêu đề phải viết 100% bằng tiếng Anh.
   - Nếu Language là BILINGUAL: Viết câu hỏi bằng tiếng Việt hoặc tiếng Anh một cách linh hoạt, khuyến khích viết câu hỏi rõ ràng, dễ hiểu.

6. **Lý do đánh giá (Reason)**: Với mỗi câu hỏi, cung cấp một lời giải thích ngắn gọn, súc tích (1 câu) về mục đích hoặc khía cạnh chuyên môn cụ thể đang được đánh giá (ví dụ: "Đánh giá khả năng lập kế hoạch chiến lược và phân tích thị trường..." hoặc "Đánh giá khả năng giao tiếp, giải quyết xung đột trong nhóm...").

7. **Tiêu chí đánh giá (Rubric/Criteria)**:
   - Với MỖI chủ đề/câu hỏi, bạn PHẢI sinh ra một Barem chấm điểm (criteria) gồm 3-5 tiêu chí cụ thể.
   - Mỗi tiêu chí phải có một 'id' duy nhất (ví dụ: "c1", "c2"), 'description' rõ ràng (các ý/từ khóa ứng viên cần nhắc đến), và 'points' (trọng số điểm).
   - TỔNG ĐIỂM (points) của tất cả các tiêu chí trong 1 chủ đề/câu hỏi PHẢI LUÔN BẰNG ĐÚNG 100.

8. **Định dạng dữ liệu trả về**:
   - Bạn bắt buộc phải trả về kết quả khớp chính xác với JSON Schema được yêu cầu. Không kèm theo bất kỳ văn bản giải thích nào khác ngoài chuỗi JSON sạch.

`;

export const getCreateQuestionsUserPrompt = (
  input: GenerateQuestionsInput,
): string => {
  const {
    cvText,
    jdText,
    position,
    companyName,
    level,
    language,
    difficulty,
    focusSkills,
    duration,
  } = input;

  return `
Hãy tạo bộ câu hỏi phỏng vấn dựa trên các thông tin sau:

---
### 🛠️ THÔNG TIN THIẾT LẬP PHÒNG PHỎNG VẤN:
- Vị trí ứng tuyển (Position): ${position}
- Công ty tuyển dụng (Company Name): ${companyName || 'Công ty Tuyển dụng'}
- Trình độ ứng viên (Level): ${level} (Yêu cầu độ sâu câu hỏi phải phù hợp hoàn hảo với trình độ này!)
- Ngôn ngữ phỏng vấn (Language): ${language}
- Độ khó (Difficulty): ${difficulty}/5 (1: Lý thuyết cơ bản; 3: Tình huống thực tế trung bình; 5: Giải quyết bài toán vận hành/chiến lược hóc búa, xử lý khủng hoảng hoặc tình huống thực tế phức tạp)
- Kỹ năng cần tập trung (Focus Skills): ${focusSkills.length > 0 ? focusSkills.join(', ') : 'Dựa trên JD'}
- Thời lượng phỏng vấn (Duration): ${duration} phút (Hãy thiết kế số lượng chủ đề phù hợp với thời lượng này)

---
### 📄 TÀI LIỆU ĐẦU VÀO:
1. Sơ yếu lý lịch ứng viên (CV Text):
"""
${cvText}
"""

2. Mô tả công việc (JD Text):
"""
${jdText}
"""
`;
};

export const CREATE_QUESTIONS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description:
              'Tiêu đề chủ đề lớn hoặc hạng mục đánh giá cụ thể (ví dụ: Tối ưu hóa quy trình, Kỹ năng đàm phán, Quản lý tài chính, Trải nghiệm dự án A...). Yêu cầu tiêu đề phải độc nhất, ngắn gọn, mô tả rõ khía cạnh chuyên môn và không được trùng lặp.',
          },
          reason: {
            type: 'string',
            description:
              'Lý do/Mục đích đánh giá cụ thể hoặc cách khai thác của chủ đề này (ví dụ: Đánh giá khả năng tự giới thiệu, kỹ năng cốt lõi và kinh nghiệm thực tiễn...)',
          },
          criteria: {
            type: 'array',
            description:
              'Danh sách các tiêu chí chấm điểm (Barem) cho câu hỏi này. Tổng points phải đúng bằng 100.',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID duy nhất của tiêu chí, ví dụ: c1, c2',
                },
                description: {
                  type: 'string',
                  description:
                    'Nội dung chi tiết ứng viên cần đạt được, kèm từ khóa quan trọng',
                },
                points: {
                  type: 'integer',
                  description: 'Điểm số của tiêu chí này',
                },
              },
              required: ['id', 'description', 'points'],
            },
          },
        },
        required: ['title', 'reason', 'criteria'],
      },
    },
  },
  required: ['questions'],
};
