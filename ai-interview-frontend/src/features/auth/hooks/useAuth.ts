import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authApi from "../api/auth.api";
import { useAuthStore } from "../../../store/authStore";
import type { LoginRequest, RegisterRequest, SendOtpRequest, VerifyOtpRequest } from "../types";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);

  /**
   * Hook Đăng nhập
   */
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      console.log(accessToken)
      
      // Xóa sạch cache cũ để đảm bảo dữ liệu mới hoàn toàn
      queryClient.clear();
      
      setAuth(user, accessToken);
      toast.success("Chào mừng bạn trở lại! 👋");
      navigate("/");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(message);
    },
  });

  /**
   * Hook Đăng ký
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (_, variables) => {
      queryClient.clear();
      toast.success("Đăng ký tài khoản thành công! 🎉");
      navigate(`/verify-otp?email=${variables.email}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(message);
    },
  });

  /**
   * Hook Gửi OTP
   */
  const sendOtpMutation = useMutation({
    mutationFn: (data: SendOtpRequest) => authApi.sendOtp(data),
    onSuccess: () => {
      toast.success("Mã OTP đã được gửi về email của bạn! 📧");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể gửi mã OTP";
      toast.error(message);
    },
  });

  /**
   * Hook Xác thực OTP
   */
  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpRequest) => authApi.verifyOtp(data),
    onSuccess: () => {
      toast.success("Xác thực OTP thành công! ✅");
      queryClient.clear();
      navigate("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Mã OTP không chính xác";
      toast.error(message);
    },
  });

  /**
   * Hook Gửi lại OTP
   */
  const resendOtpMutation = useMutation({
    mutationFn: (data: { email: string }) => authApi.resendOtp(data),
    onSuccess: () => {
      toast.success("Mã OTP mới đã được gửi! 📧");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể gửi lại mã OTP";
      toast.error(message);
    },
  });

  const logout = () => {
    // Xóa sạch cache của React Query khi logout
    queryClient.clear();
    
    logoutStore();
    toast.info("Hẹn gặp lại bạn sớm! 👋");
    navigate("/login");
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    sendOtp: sendOtpMutation.mutate,
    isSendingOtp: sendOtpMutation.isPending,
    sendOtpSuccess: sendOtpMutation.isSuccess,

    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
    verifyOtpSuccess: verifyOtpMutation.isSuccess,

    resendOtp: (email: string) => resendOtpMutation.mutate({ email }),
    isResendingOtp: resendOtpMutation.isPending,
    resendOtpSuccess: resendOtpMutation.isSuccess,

    logout,
  };
};
