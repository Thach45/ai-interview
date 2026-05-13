import apiClient from "../../../shared/services/apiClient";
import type { JobTemplate } from "../types/types";

export const jobTemplateApi = {
  /** Lấy danh sách job templates */
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    categoryIds?: string[];
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
    isRemote?: boolean;
    salaryRange?: string;
  }) =>
    apiClient.get<any, { success: boolean; data: { data: JobTemplate[]; meta: any } }>(
      "/job-templates",
      { params }
    ),

  /** Lấy chi tiết 1 job template */
  getById: (id: string) =>
    apiClient.get<any, { success: boolean; data: JobTemplate }>(
      `/job-templates/${id}`
    ),

  /** Tạo mới job template */
  create: (data: Partial<JobTemplate>) =>
    apiClient.post<any, { success: boolean; data: JobTemplate }>(
      "/admin/job-templates",
      data
    ),

  /** Cập nhật job template */
  update: (id: string, data: Partial<JobTemplate>) =>
    apiClient.put<any, { success: boolean; data: JobTemplate }>(
      `/admin/job-templates/${id}`,
      data
    ),

  /** Xóa job template */
  delete: (id: string) =>
    apiClient.delete<any, { success: boolean; data: { deleted: boolean; id: string } }>(
      `/admin/job-templates/${id}`
    ),
};

export default jobTemplateApi;
