import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InterviewSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.InterviewSessionWhereUniqueInput;
      include?: Prisma.InterviewSessionInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.InterviewSessionWhereInput;
      include?: Prisma.InterviewSessionInclude;
      orderBy?: Prisma.InterviewSessionOrderByWithRelationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.InterviewSessionWhereInput;
      orderBy?: Prisma.InterviewSessionOrderByWithRelationInput;
      include?: Prisma.InterviewSessionInclude;
      select?: Prisma.InterviewSessionSelect;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.findMany(params);
  }

  async count(
    params?: { where?: Prisma.InterviewSessionWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.count(params);
  }

  async aggregate(
    params: {
      _count?: Prisma.InterviewSessionCountAggregateInputType | true;
      _avg?: Prisma.InterviewSessionAvgAggregateInputType;
      _sum?: Prisma.InterviewSessionSumAggregateInputType;
      _min?: Prisma.InterviewSessionMinAggregateInputType;
      _max?: Prisma.InterviewSessionMaxAggregateInputType;
      where?: Prisma.InterviewSessionWhereInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.aggregate(params);
  }

  async create(
    params: {
      data:
        | Prisma.InterviewSessionUncheckedCreateInput
        | Prisma.InterviewSessionCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.create(params);
  }

  async update(
    params: {
      where: Prisma.InterviewSessionWhereUniqueInput;
      data: Prisma.InterviewSessionUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.update(params);
  }

  async delete(
    params: { where: Prisma.InterviewSessionWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewSession.delete(params);
  }
}
