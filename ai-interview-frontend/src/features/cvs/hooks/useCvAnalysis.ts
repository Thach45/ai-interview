import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cvApi } from "../api/cv.api";
import { toast } from "sonner";
import { useBackgroundJobStore } from "../../../store/backgroundJobStore";

export const useCvAnalysis = (cvId?: string, jobId?: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Chỉ GET dữ liệu, KHÔNG trừ tiền
  const analyzeQuery = useQuery({
    queryKey: ["analyze-cv", cvId, jobId],
    queryFn: () => cvApi.getAnalysisCv(cvId!, jobId!),
    enabled: !!cvId && !!jobId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  // Chủ động gọi POST để bắt đầu phân tích (Tốn Credit)
  const analyzeMutation = useMutation({
    mutationFn: (args?: { cvId: string; jobId: string }) =>
      cvApi.analyzeCv(args?.cvId || cvId!, args?.jobId || jobId!),
    onSuccess: (data) => {
      // 1. Thêm job vào UI chạy ngầm thay vì chờ kết quả
      const addJob = useBackgroundJobStore.getState().addJob;
      addJob({
        id: data?.jobId || "cv-analysis-" + Date.now(),
        title: "Phân tích CV đang chạy...",
        status: "processing",
      });

      toast.info("Đã đưa yêu cầu phân tích đến hệ thống!");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  const optimizeMutation = useMutation({
    mutationFn: (analysisId: string) => cvApi.optimizeCv({ analysisId }),
    onSuccess: () => {
      // Cập nhật lại số lượng credit ngay lập tức (Trigger React Query của Header cập nhật)
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (analyzeQuery.data?.id) {
        router.push(
          `/jobs/cv-analysis/${jobId}/optimize?cvId=${cvId}&analysisId=${analyzeQuery.data.id}`,
        );
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("Lỗi khi tối ưu CV: " + (err as any).message);
    },
  });

  return {
    analysisData: analyzeQuery.data,
    isLoading: analyzeQuery.isFetching,
    error: analyzeQuery.error,
    isAnalyzing: analyzeMutation.isPending,
    isOptimizing: optimizeMutation.isPending,
    analyzeCv: analyzeMutation.mutate,
    optimizeCv: optimizeMutation.mutate,
    optimizedCvData: optimizeMutation.data,
  };
};

export const useCvAnalysisHistory = () => {
  return useQuery({
    queryKey: ["cv-analysis-history"],
    queryFn: () => cvApi.getAnalysisHistory(),
    refetchOnWindowFocus: false,
  });
};

export const useCvAnalysisById = (analysisId?: string) => {
  return useQuery({
    queryKey: ["cv-analysis-by-id", analysisId],
    queryFn: () => cvApi.getAnalysisCvById(analysisId!),
    enabled: !!analysisId,
    refetchOnWindowFocus: false,
  });
};

export const useOptimizedCv = (analysisId?: string) => {
  return useQuery({
    queryKey: ["optimized-cv", analysisId],
    queryFn: () => cvApi.getOptimizedCv(analysisId!),
    enabled: !!analysisId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
};

export const useOptimizeCv = () => {
  const optimizeMutation = useMutation({
    mutationFn: (payload: { analysisId: string; templateId?: string }) =>
      cvApi.optimizeCv(payload),
    onSuccess: (data) => {
      // Thêm job vào UI chạy ngầm
      const addJob = useBackgroundJobStore.getState().addJob;
      addJob({
        id: data?.jobId || "cv-optimization-" + Date.now(),
        title: "Đang tối ưu hóa CV...",
        status: "processing",
      });

      toast.info("Đã đưa yêu cầu tối ưu CV đến hệ thống AI!");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });
  return {
    optimizeCv: optimizeMutation.mutate,
    isOptimizing: optimizeMutation.isPending,
  };
};

export const useAnalyzeCvExternal = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const analyzeExternalMutation = useMutation({
    mutationFn: (payload: { cvId: string; jobDescription: string }) =>
      cvApi.analyzeCvExternal(payload.cvId, payload.jobDescription),
    onSuccess: (response) => {
      const analysisId =
        response?.data?.id || response?.id || `job_${Date.now()}`;

      // Thêm job chạy ngầm
      const addJob = useBackgroundJobStore.getState().addJob;
      addJob({
        id: analysisId,
        title: "Đánh giá mức độ phù hợp của CV",
        status: "processing",
      });

      toast.info("Đã đưa yêu cầu phân tích đến hệ thống!");

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["cv-analysis-history"] });
    },
    onError: (err: any) => {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra, vui lòng thử lại.";
      toast.error(message);
    },
  });

  return {
    analyzeCvExternal: analyzeExternalMutation.mutateAsync,
    isSubmitting: analyzeExternalMutation.isPending,
  };
};
