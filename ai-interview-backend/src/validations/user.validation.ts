import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email format'),
      fullName: z.string().min(2, 'Full name is required'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      passwordConfirmation: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required').max(100, 'Full name is too long').optional(),
    avatarUrl: z.string().url('Invalid avatar URL').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  }),
});
