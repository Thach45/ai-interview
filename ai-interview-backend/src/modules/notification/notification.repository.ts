import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.NotificationWhereInput;
      orderBy?: Prisma.NotificationOrderByWithRelationInput;
      include?: Prisma.NotificationInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).notification.findMany(params);
  }

  async count(
    where?: Prisma.NotificationWhereInput,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).notification.count({ where });
  }

  async create(
    data: Prisma.NotificationCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).notification.create({ data });
  }

  async createMany(
    data: Prisma.NotificationCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).notification.createMany({ data });
  }

  async updateMany(
    where: Prisma.NotificationWhereInput,
    data:
      | Prisma.NotificationUpdateInput
      | Prisma.NotificationUncheckedUpdateManyInput,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).notification.updateMany({ where, data });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    return this.getClient(tx).notification.delete({ where: { id } });
  }
}
