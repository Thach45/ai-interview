import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  AdminTransactionsService,
  adminTransactionsService,
} from '../../../services/admin/transactions.service';
import { sendResponse } from '../../../utils/apiResponse';

class AdminTransactionsController {
  constructor(private readonly transactionsService: AdminTransactionsService) {}

  /**
   * Admin: Lấy danh sách giao dịch phân trang và lọc tìm kiếm
   */
  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const { type, status, search, page, limit } = req.query;

    const result = await this.transactionsService.getAllTransactions({
      type: type as string,
      status: status as string,
      search: search as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    return sendResponse(res, 200, 'Transactions retrieved successfully', result);
  });

  /**
   * Admin: Lấy các chỉ số thống kê giao dịch cho Dashboard admin
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.transactionsService.getDashboardStats();
    return sendResponse(res, 200, 'Transaction stats retrieved successfully', stats);
  });

  /**
   * Admin: Cấp nạp credit thủ công bằng tay (Đền bù/Khuyến mãi) cho học viên
   */
  createManual = asyncHandler(async (req: Request, res: Response) => {
    const { userEmail, creditsAdded, type, reason } = req.body;

    if (!userEmail || creditsAdded === undefined || !type) {
      return sendResponse(
        res,
        400,
        'Thiếu thông tin người dùng, số lượng credit hoặc phân loại giao dịch',
      );
    }

    const transaction = await this.transactionsService.createManualTransaction({
      userEmail,
      creditsAdded: parseInt(creditsAdded),
      type,
      reason,
    });

    return sendResponse(res, 201, 'Credit manual deposit success', transaction);
  });

  /**
   * Admin: Cập nhật trạng thái giao dịch thủ công (Duyệt hoặc Hủy)
   */
  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendResponse(res, 400, 'Thiếu thông tin trạng thái cập nhật');
    }

    const transaction = await this.transactionsService.updateTransactionStatus(id, status);
    return sendResponse(res, 200, 'Cập nhật trạng thái giao dịch thành công', transaction);
  });

  /**
   * Admin: Xóa vĩnh viễn giao dịch khỏi hệ thống
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.transactionsService.deleteTransaction(id);
    return sendResponse(res, 200, result.message);
  });
}

export const adminTransactionsController = new AdminTransactionsController(
  adminTransactionsService,
);
export default adminTransactionsController;
