import { z } from 'zod';
import { Role, UserStatus } from '@prisma/client';

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

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email format'),
      otp: z.string().length(6, 'OTP must be 6 digits'),
      newPassword: z.string().min(6, 'Password must be at least 6 characters'),
      passwordConfirmation: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.newPassword === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});
export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name is too long')
      .optional(),
    avatarUrl: z.string().url('Invalid avatar URL').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  }),
});

export const adminCreateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    fullName: z.string().min(2, 'Full name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(Role).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    creditsBalance: z.number().min(0).optional(),
  }),
});

export const adminUpdateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    fullName: z.string().min(2, 'Full name is required').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.nativeEnum(Role).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    creditsBalance: z.number().min(0).optional(),
  }),
});
