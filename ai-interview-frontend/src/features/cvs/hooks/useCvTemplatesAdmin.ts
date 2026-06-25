import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cvTemplateAdminApi } from "../api/cvTemplateAdmin.api";
import type { CreateCvTemplateDto, UpdateCvTemplateDto } from "../api/cvTemplateAdmin.api";

export const useCvTemplatesAdmin = () => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading: isTemplatesLoading } = useQuery({
    queryKey: ["admin-cv-templates"],
    queryFn: cvTemplateAdminApi.getAll,
  });

  const { mutate: createTemplate, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateCvTemplateDto) => cvTemplateAdminApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cv-templates"] });
    },
  });

  const { mutate: updateTemplate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCvTemplateDto }) =>
      cvTemplateAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cv-templates"] });
    },
  });

  const { mutate: deleteTemplate, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => cvTemplateAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cv-templates"] });
    },
  });

  return {
    templates,
    isTemplatesLoading,
    createTemplate,
    isCreating,
    updateTemplate,
    isUpdating,
    deleteTemplate,
    isDeleting,
  };
};
