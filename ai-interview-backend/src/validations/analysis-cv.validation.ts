import { z } from 'zod';

export const analyzeCvSchema = z.object({
  body: z.object({
    cvId: z
      .string()
      .min(1, 'Vui lòng cung cấp cvId')
      .regex(/^[0-9a-fA-F]{24}$/, 'cvId không hợp lệ (phải là MongoDB ObjectId)'),
    jobDescriptionId: z
      .string()
      .min(1, 'Vui lòng cung cấp jobDescriptionId')
      .regex(/^[0-9a-fA-F]{24}$/, 'jobDescriptionId không hợp lệ (phải là MongoDB ObjectId)'),
  }),
});
