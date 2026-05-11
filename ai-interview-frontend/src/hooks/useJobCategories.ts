import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobCategoryApi } from '../api/jobCategory.api';
import { toast } from 'sonner';

export const useJobCategories = () => {
  const queryClient = useQueryClient();

  // Query lấy cây danh mục
  const treeQuery = useQuery({
    queryKey: ['job-categories', 'tree'],
    queryFn: () => jobCategoryApi.getTree(),
  });

  // Query lấy danh sách phẳng (có thể dùng cho table hoặc filter)
  const useFlatCategories = (params: { type?: string; page?: number; limit?: number }) => {
    return useQuery({
      queryKey: ['job-categories', 'flat', params],
      queryFn: () => jobCategoryApi.getFlat(params),
    });
  };

  // Mutation tạo mới
  const createMutation = useMutation({
    mutationFn: jobCategoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-categories'] });
      toast.success('Tạo danh mục thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục');
    },
  });

  // Mutation cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) => 
      jobCategoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-categories'] });
      toast.success('Cập nhật thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    },
  });

  // Mutation xóa
  const deleteMutation = useMutation({
    mutationFn: jobCategoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-categories'] });
      toast.success('Xóa danh mục thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể xóa danh mục này');
    },
  });

  return {
    // Data
    categoriesTree: treeQuery.data?.data || [],
    isTreeLoading: treeQuery.isLoading,
    
    // Custom flat hook
    useFlatCategories,

    // Actions
    createCategory: createMutation.mutate,
    isCreating: createMutation.isPending,
    
    updateCategory: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteCategory: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
