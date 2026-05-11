import { z } from 'zod';

export const jobTemplateSchema = z.object({
  title: z.string().min(1, 'Vị trí tuyển dụng không được để trống'),
  companyName: z.string().min(1, 'Tên công ty không được để trống'),
  companyLogo: z.string().url('Logo phải là URL hợp lệ').optional().or(z.literal('')),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  employmentType: z.string().min(1, 'Hình thức làm việc không được để trống'),
  experienceLevel: z.enum(['INTERN', 'FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'MANAGER', 'DIRECTOR']),
  isRemote: z.boolean().default(false),
  categoryId: z.string().optional(),
  responsibilities: z.string().min(1, 'Trách nhiệm không được để trống'),
  requirements: z.string().min(1, 'Yêu cầu không được để trống'),
  benefits: z.string().min(1, 'Quyền lợi không được để trống'),
  aiExtractedContext: z.string().min(1, 'Tri thức AI không được để trống'),
  isHotJob: z.boolean().default(false),
});

export type JobTemplateFormData = z.infer<typeof jobTemplateSchema>;
