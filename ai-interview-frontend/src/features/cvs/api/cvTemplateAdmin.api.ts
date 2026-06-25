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
    const data = await apiClient.get<any, CvTemplate[]>("/admin/cv-templates");
    return data;
  },

  getById: async (id: string): Promise<CvTemplate> => {
    const data = await apiClient.get<any, CvTemplate>(`/admin/cv-templates/${id}`);
    return data;
  },

  create: async (payload: CreateCvTemplateDto): Promise<CvTemplate> => {
    const data = await apiClient.post<any, CvTemplate>("/admin/cv-templates", payload);
    return data;
  },

  update: async (id: string, payload: UpdateCvTemplateDto): Promise<CvTemplate> => {
    const data = await apiClient.put<any, CvTemplate>(`/admin/cv-templates/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/cv-templates/${id}`);
  },
};
