import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CvAnalysisRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.CvAnalysisWhereUniqueInput;
      include?: Prisma.CvAnalysisInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.CvAnalysisWhereInput;
      include?: Prisma.CvAnalysisInclude;
      orderBy?: Prisma.CvAnalysisOrderByWithRelationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.CvAnalysisWhereInput;
      orderBy?: Prisma.CvAnalysisOrderByWithRelationInput;
      include?: Prisma.CvAnalysisInclude;
      select?: Prisma.CvAnalysisSelect;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.findMany(params);
  }

  async count(
    params?: { where?: Prisma.CvAnalysisWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.count(params);
  }

  async create(
    params: {
      data:
        Prisma.CvAnalysisUncheckedCreateInput | Prisma.CvAnalysisCreateInput;
      include?: Prisma.CvAnalysisInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.create(params);
  }

  async update(
    params: {
      where: Prisma.CvAnalysisWhereUniqueInput;
      data: Prisma.CvAnalysisUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.update(params);
  }

  async delete(
    params: { where: Prisma.CvAnalysisWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).cvAnalysis.delete(params);
  }
}
