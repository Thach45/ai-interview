import apiClient from "../../../shared/services/apiClient";
import type { CvTemplate } from "./cvTemplateAdmin.api";

export const cvTemplateClientApi = {
  /**
   * Lấy danh sách CV Template cho Client (chỉ lấy template có isActive: true)
   */
  getAll: async (): Promise<CvTemplate[]> => {
    const response = await apiClient.get<any, { success: boolean; data: CvTemplate[] }>('/cv-builder/templates');
    return response.data;
  },

  /**
   * Lấy chi tiết 1 CV Template
   */
  getById: async (id: string): Promise<CvTemplate> => {
    const response = await apiClient.get<any, { success: boolean; data: CvTemplate }>(`/cv-builder/templates/${id}`);
    return response.data;
  },
};
