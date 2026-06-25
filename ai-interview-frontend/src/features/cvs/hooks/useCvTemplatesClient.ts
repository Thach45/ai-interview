import { useQuery } from "@tanstack/react-query";
import { cvTemplateAdminApi } from "../api/cvTemplateAdmin.api";

export const useCvTemplatesClient = () => {
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["client-cv-templates"],
    queryFn: async () => {
      try {
        // Tạm thời gọi API Admin để lấy danh sách mẫu (Giả định đang test bằng tài khoản Admin)
        const allTemplates = await cvTemplateAdminApi.getAll();
        return allTemplates.filter(t => t.isActive);
      } catch (error) {
        console.error("Lỗi khi fetch templates:", error);
        return [];
      }
    },
  });

  return { templates, isLoading };
};
