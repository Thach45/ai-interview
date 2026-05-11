import type { User } from "../../auth/types";

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string | null;
  phone?: string;
  dob?: string;
  bio?: string;
  password?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}
