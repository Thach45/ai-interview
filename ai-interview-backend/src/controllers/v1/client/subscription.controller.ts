import { Request, Response } from 'express';
import {
  SubscriptionService,
  subscriptionService,
} from '../../../services/client/subscription.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendResponse } from '../../../utils/apiResponse';

class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Lấy danh sách các gói dịch vụ hoạt động
   */
  getPackages = asyncHandler(async (req: Request, res: Response) => {
    const packages = await this.subscriptionService.getActivePackages();
    return sendResponse(res, 200, 'Packages retrieved successfully', packages);
  });

  /**
   * Tạo yêu cầu mua gói dịch vụ (sinh QR)
   */
  purchasePackage = asyncHandler(async (req: Request, res: Response) => {
    const { packageId } = req.body;
    const userId = (req as any).user.id;

    if (!packageId) {
      return sendResponse(res, 400, 'Thiếu thông tin gói dịch vụ');
    }

    const paymentInfo = await this.subscriptionService.createPurchaseTransaction(userId, packageId);
    return sendResponse(res, 201, 'Giao dịch mua gói được khởi tạo thành công', paymentInfo);
  });

  /**
   * Webhook nhận thông báo đối soát tự động từ Sepay
   */
  handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const apiKey = req.headers['x-api-key'];
    const secretKey = process.env.SEPAY_WEBHOOK_KEY;

    if (secretKey && apiKey !== secretKey) {
      return sendResponse(res, 401, 'Unauthorized webhook request');
    }

    const result = await this.subscriptionService.handleSepayWebhook(req.body);

    if (result.success) {
      return sendResponse(res, 200, 'Webhook processed successfully');
    } else {
      return sendResponse(res, 400, result.message || 'Webhook processing failed', result);
    }
  });

  /**
   * Lấy trạng thái của một giao dịch chuyển khoản phục vụ Polling
   */
  getTransactionStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const transaction = await this.subscriptionService.getTransactionByIdAndUser(id, userId);
    if (!transaction) {
      return sendResponse(res, 404, 'Không tìm thấy giao dịch chuyển khoản');
    }

    return sendResponse(res, 200, 'Transaction status retrieved successfully', {
      id: transaction.id,
      status: transaction.status,
      creditsAdded: transaction.creditsAdded,
    });
  });
}

export const subscriptionController = new SubscriptionController(subscriptionService);
export default subscriptionController;
