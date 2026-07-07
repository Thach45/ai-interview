import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cvApi } from '../api/cv.api';
import { toast } from 'sonner';

export const useCvAnalysis = (cvId?: string, jobId?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Chỉ GET dữ liệu, KHÔNG trừ tiền
  const analyzeQuery = useQuery({
    queryKey: ['analyze-cv', cvId, jobId],
    queryFn: () => cvApi.getAnalysisCv(cvId!, jobId!),
    enabled: !!cvId && !!jobId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  // Chủ động gọi POST để bắt đầu phân tích (Tốn Credit)
  const analyzeMutation = useMutation({
    mutationFn: () => cvApi.analyzeCv(cvId!, jobId!),
    onSuccess: (data) => {
      // 1. Cập nhật lại số credit trên Header
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // 2. Cập nhật kết quả vào cache để UI render ra ngay
      queryClient.setQueryData(['analyze-cv', cvId, jobId], data);
      toast.success('Phân tích CV hoàn tất!');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại sau.');
    }
  });

  const optimizeMutation = useMutation({
    mutationFn: (analysisId: string) => cvApi.optimizeCv(analysisId),
    onSuccess: () => {
      // Cập nhật lại số lượng credit ngay lập tức (Trigger React Query của Header cập nhật)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      if (analyzeQuery.data?.id) {
        navigate(`/jobs/cv-analysis/${jobId}/optimize?cvId=${cvId}&analysisId=${analyzeQuery.data.id}`);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Có lỗi xảy ra khi tối ưu CV. Vui lòng thử lại sau.');
    }
  });

  return {
    analysisResponse: analyzeQuery.data,
    isLoadingAnalysis: analyzeQuery.isLoading,
    analysisError: analyzeQuery.error,
    
    // Thêm các hàm cho việc phân tích
    triggerAnalysis: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending,

    optimizeCv: optimizeMutation.mutate,
    isOptimizing: optimizeMutation.isPending,
  };
};
