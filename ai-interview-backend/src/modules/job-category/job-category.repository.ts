import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.JobCategoryWhereUniqueInput;
      include?: Prisma.JobCategoryInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobCategory.findUnique(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.JobCategoryWhereInput;
      orderBy?: Prisma.JobCategoryOrderByWithRelationInput;
      include?: Prisma.JobCategoryInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobCategory.findMany(params);
  }

  async count(
    params?: { where?: Prisma.JobCategoryWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobCategory.count(params);
  }

  async create(
    params: {
      data:
        Prisma.JobCategoryUncheckedCreateInput | Prisma.JobCategoryCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobCategory.create(params);
  }

  async update(
    params: {
      where: Prisma.JobCategoryWhereUniqueInput;
      data: Prisma.JobCategoryUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobCategory.update(params);
  }

  async delete(
    params: { where: Prisma.JobCategoryWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobCategory.delete(params);
  }
}
