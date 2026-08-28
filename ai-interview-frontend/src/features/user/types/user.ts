export type UserRole = 'ADMIN' | 'MODERATOR' | 'CANDIDATE';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  userRoles: { role: { code: UserRole } }[];
  status: UserStatus;
  avatarUrl?: string;
  creditsBalance: number;
  provider: string;
  emailVerifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getUserRoleCodes = (user: Pick<User, 'userRoles'>): UserRole[] =>
  user.userRoles.map(({ role }) => role.code);

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationData;
}
