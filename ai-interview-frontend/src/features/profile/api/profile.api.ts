import apiClient from "../../../shared/services/apiClient";
import type { UpdateProfileRequest, ProfileResponse } from "../types";

export const profileApi = {
  /** Lấy thông tin profile hiện tại */
  getProfile: () =>
    apiClient.get<any, ProfileResponse>(
      "/user/me",
    ),

  /** Cập nhật profile */
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<any, ProfileResponse>(
      "/user/me",
      data,
    ),
};

export default profileApi;
