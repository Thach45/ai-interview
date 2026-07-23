import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.JobTemplateWhereUniqueInput;
      include?: Prisma.JobTemplateInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobTemplate.findUnique(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.JobTemplateWhereInput;
      orderBy?: Prisma.JobTemplateOrderByWithRelationInput;
      include?: Prisma.JobTemplateInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobTemplate.findMany(params);
  }

  async count(
    params?: { where?: Prisma.JobTemplateWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobTemplate.count(params);
  }

  async create(
    params: {
      data:
        Prisma.JobTemplateUncheckedCreateInput | Prisma.JobTemplateCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobTemplate.create(params);
  }

  async update(
    params: {
      where: Prisma.JobTemplateWhereUniqueInput;
      data: Prisma.JobTemplateUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobTemplate.update(params);
  }

  async delete(
    params: { where: Prisma.JobTemplateWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).jobTemplate.delete(params);
  }
}
