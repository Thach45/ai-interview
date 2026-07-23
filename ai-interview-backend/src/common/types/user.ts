export type ShowUser = {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  password: string;
};

export type UserResponseDTO = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  status: string;
  creditsBalance: number;
  emailVerifiedAt?: Date | null;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
};
