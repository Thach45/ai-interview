import apiClient from "../../../shared/services/apiClient";

export interface CvTemplate {
  id: string;
  name: string;
  thumbnailUrl: string;
  htmlStructure: string;
  cssStyles: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateCvTemplateDto = Omit<CvTemplate, "id" | "createdAt" | "updatedAt">;
export type UpdateCvTemplateDto = Partial<CreateCvTemplateDto>;

export const cvTemplateAdminApi = {
  getAll: async (): Promise<CvTemplate[]> => {
    const response = await apiClient.get<any, { success: boolean; data: CvTemplate[] }>("/admin/cv-templates");
    return response.data || [];
  },

  getById: async (id: string): Promise<CvTemplate> => {
    const response = await apiClient.get<any, { success: boolean; data: CvTemplate }>(`/admin/cv-templates/${id}`);
    return response.data;
  },

  create: async (payload: CreateCvTemplateDto): Promise<CvTemplate> => {
    const response = await apiClient.post<any, { success: boolean; data: CvTemplate }>("/admin/cv-templates", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateCvTemplateDto): Promise<CvTemplate> => {
    const response = await apiClient.put<any, { success: boolean; data: CvTemplate }>(`/admin/cv-templates/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/cv-templates/${id}`);
  },
};
