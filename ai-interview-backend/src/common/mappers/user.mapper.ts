import { User } from '@prisma/client';
import { UserResponseDTO } from '../types/user';

type UserWithRoles = User & { userRoles: { role: { code: string } }[] };

export const toUserResponseDTO = (user: UserWithRoles): UserResponseDTO => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roles: user.userRoles.map(({ role }) => role.code),
    avatarUrl: user.avatarUrl,
    status: user.status,
    creditsBalance: user.creditsBalance,
    emailVerifiedAt: user.emailVerifiedAt,
    provider: user.provider,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
