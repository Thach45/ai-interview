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
