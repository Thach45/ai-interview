export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  createdAt: string;
  creditsBalance?: number;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  passwordConfirmation: string;
}
