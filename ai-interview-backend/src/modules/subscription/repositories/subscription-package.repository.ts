import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionPackageRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.SubscriptionPackageWhereUniqueInput;
      include?: Prisma.SubscriptionPackageInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.SubscriptionPackageWhereInput;
      include?: Prisma.SubscriptionPackageInclude;
      orderBy?: Prisma.SubscriptionPackageOrderByWithRelationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.SubscriptionPackageWhereInput;
      orderBy?: Prisma.SubscriptionPackageOrderByWithRelationInput;
      include?: Prisma.SubscriptionPackageInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.findMany(params);
  }

  async count(
    params?: { where?: Prisma.SubscriptionPackageWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.count(params);
  }

  async create(
    params: { data: Prisma.SubscriptionPackageCreateInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.create(params);
  }

  async update(
    params: {
      where: Prisma.SubscriptionPackageWhereUniqueInput;
      data: Prisma.SubscriptionPackageUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.update(params);
  }

  async delete(
    params: { where: Prisma.SubscriptionPackageWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).subscriptionPackage.delete(params);
  }
}
