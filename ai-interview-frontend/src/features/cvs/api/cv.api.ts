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
   * Lấy thông tin chi tiết một CV theo ID
   */
  getCvById: async (cvId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>(`/cv-builder/${cvId}`);
    return response.data;
  },

  /**
   * Lấy thông tin CV công khai theo ID
   */
  getPublicCvById: async (cvId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>(`/cv-builder/public/${cvId}`);
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
   * Xoá CV
   */
  deleteCv: async (cvId: string): Promise<any> => {
    const response = await apiClient.delete<any, { success: boolean; data: any }>(`/cvs/${cvId}`);
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
    const response = await apiClient.post<any, { success: boolean; data: any }>('/analysis-cv/analyze/template', {
      cvId,
      jobTemplateId: jobDescriptionId,
    });
    return response.data;
  },
  /**
   * Phân tích CV với mô tả công việc bên ngoài (Tốn Credit)
   */
  analyzeCvExternal: async (cvId: string, externalJobDescription: string): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>('/analysis-cv/analyze/external', {
      cvId,
      externalJobDescription,
    });
    return response.data;
  },

  /**
   * Lấy lịch sử phân tích CV
   */
  getAnalysisHistory: async (): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>('/analysis-cv/history');
    return response;
  },

  /**
   * Lấy chi tiết phân tích CV theo ID phân tích
   */
  getAnalysisCvById: async (analysisId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>(`/analysis-cv/${analysisId}`);
    return response;
  },

  /**
   * Tối ưu CV dựa trên bản phân tích
   */
  optimizeCv: async (payload: { analysisId: string; templateId?: string }): Promise<any> => {
    const response = await apiClient.post<any, { success: boolean; data: any }>('/analysis-cv/optimize', {
      analysisId: payload.analysisId,
      templateId: payload.templateId,
    });
    return response.data;
  },

  /**
   * Lấy dữ liệu CV đã được tối ưu
   */
  getOptimizedCv: async (analysisId: string): Promise<any> => {
    const response = await apiClient.get<any, { success: boolean; data: any }>(`/analysis-cv/optimized/${analysisId}`);
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
