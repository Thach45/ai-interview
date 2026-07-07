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
   * Lấy kết quả phân tích CV đã có
   */
  getAnalysisCv: async (cvId: string, jobDescriptionId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>('/analysis-cv/result', {
      params: {
        cvId,
        jobTemplateId: jobDescriptionId,
      }
    });
    return response.data;
  },

  /**
   * Phân tích CV với Job Template (Tốn Credit)
   */
  analyzeCv: async (cvId: string, jobDescriptionId: string): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>('/analysis-cv/analyze', {
      cvId,
      jobDescriptionId,
    });
    return response.data;
  },

  /**
   * Tối ưu CV dựa trên bản phân tích
   */
  optimizeCv: async (analysisId: string): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>('/analysis-cv/optimize', {
      analysisId,
    });
    return response.data;
  },

  /**
   * Xuất PDF CV
   */
  exportPdf: async (analysisId: string, html: string): Promise<Blob> => {
    const data = await apiClient.post<any, Blob>('/analysis-cv/export-pdf', {
      analysisId,
      html
    }, {
      responseType: 'blob'
    });
    return data;
  },
};
