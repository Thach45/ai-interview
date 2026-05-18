import apiClient from "../../../shared/services/apiClient";

export interface SubscriptionPackage {
  id: string;
  name: string;
  tagline?: string;
  price: number;
  oldPrice?: number;
  durationDays: number;
  credits: number;
  isPopular: boolean;
  features: string[];
  icon: string;
  isActive?: boolean;
}

export interface PaymentInfo {
  transactionId: string;
  qrUrl: string;
  amount: number;
  description: string;
  packageName: string;
}

export const subscriptionApi = {
  /** Lấy danh sách các gói dịch vụ */
  getPackages: () =>
    apiClient.get<any, { success: boolean; data: SubscriptionPackage[] }>(
      "/subscriptions/packages"
    ),

  /** Tạo yêu cầu mua gói */
  purchase: (packageId: string) =>
    apiClient.post<any, { success: boolean; data: PaymentInfo }>(
      "/subscriptions/purchase",
      { packageId }
    ),

  /** Lấy trạng thái giao dịch chuyển khoản */
  getTransactionStatus: (id: string) =>
    apiClient.get<any, { success: boolean; data: { id: string; status: string; creditsAdded: number } }>(
      `/subscriptions/transactions/${id}/status`
    ),

  // ==========================
  // ADMIN PACKAGES CRUD APIs
  // ==========================

  /** Admin: Lấy tất cả các gói kể cả inactive */
  adminGetPackages: () =>
    apiClient.get<any, { success: boolean; data: SubscriptionPackage[] }>(
      "/admin/packages"
    ),

  /** Admin: Tạo gói mới */
  adminCreatePackage: (data: Omit<SubscriptionPackage, 'id'>) =>
    apiClient.post<any, { success: boolean; data: SubscriptionPackage }>(
      "/admin/packages",
      data
    ),

  /** Admin: Cập nhật gói */
  adminUpdatePackage: (id: string, data: Partial<SubscriptionPackage>) =>
    apiClient.patch<any, { success: boolean; data: SubscriptionPackage }>(
      `/admin/packages/${id}`,
      data
    ),

  /** Admin: Xóa gói */
  adminDeletePackage: (id: string) =>
    apiClient.delete<any, { success: boolean; message: string }>(
      `/admin/packages/${id}`
    ),

  // ==========================
  // ADMIN TRANSACTIONS APIs
  // ==========================

  /** Admin: Lấy danh sách giao dịch phân trang & lọc */
  adminGetTransactions: (params: { type?: string; status?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get<any, { success: boolean; data: { transactions: any[]; pagination: any } }>(
      "/admin/transactions",
      { params }
    ),

  /** Admin: Lấy thống kê tổng quan giao dịch */
  adminGetTransactionStats: () =>
    apiClient.get<any, { success: boolean; data: { totalRevenue: number; creditsDeposited: number; creditsCompensated: number; pendingTransactions: number } }>(
      "/admin/transactions/stats"
    ),

  /** Admin: Tạo giao dịch nạp credit bằng tay */
  adminCreateManualTransaction: (data: { userEmail: string; creditsAdded: number; type: 'COMPENSATION' | 'PROMOTION'; reason?: string }) =>
    apiClient.post<any, { success: boolean; data: any }>(
      "/admin/transactions/manual",
      data
    ),

  /** Admin: Duyệt hoặc hủy giao dịch thủ công */
  adminUpdateTransactionStatus: (id: string, status: 'SUCCESS' | 'FAILED') =>
    apiClient.patch<any, { success: boolean; data: any }>(
      `/admin/transactions/${id}/status`,
      { status }
    ),

  /** Admin: Xóa vĩnh viễn giao dịch khỏi hệ thống */
  adminDeleteTransaction: (id: string) =>
    apiClient.delete<any, { success: boolean; message: string }>(
      `/admin/transactions/${id}`
    ),
};

export default subscriptionApi;
