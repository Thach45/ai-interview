import apiClient from "../../../shared/services/apiClient";

export interface JobCategory {
  id: string;
  name: string;
  type: "GROUP" | "INDUSTRY" | "POSITION";
  parentId?: string;
  parent?: JobCategory;
  children?: JobCategory[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const jobCategoryApi = {
  /**
   * Lấy cây danh mục 3 tầng
   */
  getTree: () => apiClient.get<JobCategory[]>("/admin/categories"),

  /**
   * Lấy danh sách phẳng (có phân trang)
   */
  getFlat: (params: { type?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<JobCategory>>("/admin/categories/flat", {
      params,
    }),

  /**
   * Tạo mới danh mục
   */
  create: (data: { name: string; type: string; parentId?: string }) =>
    apiClient.post<JobCategory>("/admin/categories", data),

  /**
   * Cập nhật danh mục
   */
  update: (id: string, data: { name: string }) =>
    apiClient.put<JobCategory>(`/admin/categories/${id}`, data),

  /**
   * Xóa danh mục
   */
  delete: (id: string) => apiClient.delete(`/admin/categories/${id}`),
};
