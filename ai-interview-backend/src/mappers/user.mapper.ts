import { User } from '@prisma/client';
import { UserResponseDTO } from '../types/user';

export const toUserResponseDTO = (user: User): UserResponseDTO => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
};
