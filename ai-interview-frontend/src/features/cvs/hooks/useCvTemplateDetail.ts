import { useQuery } from "@tanstack/react-query";
import { cvTemplateClientApi } from "../api/cvTemplateClient.api";
import type { CvTemplate } from "../api/cvTemplateAdmin.api";

/**
 * Lấy chi tiết template CV theo ID
 * Dùng để render preview trong CV Builder
 */
export const useCvTemplateDetail = (templateId?: string) => {
  return useQuery<CvTemplate>({
    queryKey: ["cv-template-detail", templateId],
    queryFn: async () => {
      if (!templateId) throw new Error("Missing templateId");
      return cvTemplateClientApi.getById(templateId);
    },
    enabled: !!templateId,
    staleTime: Infinity, // Template hiếm khi thay đổi
    gcTime: 1000 * 60 * 60,
  });
};
