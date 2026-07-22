import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cvApi } from "../api/cv.api";


export const useCvs = (options: { enabled?: boolean } = {}) => {
  const queryClient = useQueryClient();

  const isEnabled = options.enabled !== undefined ? options.enabled : true;

  /**
   * Lấy danh sách CV
   */
  const { data: cvsResponse, isLoading, refetch } = useQuery({
    queryKey: ["my-cvs"],
    queryFn: () => cvApi.getMyCvs(),
    enabled: isEnabled,
  });

  /**
   * Tải lên CV mới
   */
  const uploadMutation = useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) => cvApi.uploadCv(file, title),
    onSuccess: () => {
      toast.success("Tải CV lên thành công! 🎉");
      queryClient.invalidateQueries({ queryKey: ["my-cvs"] });
    },
    onError: (error: any) => {
      const message = error.message || "Tải lên thất bại";
      toast.error(message);
    },
  });

  /**
   * Xoá CV
   */
  const deleteMutation = useMutation({
    mutationFn: (cvId: string) => cvApi.deleteCv(cvId),
    onSuccess: () => {
      toast.success("Xoá CV thành công! 🗑️");
      queryClient.invalidateQueries({ queryKey: ["my-cvs"] });
    },
    onError: (error: any) => {
      const message = error.message || "Xoá thất bại";
      toast.error(message);
    },
  });

  return {
    cvs: cvsResponse || [],
    isLoading,
    refetch,
    uploadCv: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteCv: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

/**
 * Hook lấy thông tin một CV theo ID
 */
export const useCv = (cvId: string | null | undefined) => {
  return useQuery({
    queryKey: ["cv", cvId],
    queryFn: () => cvApi.getCvById(cvId!),
    enabled: !!cvId,
  });
};
