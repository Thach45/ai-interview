import { z } from 'zod';
import { ExperienceLevel, InterviewMode, InterviewLanguage } from '@prisma/client';
import { InterviewPersona } from '../types/interview-ai.type';

export const interviewAISchema = z.object({
  body: z
    .object({
      cvId: z
        .string()
        .min(1, 'Vui lòng cung cấp cvId')
        .regex(/^[0-9a-fA-F]{24}$/, 'cvId không hợp lệ (phải là MongoDB ObjectId)'),

      // Cho phép chọn Job Template có sẵn HOẶC tự nhập JD tùy chọn
      jobDescriptionId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'jobDescriptionId không hợp lệ')
        .optional()
        .nullable(),

      customJdText: z.string().optional().nullable(),

      position: z.string().min(1, 'Vui lòng chọn vị trí phỏng vấn'),

      // Tên công ty là tùy chọn (Tương thích với "Tùy chọn" trên UI)
      nameCompany: z.string().optional().nullable(),

      // Preprocess giúp tự động chuyển từ 'Junior' / 'Junior' / 'junior' của Frontend thành 'JUNIOR' trong Prisma
      level: z.preprocess(
        (val) => (typeof val === 'string' ? val.toUpperCase() : val),
        z.nativeEnum(ExperienceLevel),
      ),

      language: z.preprocess(
        (val) => (typeof val === 'string' ? val.toUpperCase() : val),
        z.nativeEnum(InterviewLanguage),
      ),

      mode: z.preprocess(
        (val) => (typeof val === 'string' ? val.toUpperCase() : val),
        z.nativeEnum(InterviewMode),
      ),

      duration: z
        .number()
        .min(5, 'Thời lượng tối thiểu là 5 phút')
        .max(120, 'Thời lượng tối đa là 120 phút'),

      difficulty: z.number().min(1, 'Độ khó tối thiểu là 1').max(5, 'Độ khó tối đa là 5'),

      persona: z.nativeEnum(InterviewPersona, {
        message: 'Nhân vật phỏng vấn không hợp lệ',
      }),
      // Cho phép mảng kỹ năng trống nếu ứng viên không điền (Tương thích UI)
      focusSkills: z.array(z.string()).default([]),
    })
    .refine((data) => data.jobDescriptionId || data.customJdText, {
      message: 'Vui lòng cung cấp jobDescriptionId hoặc customJdText',
      path: ['jobDescriptionId'],
    }),
});
