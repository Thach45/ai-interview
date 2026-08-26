import apiClient from "../../../shared/services/apiClient";
import type { CvTemplate } from "./cvTemplateAdmin.api";
import type { BuilderCv, CvFormData } from "../type/builder-cv.type";

export interface SaveCvPayload {
  id?: string;
  templateId: string;
  title: string;
  cvData: CvFormData;
  renderedHtml: string;
}

export const builderCvApi = {
  /** Lấy danh sách CV Builder của user */
  getMyCvs: async (): Promise<BuilderCv[]> => {
    const res = await apiClient.get<
      any,
      { success: boolean; data: BuilderCv[] }
    >("/cv-builder");
    return res.data;
  },

  /** Lấy chi tiết CV Builder (kèm template HTML) */
  getCvById: async (
    id: string,
  ): Promise<BuilderCv & { template: CvTemplate }> => {
    const res = await apiClient.get<
      any,
      { success: boolean; data: BuilderCv & { template: CvTemplate } }
    >(`/cv-builder/${id}`);
    return res.data;
  },

  /** Lưu CV Builder mới */
  saveCv: async (payload: SaveCvPayload): Promise<BuilderCv> => {
    const res = await apiClient.post<
      any,
      { success: boolean; data: BuilderCv }
    >("/cv-builder", payload);
    return res.data;
  },

  /** Cập nhật CV Builder */
  updateCv: async (
    id: string,
    payload: Omit<SaveCvPayload, "id">,
  ): Promise<BuilderCv> => {
    const res = await apiClient.put<any, { success: boolean; data: BuilderCv }>(
      `/cv-builder/${id}`,
      payload,
    );
    return res.data;
  },

  /** Xoá CV Builder */
  deleteCv: async (id: string): Promise<void> => {
    await apiClient.delete(`/cv-builder/${id}`);
  },

  /** Export PDF */
  exportPdf: async (id: string, html?: string): Promise<Blob> => {
    const res = await apiClient.post<any, Blob>(
      `/cv-builder/${id}/export-pdf`,
      { html },
      { responseType: "blob" } as any,
    );
    return res;
  },
};
