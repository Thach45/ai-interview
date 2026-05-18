import { PrismaClient, PaymentStatus, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export class SubscriptionService {
  /**
   * Lấy danh sách các gói dịch vụ đang hoạt động
   */
  async getActivePackages() {
    return await prisma.subscriptionPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Tạo giao dịch mua gói dịch vụ
   */
  async createPurchaseTransaction(userId: string, packageId: string) {
    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Gói dịch vụ không tồn tại');
    }

    // [TỐI ƯU HÓA UX/TRÁNH TRÙNG LẶP]: Kiểm tra xem user có giao dịch PENDING nào cho gói này trong vòng 5 phút qua không
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingPending = await prisma.transaction.findFirst({
      where: {
        userId,
        packageId: pkg.id,
        status: PaymentStatus.PENDING,
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Lấy link QR trực tiếp từ file .env
    const baseUrl = process.env.URL_QR_TRANSFER;
    if (!baseUrl) {
      throw new Error('Thiếu cấu hình URL_QR_TRANSFER trong file .env');
    }
    const separator = baseUrl.includes('?') ? '&' : '?';

    if (existingPending && existingPending.paymentRefId) {
      // Tái sử dụng giao dịch cũ đang PENDING để giữ nguyên mã chuyển khoản & QR (tránh sinh thêm bản ghi rác)
      const qrUrl = `${baseUrl}${separator}amount=${pkg.price}&des=${existingPending.paymentRefId}`;
      return {
        transactionId: existingPending.id,
        qrUrl,
        amount: pkg.price,
        description: existingPending.paymentRefId,
        packageName: pkg.name,
        createdAt: existingPending.createdAt,
      };
    }

    // Tạo mã đối soát ngẫu nhiên hoặc theo ID
    // Sepay thường quét mô tả giao dịch để khớp lệnh
    // Ví dụ: "NAP TIEN XINTERVIEW {transactionId}"

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        packageId: pkg.id,
        amount: pkg.price,
        creditsAdded: pkg.credits,
        type: TransactionType.DEPOSIT,
        status: PaymentStatus.PENDING,
      },
    });

    const description = `XINT ${transaction.id.slice(-6).toUpperCase()}`;

    // Cập nhật paymentRefId chính là description để sau này đối soát
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentRefId: description },
    });

    const qrUrl = `${baseUrl}${separator}amount=${pkg.price}&des=${description}`;

    return {
      transactionId: transaction.id,
      qrUrl,
      amount: pkg.price,
      description,
      packageName: pkg.name,
      createdAt: transaction.createdAt,
    };
  }

  async getTransactionByIdAndUser(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (transaction && transaction.status === PaymentStatus.PENDING) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (transaction.createdAt < fiveMinutesAgo) {
        // Tự động chuyển thành FAILED (Hết hạn)
        return await prisma.transaction.update({
          where: { id },
          data: {
            status: PaymentStatus.FAILED,
            updatedAt: new Date(),
          },
        });
      }
    }

    return transaction;
  }

  /**
   * Xử lý Webhook từ Sepay
   */
  async handleSepayWebhook(data: any) {
    console.log('📥 Nhận Webhook Sepay:', JSON.stringify(data));

    // data cấu trúc từ Sepay:
    // {
    //   id: 123456,
    //   content: "XINT ABCDEF",
    //   transferAmount: 199000,
    //   ...
    // }

    const { content, transferAmount, id: sepayId } = data;

    if (!content) {
      console.log('⚠️ Nội dung chuyển khoản trống');
      return { success: false, message: 'Transfer content is empty' };
    }

    // Kiểm tra trùng lặp giao dịch Sepay (nếu sepayId đã được xử lý trước đó)
    if (sepayId) {
      const alreadyProcessed = await prisma.transaction.findFirst({
        where: { sepayTransactionId: sepayId.toString() },
      });
      if (alreadyProcessed) {
        console.log(`⚠️ Giao dịch Sepay ID ${sepayId} đã được xử lý trước đó.`);
        return { success: true, message: 'Transaction already processed' };
      }
    }

    // Lấy danh sách giao dịch PENDING trong vòng 15 phút qua để đối soát
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        status: PaymentStatus.PENDING,
        createdAt: {
          gte: fifteenMinutesAgo,
        },
      },
      include: {
        user: true,
      },
    });

    // Tìm giao dịch mà nội dung chuyển khoản từ ngân hàng (content) chứa mã đối soát (paymentRefId)
    const transaction = pendingTransactions.find((t) => {
      if (!t.paymentRefId) return false;
      return content.toLowerCase().includes(t.paymentRefId.toLowerCase());
    });

    if (!transaction) {
      console.log(`⚠️ Không tìm thấy giao dịch khớp với nội dung: "${content}"`);
      return { success: false, message: 'Transaction not found' };
    }

    if (transferAmount < transaction.amount) {
      console.log(
        `⚠️ Số tiền thanh toán (${transferAmount}) nhỏ hơn giá trị đơn hàng (${transaction.amount})`,
      );
      return { success: false, message: 'Invalid amount' };
    }

    // Cập nhật trạng thái giao dịch thành công và cộng credit
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: PaymentStatus.SUCCESS,
          sepayTransactionId: sepayId ? sepayId.toString() : undefined,
          updatedAt: new Date(),
        },
      }),
      // Cộng credits cho người dùng
      prisma.user.update({
        where: { id: transaction.userId },
        data: {
          creditsBalance: {
            increment: transaction.creditsAdded === -1 ? 999999 : transaction.creditsAdded,
          },
        },
      }),
    ]);

    console.log(`✅ Đã nạp ${transaction.creditsAdded} credits cho user ${transaction.user.email}`);

    return { success: true };
  }
}

export const subscriptionService = new SubscriptionService();
