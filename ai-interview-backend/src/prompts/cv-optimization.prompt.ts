import { Type, Schema } from '@google/genai';

export const CV_OPTIMIZATION_SYSTEM_PROMPT = `
Bạn là một chuyên gia Tuyển dụng (ATS Expert) và Chuyên gia Viết CV chuyên nghiệp. 
Nhiệm vụ của bạn là tối ưu hóa và viết lại CV gốc của người dùng dựa trên danh sách "Từ khóa còn thiếu" và "Đề xuất cải thiện" đã được phân tích từ trước.

## Nguyên tắc Tối ưu hóa CHUYÊN SÂU:
1. **Tuyệt đối không bịa đặt:** KHÔNG thêm các mục (section) mới nếu CV gốc không có. Ví dụ: Nếu CV gốc không có phần Kinh nghiệm làm việc, TUYỆT ĐỐI không tự tạo ra kinh nghiệm làm việc để tránh ảo giác.
2. **Áp dụng Đề xuất (Suggestions):** Bạn phải đọc kỹ các đề xuất cải thiện được cung cấp và áp dụng CHÍNH XÁC chúng vào việc viết lại nội dung CV.
3. **Thêm Từ khóa (Keywords):** Lồng ghép tự nhiên các "Từ khóa còn thiếu" vào phần Kỹ năng hoặc Mục tiêu/Kinh nghiệm.
4. **Phương pháp STAR:** Nếu có phần Kinh nghiệm (Experience) hoặc Dự án (Projects), hãy viết lại các gạch đầu dòng theo format: [Hành động] + [Ngữ cảnh] + [Kết quả], thêm các động từ mạnh.
5. **Ghi nhận lịch sử chỉnh sửa:** Trong JSON trả về, mảng \`modifications\` phải ghi lại các thay đổi quan trọng bạn vừa thực hiện (Loại thay đổi: ADD_KEYWORD, REWRITE, EXPAND).

## Định dạng Output:
Bạn phải trả về một JSON HỢP LỆ chứa đúng cấu trúc Schema được yêu cầu. Đảm bảo ngôn ngữ viết CV đồng nhất với CV gốc (thường là Tiếng Việt hoặc Tiếng Anh).
`;

export const getCVOptimizationUserPrompt = (
  cvContent: string,
  missingKeywords: string[],
  improvementSuggestions: any[],
) => {
  return `
Hãy viết lại CV của tôi để tối ưu ATS.

[CV GỐC]
${cvContent}

[TỪ KHÓA CẦN BỔ SUNG VÀO CV]
${missingKeywords.length > 0 ? missingKeywords.join(', ') : 'Không có'}

[ĐỀ XUẤT CẢI THIỆN ĐÃ PHÂN TÍCH - BẠN PHẢI ÁP DỤNG CÁC ĐỀ XUẤT NÀY]
${improvementSuggestions.map((s, i) => `${i + 1}. ${s.title}: ${s.solution}`).join('\n')}

Hãy trả về cấu trúc JSON đúng chuẩn.
  `;
};

// ==========================================
// SCHEMA ĐỊNH DẠNG RESPONSE TỪ GEMINI (JSON)
// ==========================================

export const CV_OPTIMIZATION_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    optimizedData: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        jobTitle: { type: Type.STRING },
        objective: { type: Type.STRING, nullable: true },
        contact: {
          type: Type.OBJECT,
          properties: {
            phone: { type: Type.STRING, nullable: true },
            email: { type: Type.STRING, nullable: true },
            birthday: { type: Type.STRING, nullable: true },
            address: { type: Type.STRING, nullable: true },
          },
        },
        experiences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              period: { type: Type.STRING },
              role: { type: Type.STRING },
              details: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['company', 'period', 'role', 'details'],
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              period: { type: Type.STRING },
              role: { type: Type.STRING },
              details: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['name', 'period', 'role', 'details'],
          },
        },
        hardSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        computerSkills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.STRING, nullable: true },
            },
            required: ['name'],
          },
        },
        languages: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.STRING, nullable: true },
            },
            required: ['name'],
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              period: { type: Type.STRING },
              school: { type: Type.STRING },
              degree: { type: Type.STRING, nullable: true },
              details: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['period', 'school', 'details'],
          },
        },
        certifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              issuer: { type: Type.STRING },
              year: { type: Type.STRING, nullable: true },
            },
            required: ['name', 'issuer'],
          },
        },
        activities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              period: { type: Type.STRING },
              role: { type: Type.STRING },
              details: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['name', 'period', 'role', 'details'],
          },
        },
        references: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              phone: { type: Type.STRING },
            },
            required: ['name', 'role', 'phone'],
          },
        },
      },
      required: [
        'fullName',
        'jobTitle',
        'contact',
        'experiences',
        'projects',
        'hardSkills',
        'computerSkills',
        'languages',
        'education',
        'certifications',
        'activities',
        'references',
      ],
    },
    modifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          type: { type: Type.STRING }, // ADD_KEYWORD, REWRITE, EXPAND, vv
          title: { type: Type.STRING },
          desc: { type: Type.STRING },
        },
        required: ['id', 'type', 'title', 'desc'],
      },
    },
  },
  required: ['optimizedData', 'modifications'],
};
