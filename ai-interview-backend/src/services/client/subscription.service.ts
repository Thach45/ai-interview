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

    const acc = process.env.SO_TAI_KHOAN;
    const bank = process.env.NGAN_HANG;
    if (!acc || !bank) {
      throw new Error('Thiếu cấu hình SO_TAI_KHOAN hoặc NGAN_HANG trong file .env');
    }

    if (existingPending && existingPending.paymentRefId) {
      // Tái sử dụng giao dịch cũ đang PENDING để giữ nguyên mã chuyển khoản & QR (tránh sinh thêm bản ghi rác)
      const qrUrl = `https://qr.sepay.vn/img?acc=${acc}&bank=${bank}&amount=${pkg.price}&des=${existingPending.paymentRefId}`;
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

    const qrUrl = `https://qr.sepay.vn/img?acc=${acc}&bank=${bank}&amount=${pkg.price}&des=${description}`;

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
    let transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { user: true },
    });

    if (!transaction) return null;

    if (transaction.status === PaymentStatus.PENDING) {
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

      // THỰC HIỆN POLLING TỪ SEPAY
      const expectedAmount = transaction.amount;
      const sepayAccountNumber = process.env.SO_TAI_KHOAN;
      const sepayApiToken = process.env.SEPAY_API_KEY;

      if (sepayAccountNumber && sepayApiToken && transaction.paymentRefId) {
        const url = `https://my.sepay.vn/userapi/transactions/list?account_number=${sepayAccountNumber}&limit=20`;

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sepayApiToken}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();

            if (responseData && responseData.transactions) {
              const transactions = responseData.transactions as any[];

              for (const sepayTx of transactions) {
                const transactionContent: string | undefined = sepayTx.transaction_content;
                const amountInStr: string | undefined = sepayTx.amount_in;
                const sepayId = sepayTx.id;

                if (!transactionContent || !amountInStr) continue;

                // Kiểm tra nội dung chuyển khoản có chứa mã đối soát không
                if (
                  transactionContent.toLowerCase().includes(transaction!.paymentRefId!.toLowerCase())
                ) {
                  try {
                    const amountIn = parseFloat(amountInStr);

                    if (amountIn >= expectedAmount) {
                      // Kiểm tra xem sepayTransactionId này đã được xử lý chưa để tránh double processing
                      const alreadyProcessed = await prisma.transaction.findFirst({
                        where: { sepayTransactionId: sepayId.toString() },
                      });

                      if (!alreadyProcessed) {
                        // Cập nhật trạng thái giao dịch thành công và cộng credit
                        await prisma.$transaction([
                          prisma.transaction.update({
                            where: { id: transaction!.id },
                            data: {
                              status: PaymentStatus.SUCCESS,
                              sepayTransactionId: sepayId.toString(),
                              updatedAt: new Date(),
                            },
                          }),
                          prisma.user.update({
                            where: { id: transaction!.userId },
                            data: {
                              creditsBalance: {
                                increment:
                                  transaction!.creditsAdded === -1
                                    ? 999999
                                    : transaction!.creditsAdded,
                              },
                            },
                          }),
                        ]);

                        console.log(
                          `✅ Đã nạp ${transaction!.creditsAdded} credits cho user ${transaction!.user.email} qua Polling`,
                        );

                        // Lấy lại transaction mới nhất để trả về
                        transaction = await prisma.transaction.findUnique({
                          where: { id: transaction!.id },
                          include: { user: true },
                        });
                        break; // Đã tìm thấy và xử lý, thoát vòng lặp
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing amount from Sepay:', e);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error polling Sepay:', error);
          // Không throw lỗi để client có thể tiếp tục poll nếu sepay lỗi tạm thời
        }
      }
    }

    return transaction;
  }
}

export const subscriptionService = new SubscriptionService();
