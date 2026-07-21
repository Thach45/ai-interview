import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { builderCvApi, type SaveCvPayload } from "../api/builderCv.api";

export const useBuilderCvs = () => {
  return useQuery({
    queryKey: ["builder-cvs"],
    queryFn: () => builderCvApi.getMyCvs(),
  });
};

export const useBuilderCvDetail = (id?: string) => {
  return useQuery({
    queryKey: ["builder-cv-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing builder CV ID");
      return builderCvApi.getCvById(id);
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useSaveBuilderCv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveCvPayload) => {
      if (payload.id) {
        const { id, ...rest } = payload;
        return builderCvApi.updateCv(id, rest);
      }
      return builderCvApi.saveCv(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builder-cvs"] });
      toast.success("Đã lưu CV thành công");
    },
    onError: (err: any) => {
      toast.error(err.message || "Lỗi khi lưu CV");
    },
  });
};

export const useDeleteBuilderCv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => builderCvApi.deleteCv(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builder-cvs"] });
      toast.success("Đã xoá CV");
    },
    onError: (err: any) => {
      toast.error(err.message || "Lỗi khi xoá CV");
    },
  });
};

export const useExportBuilderPdf = () => {
  return useMutation({
    mutationFn: ({ id, html }: { id: string; html?: string }) =>
      builderCvApi.exportPdf(id, html),
    onError: (err: any) => {
      toast.error(err.message || "Lỗi khi xuất PDF");
    },
  });
};
