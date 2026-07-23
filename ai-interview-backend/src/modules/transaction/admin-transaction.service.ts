import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, TransactionType } from '@prisma/client';

import { TransactionRepository } from './repositories/transaction.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AdminTransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Tu dong quet va huy cac giao dich qua han 5 phut (PENDING -> FAILED)
   */
  private async autoExpireTransactions() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await this.transactionRepository.updateMany({
      where: {
        status: PaymentStatus.PENDING,
        createdAt: { lt: fiveMinutesAgo },
      },
      data: {
        status: PaymentStatus.FAILED,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Lay danh sach giao dich phan trang va loc tim kiem
   */
  async getTransactions(query: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    await this.autoExpireTransactions();

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.type && query.type !== 'ALL') {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { paymentRefId: { contains: query.search, mode: 'insensitive' } },
        { sepayTransactionId: { contains: query.search, mode: 'insensitive' } },
        { user: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [transactions, total] = await this.prisma.$transaction([
      // Dùng PrismaService vì $transaction không hỗ trợ custom repo trả về Promise trực tiếp
      this.prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
          package: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
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

  /**
   * Lay cac chi so thong ke giao dich cho Dashboard admin
   */
  async getStats() {
    // Tu dong huy cac giao dich het han truoc khi tong hop
    await this.autoExpireTransactions();

    // Tong doanh thu (Giao dich DEPOSIT & SUCCESS)
    const depositSuccess = await this.transactionRepository.aggregate({
      where: {
        type: TransactionType.DEPOSIT,
        status: PaymentStatus.SUCCESS,
      },
      _sum: { amount: true },
    });

    // Credits da nap (DEPOSIT & SUCCESS)
    const creditsDeposited = await this.transactionRepository.aggregate({
      where: {
        type: TransactionType.DEPOSIT,
        status: PaymentStatus.SUCCESS,
      },
      _sum: { creditsAdded: true },
    });

    // Den bu / Khuyen mai (COMPENSATION hoac PROMOTION)
    const compensationPromotion = await this.transactionRepository.aggregate({
      where: {
        type: {
          in: [TransactionType.COMPENSATION, TransactionType.PROMOTION],
        },
        status: PaymentStatus.SUCCESS,
      },
      _sum: { creditsAdded: true },
    });

    // So giao dich dang PENDING
    const pendingCount = await this.transactionRepository.count({
      where: { status: PaymentStatus.PENDING },
    });

    return {
      totalRevenue: depositSuccess._sum?.amount || 0,
      creditsDeposited: creditsDeposited._sum?.creditsAdded || 0,
      creditsCompensated: compensationPromotion._sum?.creditsAdded || 0,
      pendingTransactions: pendingCount || 0,
    };
  }

  /**
   * Admin cap nap credit thu cong (Den bu/Khuyen mai) cho hoc vien
   */
  async createManual(data: {
    userEmail: string;
    creditsAdded: number;
    type: TransactionType;
    reason?: string;
  }) {
    const user = await this.userRepository.findFirst({
      email: { equals: data.userEmail, mode: 'insensitive' },
    });

    if (!user) {
      throw new Error('Khong tim thay nguoi dung co email nay');
    }

    const transaction = await this.transactionRepository.create({
      data: {
        userId: user.id,
        type: data.type,
        amount: 0, // Giao dich do admin nap tay co gia ban la 0 VND
        creditsAdded: data.creditsAdded,
        status: PaymentStatus.SUCCESS,
        paymentRefId: data.reason || `${data.type} cap boi Admin`,
      },
    });

    // Cong so du credits cua nguoi dung
    await this.userRepository.update(user.id, {
      creditsBalance: {
        increment: data.creditsAdded === -1 ? 999999 : data.creditsAdded,
      },
    });

    return transaction;
  }

  /**
   * Cap nhat trang thai giao dich thu cong (Duyet hoac Huy) boi Admin
   */
  async updateStatus(id: string, status: PaymentStatus) {
    const transaction = await this.transactionRepository.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!transaction) {
      throw new Error('Khong tim thay giao dich');
    }

    if (transaction.status !== PaymentStatus.PENDING) {
      throw new Error(
        'Giao dich nay da duoc xu ly tu truoc va khong the thay doi trang thai',
      );
    }

    if (status === PaymentStatus.SUCCESS) {
      // Xac nhan thanh cong va cong credits vao tai khoan
      await this.transactionRepository.update({
        where: { id },
        data: {
          status: PaymentStatus.SUCCESS,
          updatedAt: new Date(),
        },
      });
      await this.userRepository.update(transaction.userId, {
        creditsBalance: {
          increment:
            transaction.creditsAdded === -1 ? 999999 : transaction.creditsAdded,
        },
      });
    } else {
      // Huy giao dich (FAILED)
      await this.transactionRepository.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });
    }

    return this.transactionRepository.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
        package: {
          select: { name: true },
        },
      },
    });
  }

  /**
   * Admin xoa vinh vien giao dich khoi co so du lieu
   */
  async delete(id: string) {
    const transaction = await this.transactionRepository.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new Error('Khong tim thay giao dich de xoa');
    }

    await this.transactionRepository.delete({
      where: { id },
    });

    return { message: 'Xoa giao dich thanh cong' };
  }
}
