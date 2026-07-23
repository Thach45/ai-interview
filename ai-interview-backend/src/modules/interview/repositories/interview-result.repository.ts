import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InterviewResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.InterviewResultWhereUniqueInput;
      include?: Prisma.InterviewResultInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.InterviewResultWhereInput;
      include?: Prisma.InterviewResultInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.InterviewResultWhereInput;
      orderBy?: Prisma.InterviewResultOrderByWithRelationInput;
      include?: Prisma.InterviewResultInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.findMany(params);
  }

  async count(
    params?: { where?: Prisma.InterviewResultWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.count(params);
  }

  async create(
    params: {
      data:
        | Prisma.InterviewResultUncheckedCreateInput
        | Prisma.InterviewResultCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.create(params);
  }

  async update(
    params: {
      where: Prisma.InterviewResultWhereUniqueInput;
      data: Prisma.InterviewResultUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.update(params);
  }

  async upsert(
    params: {
      where: Prisma.InterviewResultWhereUniqueInput;
      update:
        | Prisma.InterviewResultUncheckedUpdateInput
        | Prisma.InterviewResultUpdateInput;
      create:
        | Prisma.InterviewResultUncheckedCreateInput
        | Prisma.InterviewResultCreateInput;
      include?: Prisma.InterviewResultInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.upsert(params);
  }

  async delete(
    params: { where: Prisma.InterviewResultWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewResult.delete(params);
  }
}
