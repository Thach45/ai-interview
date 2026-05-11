import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import jobTemplateApi from "../api/jobTemplate.api";
import type { JobTemplate } from "../types/types";

export const useJobTemplates = (
  params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    categoryIds?: string[];
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
    isRemote?: boolean;
    salaryRange?: string;
  },
  options: { enabled?: boolean } = {}
) => {
  const queryClient = useQueryClient();

  // Mặc định disable query nếu không truyền params (thường là khi chỉ cần mutation)
  const isEnabled = options.enabled !== undefined ? options.enabled : !!params;

  /**
   * Lấy danh sách job templates
   */
  const { data: templatesResponse, isLoading, refetch } = useQuery({
    queryKey: ["job-templates", params],
    queryFn: () => jobTemplateApi.getAll(params),
    enabled: isEnabled,
  });

  /**
   * Tạo mới job template
   */
  const createMutation = useMutation({
    mutationFn: (data: Partial<JobTemplate>) => jobTemplateApi.create(data),
    onSuccess: () => {
      toast.success("Tạo mẫu JD thành công! 🎉");
      queryClient.invalidateQueries({ queryKey: ["job-templates"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Tạo thất bại";
      toast.error(message);
    },
  });

  /**
   * Cập nhật job template
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobTemplate> }) => 
      jobTemplateApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật mẫu JD thành công! 🎉");
      queryClient.invalidateQueries({ queryKey: ["job-templates"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Cập nhật thất bại";
      toast.error(message);
    },
  });

  /**
   * Xóa job template
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobTemplateApi.delete(id),
    onSuccess: () => {
      toast.success("Xóa mẫu JD thành công!");
      queryClient.invalidateQueries({ queryKey: ["job-templates"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Xóa thất bại";
      toast.error(message);
    },
  });

  return {
    templates: templatesResponse?.data?.data || [],
    meta: templatesResponse?.data?.meta,
    isLoading,
    refetch,
    createTemplate: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTemplate: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTemplate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
