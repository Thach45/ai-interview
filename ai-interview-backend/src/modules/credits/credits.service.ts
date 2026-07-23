import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  NotFoundException,
} from '../../common/exceptions/AppException';

import { UserRepository } from '../user/user.repository';

@Injectable()
export class CreditsService {
  constructor(private readonly userRepository: UserRepository) {}

  async checkCredits(userId: string, creditAmount: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (user.creditsBalance < creditAmount) {
      throw new BadRequestException(
        `Tài khoản của bạn không đủ ${creditAmount} lượt phỏng vấn. Vui lòng nạp thêm credit!`,
      );
    }

    return user;
  }

  async decrementCredits(
    userId: string,
    creditAmount: number,
    tx?: Prisma.TransactionClient,
  ) {
    return this.userRepository.update(
      userId,
      { creditsBalance: { decrement: creditAmount } },
      undefined,
      tx,
    );
  }
}
