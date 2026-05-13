import apiClient from '../../../shared/services/apiClient';
import type { UserCv } from '../type/cy.type';



export const cvApi = {
  /**
   * Lấy danh sách CV của tôi
   */
  getMyCvs: async (): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>('/cvs/my-cvs');
    return response.data;
  },

  /**
   * Upload CV mới
   */
  uploadCv: async (file: File, title: string): Promise<UserCv> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const response = await apiClient.post('/cvs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Phân tích CV với Job Template
   */
  analyzeCv: async (cvId: string, jobDescriptionId: string): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>('/analysis-cv/analyze', {
      cvId,
      jobDescriptionId,
    });
    return response.data;
  },
};
