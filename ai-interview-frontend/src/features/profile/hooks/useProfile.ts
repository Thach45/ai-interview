import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import profileApi from "../api/profile.api";
import type { UpdateProfileRequest } from "../types";
import { useAuthStore } from "../../../store/authStore";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { user: authUser, setAuth, token } = useAuthStore();

  /**
   * Lấy thông tin profile
   */
  const { data: profileResponse, isLoading: isFetchingProfile, refetch: refreshUser } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  const user = profileResponse?.data || authUser;

  /**
   * Cập nhật profile
   */
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (response) => {
      const updatedUser = response.data;
      toast.success("Cập nhật thông tin thành công! 🎉");
      
      // Cập nhật auth store để đồng bộ (nếu authStore lưu trữ thông tin user hiện tại)
      if (token && updatedUser) {
        setAuth(updatedUser, token);
      }
      
      // Refresh lại query cache
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Cập nhật thất bại";
      toast.error(message);
    },
  });

  return {
    user,
    isLoading: isFetchingProfile,
    refreshUser,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
};
