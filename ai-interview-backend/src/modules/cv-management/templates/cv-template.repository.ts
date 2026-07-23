import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CvTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.CvTemplateWhereUniqueInput;
      include?: Prisma.CvTemplateInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.CvTemplateWhereInput;
      include?: Prisma.CvTemplateInclude;
      orderBy?: Prisma.CvTemplateOrderByWithRelationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.CvTemplateWhereInput;
      orderBy?: Prisma.CvTemplateOrderByWithRelationInput;
      include?: Prisma.CvTemplateInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.findMany(params);
  }

  async count(
    params?: { where?: Prisma.CvTemplateWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.count(params);
  }

  async create(
    params: {
      data:
        Prisma.CvTemplateUncheckedCreateInput | Prisma.CvTemplateCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.create(params);
  }

  async update(
    params: {
      where: Prisma.CvTemplateWhereUniqueInput;
      data:
        Prisma.CvTemplateUncheckedUpdateInput | Prisma.CvTemplateUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.update(params);
  }

  async delete(
    params: { where: Prisma.CvTemplateWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvTemplate.delete(params);
  }
}
