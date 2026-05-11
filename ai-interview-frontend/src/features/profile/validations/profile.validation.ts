import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email().optional(), // Display only, or maybe ignored on submit
  avatarUrl: z.string().url('Đường dẫn ảnh không hợp lệ').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  bio: z.string().max(1000, 'Giới thiệu tối đa 1000 ký tự').optional().or(z.literal('')),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
