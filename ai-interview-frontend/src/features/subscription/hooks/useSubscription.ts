import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import subscriptionApi from "../api/subscription.api";

export const useSubscription = () => {
  /**
   * Lấy danh sách các gói dịch vụ
   */
  const { data: packagesResponse, isLoading } = useQuery({
    queryKey: ["subscription-packages"],
    queryFn: () => subscriptionApi.getPackages(),
  });

  /**
   * Tạo yêu cầu mua gói
   */
  const purchaseMutation = useMutation({
    mutationFn: (packageId: string) => subscriptionApi.purchase(packageId),
    onError: (error: any) => {
      const message = error.response?.data?.message || "Yêu cầu thanh toán thất bại";
      toast.error(message);
    },
  });

  return {
    packages: packagesResponse?.data || [],
    isLoading,
    purchase: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    paymentInfo: purchaseMutation.data?.data || null,
    resetPurchase: purchaseMutation.reset,
  };
};
