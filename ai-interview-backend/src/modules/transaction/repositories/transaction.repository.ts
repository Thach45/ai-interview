import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.TransactionWhereUniqueInput;
      include?: Prisma.TransactionInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.TransactionWhereInput;
      include?: Prisma.TransactionInclude;
      orderBy?: Prisma.TransactionOrderByWithRelationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.TransactionWhereInput;
      orderBy?: Prisma.TransactionOrderByWithRelationInput;
      include?: Prisma.TransactionInclude;
      select?: Prisma.TransactionSelect;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.findMany(params);
  }

  async count(
    params?: { where?: Prisma.TransactionWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.count(params);
  }

  async aggregate(
    params: {
      _sum?: Prisma.TransactionSumAggregateInputType;
      where?: Prisma.TransactionWhereInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.aggregate(params);
  }

  async create(
    params: {
      data:
        Prisma.TransactionUncheckedCreateInput | Prisma.TransactionCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.create(params);
  }

  async update(
    params: {
      where: Prisma.TransactionWhereUniqueInput;
      data: Prisma.TransactionUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.update(params);
  }

  async updateMany(
    params: {
      where: Prisma.TransactionWhereInput;
      data: Prisma.TransactionUpdateManyMutationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.updateMany(params);
  }

  async delete(
    params: { where: Prisma.TransactionWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).transaction.delete(params);
  }
}
