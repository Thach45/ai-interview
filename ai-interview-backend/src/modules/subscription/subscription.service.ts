import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, TransactionType } from '@prisma/client';
import { CreatePackageDto, UpdatePackageDto } from './dto/subscription.dto';

import { SubscriptionPackageRepository } from './repositories/subscription-package.repository';
import { TransactionRepository } from '../transaction/repositories/transaction.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly subscriptionPackageRepository: SubscriptionPackageRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Lay danh sach cac goi dich vu dang hoat dong
   */
  async getPackages() {
    return this.subscriptionPackageRepository.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Tao giao dich mua goi dich vu
   */
  async purchasePackage(userId: string, packageId: string) {
    const pkg = await this.subscriptionPackageRepository.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Goi dich vu khong ton tai');
    }

    // Kiem tra xem user co giao dich PENDING nao cho goi nay trong 5 phut qua khong
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingPending = await this.transactionRepository.findFirst({
      where: {
        userId,
        packageId: pkg.id,
        status: PaymentStatus.PENDING,
        createdAt: { gte: fiveMinutesAgo },
      },
    });

    const acc = this.configService.get<string>('SO_TAI_KHOAN');
    const bank = this.configService.get<string>('NGAN_HANG');
    if (!acc || !bank) {
      throw new Error(
        'Thieu cau hinh SO_TAI_KHOAN hoac NGAN_HANG trong file .env',
      );
    }

    if (existingPending && existingPending.paymentRefId) {
      // Tai su dung giao dich cu dang PENDING
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

    // Tao giao dich moi
    const transaction = await this.transactionRepository.create({
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

    // Cap nhat paymentRefId
    await this.transactionRepository.update({
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

  /**
   * Lay trang thai giao dich, co poll Sepay neu dang PENDING
   */
  async getTransactionStatus(userId: string, transactionId: string) {
    let transaction = await this.transactionRepository.findFirst({
      where: { id: transactionId, userId },
      include: { user: true },
    });

    if (!transaction) return null;

    if (transaction.status === PaymentStatus.PENDING) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (transaction.createdAt < fiveMinutesAgo) {
        // Tu dong chuyen thanh FAILED (Het han)
        return this.transactionRepository.update({
          where: { id: transactionId },
          data: {
            status: PaymentStatus.FAILED,
            updatedAt: new Date(),
          },
        });
      }

      // Poll Sepay de kiem tra thanh toan
      const sepayAccountNumber = this.configService.get<string>('SO_TAI_KHOAN');
      const sepayApiToken = this.configService.get<string>('SEPAY_API_KEY');

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
                const transactionContent: string | undefined =
                  sepayTx.transaction_content;
                const amountInStr: string | undefined = sepayTx.amount_in;
                const sepayId = sepayTx.id;

                if (!transactionContent || !amountInStr) continue;

                if (
                  transactionContent
                    .toLowerCase()
                    .includes(transaction!.paymentRefId!.toLowerCase())
                ) {
                  try {
                    const amountIn = parseFloat(amountInStr);

                    if (amountIn >= transaction!.amount) {
                      // Kiem tra da xu ly chua de tranh double processing
                      const alreadyProcessed =
                        await this.transactionRepository.findFirst({
                          where: { sepayTransactionId: sepayId.toString() },
                        });

                      if (!alreadyProcessed) {
                        await this.transactionRepository.update({
                          where: { id: transaction!.id },
                          data: {
                            status: PaymentStatus.SUCCESS,
                            sepayTransactionId: sepayId.toString(),
                            updatedAt: new Date(),
                          },
                        });
                        await this.userRepository.update(transaction!.userId, {
                          creditsBalance: {
                            increment:
                              transaction!.creditsAdded === -1
                                ? 999999
                                : transaction!.creditsAdded,
                          },
                        });

                        // Lay lai transaction moi nhat
                        transaction =
                          await this.transactionRepository.findUnique({
                            where: { id: transaction!.id },
                            include: { user: true },
                          });
                        break;
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
        }
      }
    }

    return transaction;
  }

  // ==========================
  // ADMIN METHODS (Packages)
  // ==========================

  async getAllPackagesForAdmin() {
    return this.subscriptionPackageRepository.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async getPackageById(id: string) {
    const pkg = await this.subscriptionPackageRepository.findUnique({
      where: { id },
    });
    if (!pkg) throw new Error('Package not found');
    return pkg;
  }

  async createPackage(dto: CreatePackageDto) {
    return this.subscriptionPackageRepository.create({
      data: dto,
    });
  }

  async updatePackage(id: string, dto: UpdatePackageDto) {
    return this.subscriptionPackageRepository.update({
      where: { id },
      data: dto,
    });
  }

  async deletePackage(id: string) {
    return this.subscriptionPackageRepository.delete({
      where: { id },
    });
  }
}
