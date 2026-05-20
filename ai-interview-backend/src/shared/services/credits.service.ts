import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { BadRequestException, NotFoundException } from '../../exceptions';

export class CreditsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  /**
   * Kiểm tra số dư lượt phỏng vấn (creditsBalance) của người dùng
   * @param userId ID của người dùng cần kiểm tra
   * @returns Thông tin người dùng nếu hợp lệ
   * @throws NotFoundException nếu không tìm thấy người dùng
   * @throws BadRequestException nếu tài khoản hết lượt phỏng vấn (credits <= 0)
   */
  async checkCredits(userId: string) {
    const user = await this.prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (user.creditsBalance <= 0) {
      throw new BadRequestException(
        'Tài khoản của bạn đã hết lượt phỏng vấn. Vui lòng nạp thêm credit!'
      );
    }

    return user;
  }

  /**
   * Khấu trừ 1 credit lượt phỏng vấn của người dùng
   * @param userId ID của người dùng cần trừ credit
   * @param tx Prisma Transaction Client (nếu thực hiện trong transaction)
   */
  async decrementCredits(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prismaClient;
    return client.user.update({
      where: { id: userId },
      data: { creditsBalance: { decrement: 1 } },
    });
  }
}

export const creditsService = new CreditsService(prisma);
