import { PrismaClient, TransactionType, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminTransactionsService {
  /**
   * Tự động quét và hủy các giao dịch quá hạn 5 phút (PENDING -> FAILED)
   */
  async autoExpireTransactions() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await prisma.transaction.updateMany({
      where: {
        status: PaymentStatus.PENDING,
        createdAt: {
          lt: fiveMinutesAgo,
        },
      },
      data: {
        status: PaymentStatus.FAILED,
        updatedAt: new Date(),
      },
    });
  }

  async getAllTransactions(filters: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    // Tự động hủy các giao dịch hết hạn trước khi truy vấn
    await this.autoExpireTransactions();

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.type && filters.type !== 'ALL') {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        {
          paymentRefId: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          sepayTransactionId: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            fullName: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          package: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDashboardStats() {
    // Tự động hủy các giao dịch hết hạn trước khi tổng hợp số liệu
    await this.autoExpireTransactions();

    // 1. Tổng doanh thu (Giao dịch DEPOSIT & SUCCESS)
    const depositSuccess = await prisma.transaction.aggregate({
      where: {
        type: TransactionType.DEPOSIT,
        status: PaymentStatus.SUCCESS,
      },
      _sum: {
        amount: true,
      },
    });

    // 2. Credits đã nạp (DEPOSIT & SUCCESS)
    const creditsDeposited = await prisma.transaction.aggregate({
      where: {
        type: TransactionType.DEPOSIT,
        status: PaymentStatus.SUCCESS,
      },
      _sum: {
        creditsAdded: true,
      },
    });

    // 3. Đền bù / Khuyến mãi (COMPENSATION hoặc PROMOTION)
    const compensationPromotion = await prisma.transaction.aggregate({
      where: {
        type: {
          in: [TransactionType.COMPENSATION, TransactionType.PROMOTION],
        },
        status: PaymentStatus.SUCCESS,
      },
      _sum: {
        creditsAdded: true,
      },
    });

    // 4. Số giao dịch đang PENDING
    const pendingCount = await prisma.transaction.count({
      where: {
        status: PaymentStatus.PENDING,
      },
    });

    return {
      totalRevenue: depositSuccess._sum.amount || 0,
      creditsDeposited: creditsDeposited._sum.creditsAdded || 0,
      creditsCompensated: compensationPromotion._sum.creditsAdded || 0,
      pendingTransactions: pendingCount || 0,
    };
  }

  async createManualTransaction(data: {
    userEmail: string;
    creditsAdded: number;
    type: TransactionType;
    reason?: string;
  }) {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: data.userEmail,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      throw new Error('Không tìm thấy người dùng có email này');
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: data.type,
        amount: 0, // Giao dịch do admin nạp tay có giá bán là 0 VNĐ
        creditsAdded: data.creditsAdded,
        status: PaymentStatus.SUCCESS,
        paymentRefId: data.reason || `${data.type} cấp bởi Admin`,
      },
      include: {
        user: true,
      },
    });

    // Cộng số dư credits của người dùng trong cơ sở dữ liệu
    await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsBalance: {
          increment: data.creditsAdded === -1 ? 999999 : data.creditsAdded,
        },
      },
    });

    return transaction;
  }

  /**
   * Cập nhật trạng thái giao dịch thủ công (Duyệt tay hoặc Hủy giao dịch) bởi Admin
   */
  async updateTransactionStatus(id: string, status: PaymentStatus) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!transaction) {
      throw new Error('Không tìm thấy giao dịch');
    }

    if (transaction.status !== PaymentStatus.PENDING) {
      throw new Error('Giao dịch này đã được xử lý từ trước và không thể thay đổi trạng thái');
    }

    if (status === PaymentStatus.SUCCESS) {
      // Xác nhận thành công và cộng credits vào tài khoản học viên
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id },
          data: {
            status: PaymentStatus.SUCCESS,
            updatedAt: new Date(),
          },
        }),
        prisma.user.update({
          where: { id: transaction.userId },
          data: {
            creditsBalance: {
              increment: transaction.creditsAdded === -1 ? 999999 : transaction.creditsAdded,
            },
          },
        }),
      ]);
    } else {
      // Hủy giao dịch (FAILED)
      await prisma.transaction.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });
    }

    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        package: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * Admin: Xóa vĩnh viễn giao dịch khỏi cơ sở dữ liệu
   */
  async deleteTransaction(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error('Không tìm thấy giao dịch để xóa');
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return { message: 'Xóa giao dịch thành công' };
  }
}

export const adminTransactionsService = new AdminTransactionsService();
export default adminTransactionsService;
