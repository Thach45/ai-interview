import { z } from 'zod';

// Các từ khóa thường dùng trong Prompt Injection
const PROMPT_INJECTION_KEYWORDS = [
  'ignore all previous instructions',
  'forget instructions',
  'system prompt',
  'you are a',
  'bỏ qua các lệnh trên',
  'quên hết các',
  'bạn là một',
  'your new instruction',
  'lệnh mới của bạn',
];

export const analyzeCvWithTemplateSchema = z.object({
  body: z.object({
    cvId: z
      .string()
      .min(1, 'Vui lòng cung cấp cvId')
      .regex(/^[0-9a-fA-F]{24}$/, 'cvId không hợp lệ (phải là MongoDB ObjectId)'),
    jobTemplateId: z
      .string()
      .min(1, 'Vui lòng cung cấp jobTemplateId')
      .regex(/^[0-9a-fA-F]{24}$/, 'jobTemplateId không hợp lệ (phải là MongoDB ObjectId)'),
  }),
});

export const analyzeCvWithExternalJobSchema = z.object({
  body: z.object({
    cvId: z
      .string()
      .min(1, 'Vui lòng cung cấp cvId')
      .regex(/^[0-9a-fA-F]{24}$/, 'cvId không hợp lệ (phải là MongoDB ObjectId)'),
    externalJobDescription: z
      .string()
      .min(50, 'Mô tả công việc quá ngắn. Vui lòng nhập chi tiết hơn (ít nhất 50 ký tự).')
      .max(1000, 'Mô tả công việc quá dài. Vui lòng giới hạn dưới 1000 ký tự.')
      .refine(
        (text) => {
          const lowerText = text.toLowerCase();
          return !PROMPT_INJECTION_KEYWORDS.some((keyword) => lowerText.includes(keyword));
        },
        {
          message: 'Phát hiện nội dung không an toàn hoặc có dấu hiệu thay đổi hành vi hệ thống.',
        },
      ),
  }),
});
